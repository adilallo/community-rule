import type {
  CommunityRuleEntry,
  CommunityRuleSection,
} from "../../app/components/type/CommunityRule/CommunityRule.types";
import type { PublishedMethodSelections } from "./buildPublishPayload";
import {
  PUBLISH_FALLBACK_OVERVIEW_CATEGORY,
  parseDocumentSectionsForDisplay,
} from "./buildPublishPayload";
import { resolveMethodPresetIdFromLabel } from "./buildFinalReviewCategories";
import {
  communicationPresetFor,
  conflictManagementPresetFor,
  decisionApproachPresetFor,
  membershipPresetFor,
  mergeCoreValueDetailWithPresets,
} from "./finalReviewChipPresets";
import {
  communityRuleEntryFromMethodChip,
  formatScopePayload,
  nonEmptyTrimmed,
  RULE_SECTION_CATEGORY,
  sectionFromCommunication,
  sectionFromConflict,
  sectionFromDecision,
  sectionFromMembership,
} from "./ruleSectionsFromMethodSelections";
import {
  templateCategoryToGroupKey,
  type TemplateFacetGroupKey,
} from "./templateReviewMapping";

/** Legacy seed placeholder (removed from `prisma/seed.ts`); still hydrate older published rows. */
const TEMPLATE_COMPOSITION_SUGGESTED_BODY =
  "Suggested focus for this governance area. Replace with your own language in the create flow.";

const CAT_VALUES = RULE_SECTION_CATEGORY.values;
const CAT_COMMUNICATION = RULE_SECTION_CATEGORY.communication;
const CAT_MEMBERSHIP = RULE_SECTION_CATEGORY.membership;
const CAT_DECISION = RULE_SECTION_CATEGORY.decisionMaking;
const CAT_CONFLICT = RULE_SECTION_CATEGORY.conflictManagement;

const CANONICAL_DISPLAY_SECTION_ORDER = [
  CAT_VALUES,
  CAT_COMMUNICATION,
  CAT_MEMBERSHIP,
  CAT_DECISION,
  CAT_CONFLICT,
] as const;

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

function needsPlaceholderPresetEnrichment(entry: CommunityRuleEntry): boolean {
  if (entry.blocks && entry.blocks.length > 0) return false;
  const b = (entry.body ?? "").trim();
  if (b.length === 0) return true;
  return b === TEMPLATE_COMPOSITION_SUGGESTED_BODY;
}

function presetRecordForMethodGroup(
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

function enrichMethodEntryIfPlaceholder(
  entry: CommunityRuleEntry,
  categoryName: string,
): CommunityRuleEntry {
  const groupKey = templateCategoryToGroupKey(categoryName);
  if (!groupKey || groupKey === "coreValues") return entry;
  if (!needsPlaceholderPresetEnrichment(entry)) return entry;
  const id = resolveMethodPresetIdFromLabel(entry.title, groupKey);
  if (!id) return entry;
  const record = presetRecordForMethodGroup(groupKey, id);
  const merged: Record<string, unknown> = { ...record };
  if (groupKey === "decisionApproaches" || groupKey === "conflictManagement") {
    const scope =
      formatScopePayload(merged.selectedApplicableScope) ??
      formatScopePayload(merged.applicableScope);
    if (scope) merged.applicableScope = scope;
    delete merged.selectedApplicableScope;
  }
  const labelByKey =
    groupKey === "communication"
      ? COMM_LABELS
      : groupKey === "membership"
        ? MEM_LABELS
        : groupKey === "decisionApproaches"
          ? DEC_LABELS
          : CM_LABELS;
  const options =
    groupKey === "decisionApproaches"
      ? { consensusLevelKey: "consensusLevel" as const }
      : undefined;
  const enriched = communityRuleEntryFromMethodChip(
    entry.title,
    merged,
    labelByKey,
    options,
  );
  return enriched ?? entry;
}

function enrichCoreValueEntryIfPlaceholder(
  entry: CommunityRuleEntry,
): CommunityRuleEntry {
  if (!needsPlaceholderPresetEnrichment(entry)) return entry;
  const merged = mergeCoreValueDetailWithPresets("", entry.title, {
    meaning: "",
    signals: "",
  });
  const meaning = (merged.meaning ?? "").trim();
  const signals = (merged.signals ?? "").trim();
  const bodyParts: string[] = [];
  if (meaning.length > 0) bodyParts.push(meaning);
  if (signals.length > 0) bodyParts.push(signals);
  const body = bodyParts.join("\n\n");
  if (body.length === 0) return entry;
  return { ...entry, body };
}

function enrichDisplaySection(section: CommunityRuleSection): CommunityRuleSection {
  const groupKey = templateCategoryToGroupKey(section.categoryName);
  if (groupKey === "coreValues") {
    return {
      ...section,
      entries: section.entries.map(enrichCoreValueEntryIfPlaceholder),
    };
  }
  return {
    ...section,
    entries: section.entries.map((e) =>
      enrichMethodEntryIfPlaceholder(e, section.categoryName),
    ),
  };
}

function sortSectionsCanonical(
  sections: CommunityRuleSection[],
): CommunityRuleSection[] {
  const order = CANONICAL_DISPLAY_SECTION_ORDER as readonly string[];
  const rank = (name: string): number => {
    const i = order.indexOf(name);
    return i === -1 ? order.length : i;
  };
  return [...sections].sort((a, b) => {
    const d = rank(a.categoryName) - rank(b.categoryName);
    if (d !== 0) return d;
    return a.categoryName.localeCompare(b.categoryName);
  });
}

function sectionFromStoredCoreValues(
  raw: unknown,
): CommunityRuleSection | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const entries: CommunityRuleEntry[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    const chipId = typeof o.chipId === "string" ? o.chipId : "";
    const label = nonEmptyTrimmed(o.label);
    if (!label) continue;
    const merged = mergeCoreValueDetailWithPresets(chipId, label, {
      meaning: typeof o.meaning === "string" ? o.meaning : "",
      signals: typeof o.signals === "string" ? o.signals : "",
    });
    const meaning = (merged.meaning ?? "").trim();
    const signals = (merged.signals ?? "").trim();
    const bodyParts: string[] = [];
    if (meaning.length > 0) bodyParts.push(meaning);
    if (signals.length > 0) bodyParts.push(signals);
    const body = bodyParts.join("\n\n");
    entries.push({ title: label, body });
  }
  if (entries.length === 0) return null;
  return { categoryName: CAT_VALUES, entries };
}

function parseMethodSelectionsLoose(
  document: Record<string, unknown>,
): PublishedMethodSelections | null {
  const ms = document.methodSelections;
  if (!ms || typeof ms !== "object" || Array.isArray(ms)) return null;
  return ms as PublishedMethodSelections;
}

/**
 * Full `CommunityRule` sections for a published `document` JSON blob: validated
 * `document.sections` plus synthesized categories from `document.coreValues` and
 * `document.methodSelections` when those categories are not already present.
 * **Overview** sections (see `PUBLISH_FALLBACK_OVERVIEW_CATEGORY` in `buildPublishPayload`) from the publish fallback are dropped so the lockup
 * header is the only intro; core value copy is the combined meaning + signals **body**
 * under each value **title** (chip label).
 */
export function parsePublishedDocumentForCommunityRuleDisplay(
  document: unknown,
): CommunityRuleSection[] {
  if (!document || typeof document !== "object") return [];
  const doc = document as Record<string, unknown>;

  const hasPublishedCoreValues =
    Array.isArray(doc.coreValues) && doc.coreValues.length > 0;

  const base = parseDocumentSectionsForDisplay(doc).filter(
    (s) =>
      s.categoryName !== PUBLISH_FALLBACK_OVERVIEW_CATEGORY &&
      !(hasPublishedCoreValues && s.categoryName === CAT_VALUES),
  );
  const seen = new Set(base.map((s) => s.categoryName));

  const extra: CommunityRuleSection[] = [];

  const valuesSection = sectionFromStoredCoreValues(doc.coreValues);
  if (valuesSection && !seen.has(valuesSection.categoryName)) {
    extra.push(valuesSection);
    seen.add(valuesSection.categoryName);
  }

  const methodSelections = parseMethodSelectionsLoose(doc);
  if (methodSelections) {
    const comm = sectionFromCommunication(methodSelections.communication ?? []);
    if (comm && !seen.has(comm.categoryName)) {
      extra.push(comm);
      seen.add(comm.categoryName);
    }
    const mem = sectionFromMembership(methodSelections.membership ?? []);
    if (mem && !seen.has(mem.categoryName)) {
      extra.push(mem);
      seen.add(mem.categoryName);
    }
    const dec = sectionFromDecision(methodSelections.decisionApproaches ?? []);
    if (dec && !seen.has(dec.categoryName)) {
      extra.push(dec);
      seen.add(dec.categoryName);
    }
    const cm = sectionFromConflict(methodSelections.conflictManagement ?? []);
    if (cm && !seen.has(cm.categoryName)) {
      extra.push(cm);
      seen.add(cm.categoryName);
    }
  }

  const combined = [...base, ...extra].map(enrichDisplaySection);
  return sortSectionsCanonical(combined);
}
