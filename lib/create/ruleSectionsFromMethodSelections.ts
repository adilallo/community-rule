import type {
  CommunityRuleEntry,
  CommunityRuleLabeledBlock,
  CommunityRuleSection,
} from "../../app/components/type/CommunityRule/CommunityRule.types";
import type { PublishedMethodSelections } from "./buildPublishPayload";
import { templateCategoryToGroupKey } from "./templateReviewMapping";

/** Canonical `categoryName` strings for method groups in published documents. */
export const RULE_SECTION_CATEGORY = {
  values: "Values",
  communication: "Communication",
  membership: "Membership",
  decisionMaking: "Decision-making",
  conflictManagement: "Conflict management",
} as const;

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

export function nonEmptyTrimmed(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  return t.length > 0 ? t : null;
}

export function formatScopePayload(val: unknown): string | null {
  if (typeof val === "string") return nonEmptyTrimmed(val);
  if (!Array.isArray(val)) return null;
  const lines = val.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
  if (lines.length === 0) return null;
  return lines.join("\n");
}

export function blocksFromKeyedRecord(
  sections: Record<string, unknown>,
  labelByKey: Record<string, string>,
  options?: {
    consensusLevelKey?: string;
  },
): CommunityRuleLabeledBlock[] {
  const blocks: CommunityRuleLabeledBlock[] = [];
  for (const [key, label] of Object.entries(labelByKey)) {
    if (options?.consensusLevelKey === key) {
      const n = sections[key];
      if (typeof n === "number" && !Number.isNaN(n)) {
        blocks.push({ label, body: `${n}%` });
      }
      continue;
    }
    const raw = sections[key];
    const text =
      key === "applicableScope" || key === "selectedApplicableScope"
        ? formatScopePayload(raw)
        : nonEmptyTrimmed(raw);
    if (text) blocks.push({ label, body: text });
  }
  return blocks;
}

export function communityRuleEntryFromMethodChip(
  title: string,
  sections: Record<string, unknown>,
  labelByKey: Record<string, string>,
  options?: { consensusLevelKey?: string },
): CommunityRuleEntry | null {
  const blocks = blocksFromKeyedRecord(sections, labelByKey, options);
  if (blocks.length === 0) return null;
  return { title, body: "", blocks };
}

export function sectionFromCommunication(
  ms: NonNullable<PublishedMethodSelections["communication"]>,
): CommunityRuleSection | null {
  if (ms.length === 0) return null;
  const entries: CommunityRuleEntry[] = [];
  for (const m of ms) {
    const sec = m.sections as unknown as Record<string, unknown>;
    const e = communityRuleEntryFromMethodChip(m.label, sec, COMM_LABELS);
    if (e) entries.push(e);
  }
  return entries.length > 0
    ? { categoryName: RULE_SECTION_CATEGORY.communication, entries }
    : null;
}

export function sectionFromMembership(
  ms: NonNullable<PublishedMethodSelections["membership"]>,
): CommunityRuleSection | null {
  if (ms.length === 0) return null;
  const entries: CommunityRuleEntry[] = [];
  for (const m of ms) {
    const sec = m.sections as unknown as Record<string, unknown>;
    const e = communityRuleEntryFromMethodChip(m.label, sec, MEM_LABELS);
    if (e) entries.push(e);
  }
  return entries.length > 0
    ? { categoryName: RULE_SECTION_CATEGORY.membership, entries }
    : null;
}

export function sectionFromDecision(
  ms: NonNullable<PublishedMethodSelections["decisionApproaches"]>,
): CommunityRuleSection | null {
  if (ms.length === 0) return null;
  const entries: CommunityRuleEntry[] = [];
  for (const m of ms) {
    const sec = m.sections as unknown as Record<string, unknown>;
    const merged: Record<string, unknown> = { ...sec };
    const scope =
      formatScopePayload(sec.selectedApplicableScope) ??
      formatScopePayload(sec.applicableScope);
    if (scope) merged.applicableScope = scope;
    delete merged.selectedApplicableScope;
    const e = communityRuleEntryFromMethodChip(m.label, merged, DEC_LABELS, {
      consensusLevelKey: "consensusLevel",
    });
    if (e) entries.push(e);
  }
  return entries.length > 0
    ? { categoryName: RULE_SECTION_CATEGORY.decisionMaking, entries }
    : null;
}

export function sectionFromConflict(
  ms: NonNullable<PublishedMethodSelections["conflictManagement"]>,
): CommunityRuleSection | null {
  if (ms.length === 0) return null;
  const entries: CommunityRuleEntry[] = [];
  for (const m of ms) {
    const sec = m.sections as unknown as Record<string, unknown>;
    const merged: Record<string, unknown> = { ...sec };
    const scope =
      formatScopePayload(sec.selectedApplicableScope) ??
      formatScopePayload(sec.applicableScope);
    if (scope) merged.applicableScope = scope;
    delete merged.selectedApplicableScope;
    const e = communityRuleEntryFromMethodChip(m.label, merged, CM_LABELS);
    if (e) entries.push(e);
  }
  return entries.length > 0
    ? { categoryName: RULE_SECTION_CATEGORY.conflictManagement, entries }
    : null;
}

/**
 * Swap template `sections` method rows for fully-resolved entries built from
 * `methodSelections` (preset + overrides).
 */
export function replaceMethodSectionsWithMethodSelections(
  sections: CommunityRuleSection[],
  ms: PublishedMethodSelections,
): CommunityRuleSection[] {
  return sections.map((s) => {
    const gk = templateCategoryToGroupKey(s.categoryName);
    if (gk === "communication" && ms.communication?.length) {
      return sectionFromCommunication(ms.communication) ?? s;
    }
    if (gk === "membership" && ms.membership?.length) {
      return sectionFromMembership(ms.membership) ?? s;
    }
    if (gk === "decisionApproaches" && ms.decisionApproaches?.length) {
      return sectionFromDecision(ms.decisionApproaches) ?? s;
    }
    if (gk === "conflictManagement" && ms.conflictManagement?.length) {
      return sectionFromConflict(ms.conflictManagement) ?? s;
    }
    return s;
  });
}
