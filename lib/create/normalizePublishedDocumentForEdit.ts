import type { CommunityRuleSection } from "../../app/components/type/CommunityRule/CommunityRule.types";
import type { CommunityRuleLabeledBlock } from "../../app/components/type/CommunityRule/CommunityRule.types";
import type { PublishedMethodSelections } from "./buildPublishPayload";
import { parseDocumentSectionsForDisplay } from "./buildPublishPayload";
import { resolveMethodPresetIdFromLabel } from "./buildFinalReviewCategories";
import { resolveCoreValueChipIdFromLabel } from "./finalReviewChipPresets";
import {
  communicationPresetFor,
  conflictManagementPresetFor,
  decisionApproachPresetFor,
  membershipPresetFor,
  mergeCoreValueDetailWithPresets,
} from "./finalReviewChipPresets";
import { templateCategoryToGroupKey } from "./templateReviewMapping";
import type { TemplateFacetGroupKey } from "./templateReviewMapping";
import { RULE_SECTION_CATEGORY } from "./ruleSectionsFromMethodSelections";

const COMM_LABELS: Record<string, string> = {
  corePrinciple: "Core Principle & Scope",
  logisticsAdmin: "Logistics, Admin & Norms",
  codeOfConduct: "Code of Conduct",
};

const MEM_LABELS: Record<string, string> = {
  eligibility: "Eligibility & Philosophy",
  joiningProcess: "Joining Process",
  expectations: "Expectations & Removal",
};

const DEC_LABELS: Record<string, string> = {
  corePrinciple: "Core Principle",
  applicableScope: "Applicable Scope",
  stepByStepInstructions: "Step-by-Step Instructions",
  consensusLevel: "Consensus Level",
  objectionsDeadlocks: "Objections & Deadlocks",
};

const CM_LABELS: Record<string, string> = {
  corePrinciple: "Core Principle",
  applicableScope: "Applicable Scope",
  processProtocol: "Process Protocol",
  restorationFallbacks: "Restoration & Fallbacks",
};

const LABELS_BY_GROUP: Record<
  Exclude<TemplateFacetGroupKey, "coreValues">,
  Record<string, string>
> = {
  communication: COMM_LABELS,
  membership: MEM_LABELS,
  decisionApproaches: DEC_LABELS,
  conflictManagement: CM_LABELS,
};

function slugifyId(label: string): string {
  const base = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base.length > 0 ? base : "custom-method";
}

function keyForLabel(
  label: string,
  labelByKey: Record<string, string>,
): string | null {
  const trimmed = label.trim();
  for (const [key, displayLabel] of Object.entries(labelByKey)) {
    if (displayLabel === trimmed) return key;
  }
  return null;
}

function parseConsensusPercent(body: string): number | null {
  const m = body.trim().match(/^(\d+)\s*%?$/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

function sectionsRecordFromBlocks(
  blocks: CommunityRuleLabeledBlock[],
  labelByKey: Record<string, string>,
  options?: { consensusLevelKey?: string },
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const block of blocks) {
    const key = keyForLabel(block.label, labelByKey);
    if (!key) continue;
    const body = block.body.trim();
    if (options?.consensusLevelKey === key) {
      const pct = parseConsensusPercent(body);
      if (pct !== null) out[key] = pct;
      continue;
    }
    if (key === "applicableScope" || key === "selectedApplicableScope") {
      const parts = body
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      if (parts.length > 0) {
        out.selectedApplicableScope = parts;
        out.applicableScope = parts;
      }
      continue;
    }
    if (body.length > 0) out[key] = body;
  }
  return out;
}

function presetForMethod(
  groupKey: Exclude<TemplateFacetGroupKey, "coreValues">,
  id: string,
): Record<string, unknown> {
  switch (groupKey) {
    case "communication":
      return { ...communicationPresetFor(id) } as Record<string, unknown>;
    case "membership":
      return { ...membershipPresetFor(id) } as Record<string, unknown>;
    case "decisionApproaches":
      return { ...decisionApproachPresetFor(id) } as Record<string, unknown>;
    case "conflictManagement":
      return { ...conflictManagementPresetFor(id) } as Record<string, unknown>;
  }
}

function sectionsRecordFromEntry(
  entry: CommunityRuleSection["entries"][number],
  groupKey: Exclude<TemplateFacetGroupKey, "coreValues">,
  presetId: string,
): Record<string, unknown> {
  const labelByKey = LABELS_BY_GROUP[groupKey];
  const consensusKey =
    groupKey === "decisionApproaches" ? "consensusLevel" : undefined;

  if (entry.blocks && entry.blocks.length > 0) {
    const fromBlocks = sectionsRecordFromBlocks(entry.blocks, labelByKey, {
      consensusLevelKey: consensusKey,
    });
    if (Object.keys(fromBlocks).length > 0) {
      return { ...presetForMethod(groupKey, presetId), ...fromBlocks };
    }
  }

  const body = (entry.body ?? "").trim();
  if (body.length === 0) {
    return presetForMethod(groupKey, presetId);
  }

  return { ...presetForMethod(groupKey, presetId), corePrinciple: body };
}

function coreValuesFromValuesSection(
  section: CommunityRuleSection,
): Array<{ chipId: string; label: string; meaning: string; signals: string }> {
  const out: Array<{
    chipId: string;
    label: string;
    meaning: string;
    signals: string;
  }> = [];

  for (const entry of section.entries) {
    const label = entry.title.trim();
    if (!label) continue;
    const body = (entry.body ?? "").trim();
    const parts = body.length > 0 ? body.split(/\n\n+/) : [];
    const meaning = (parts[0] ?? "").trim();
    const signals = parts.slice(1).join("\n\n").trim();
    const merged = mergeCoreValueDetailWithPresets("", label, {
      meaning,
      signals,
    });
    const chipId =
      resolveCoreValueChipIdFromLabel(label) ??
      `hydrated-${label.toLowerCase()}`;
    out.push({
      chipId,
      label,
      meaning: merged.meaning,
      signals: merged.signals,
    });
  }

  return out;
}

type PublishedMethodRow = {
  id: string;
  label: string;
  sections: Record<string, unknown>;
};

function methodSelectionsFromDisplaySections(
  sections: CommunityRuleSection[],
): PublishedMethodSelections {
  const out: PublishedMethodSelections = {};

  const pushGroup = (
    key: keyof PublishedMethodSelections,
    groupKey: Exclude<TemplateFacetGroupKey, "coreValues">,
    section: CommunityRuleSection,
  ) => {
    const rows: PublishedMethodRow[] = [];
    for (const entry of section.entries) {
      const label = entry.title.trim();
      if (!label) continue;
      const id =
        resolveMethodPresetIdFromLabel(label, groupKey) ??
        `custom-${slugifyId(label)}`;
      rows.push({
        id,
        label,
        sections: sectionsRecordFromEntry(entry, groupKey, id),
      });
    }
    if (rows.length > 0) {
      switch (key) {
        case "communication":
          out.communication = rows as NonNullable<
            PublishedMethodSelections["communication"]
          >;
          break;
        case "membership":
          out.membership = rows as NonNullable<
            PublishedMethodSelections["membership"]
          >;
          break;
        case "decisionApproaches":
          out.decisionApproaches = rows as NonNullable<
            PublishedMethodSelections["decisionApproaches"]
          >;
          break;
        case "conflictManagement":
          out.conflictManagement = rows as NonNullable<
            PublishedMethodSelections["conflictManagement"]
          >;
          break;
        default:
          break;
      }
    }
  };

  for (const section of sections) {
    const groupKey = templateCategoryToGroupKey(section.categoryName);
    if (!groupKey || groupKey === "coreValues") continue;
    switch (groupKey) {
      case "communication":
        pushGroup("communication", groupKey, section);
        break;
      case "membership":
        pushGroup("membership", groupKey, section);
        break;
      case "decisionApproaches":
        pushGroup("decisionApproaches", groupKey, section);
        break;
      case "conflictManagement":
        pushGroup("conflictManagement", groupKey, section);
        break;
      default:
        break;
    }
  }

  return out;
}

function hasMethodSelections(ms: PublishedMethodSelections): boolean {
  return Boolean(
    ms.communication?.length ||
      ms.membership?.length ||
      ms.decisionApproaches?.length ||
      ms.conflictManagement?.length,
  );
}

/**
 * Ensures a stored published `document` includes `methodSelections` and
 * `coreValues` derived from display `sections` when missing (e.g. use-case
 * template duplicates). Idempotent when the document is already normalized.
 */
export function normalizePublishedDocumentForEdit(
  document: unknown,
): Record<string, unknown> {
  if (!document || typeof document !== "object" || Array.isArray(document)) {
    return {};
  }

  const doc = { ...(document as Record<string, unknown>) };
  const sections = parseDocumentSectionsForDisplay(doc);

  const existingMs = doc.methodSelections;
  const hasMs =
    existingMs &&
    typeof existingMs === "object" &&
    !Array.isArray(existingMs) &&
    hasMethodSelections(existingMs as PublishedMethodSelections);

  const existingCv = doc.coreValues;
  const hasCv = Array.isArray(existingCv) && existingCv.length > 0;

  if (!hasCv) {
    const valuesSection = sections.find(
      (s) =>
        s.categoryName === RULE_SECTION_CATEGORY.values ||
        templateCategoryToGroupKey(s.categoryName) === "coreValues",
    );
    if (valuesSection) {
      const coreValues = coreValuesFromValuesSection(valuesSection);
      if (coreValues.length > 0) {
        doc.coreValues = coreValues;
      }
    }
  }

  if (!hasMs && sections.length > 0) {
    const methodSelections = methodSelectionsFromDisplaySections(sections);
    if (hasMethodSelections(methodSelections)) {
      doc.methodSelections = methodSelections;
    }
  }

  if (!Array.isArray(doc.sections) || doc.sections.length === 0) {
    doc.sections = sections;
  }

  return doc;
}
