import type {
  CommunityRuleEntry,
  CommunityRuleLabeledBlock,
  CommunityRuleSection,
} from "../../app/components/type/CommunityRule/CommunityRule.types";
import type { PublishedMethodSelections } from "./buildPublishPayload";
import type { CustomMethodCardFieldBlock } from "./customMethodCardFieldBlocks";
import { templateCategoryToGroupKey } from "./templateReviewMapping";

/** Uses filename extension and/or URL path so uploads render as `<img>` vs file link on read-only surfaces. */
export function wizardUploadDisplaysAsImage(
  fileName: string | null,
  assetUrl: string | null,
): boolean {
  if (fileName && /\.(jpe?g|png|gif|webp)$/i.test(fileName)) return true;
  if (assetUrl && /\.(jpe?g|png|gif|webp)(\?|#|$)/i.test(assetUrl)) return true;
  return false;
}

/**
 * Serialize wizard-authored field blocks into Community Rule labeled rows for
 * read-only surfaces (completed step, exported views). Matches how those blocks
 * are edited in-app; `placeholderText` holds the author's answer for text blocks.
 */
export function labeledBlocksFromCustomMethodCardFieldBlocks(
  blocks: CustomMethodCardFieldBlock[],
): CommunityRuleLabeledBlock[] {
  const out: CommunityRuleLabeledBlock[] = [];
  for (const b of blocks) {
    switch (b.kind) {
      case "text": {
        const body = nonEmptyTrimmed(b.placeholderText);
        if (body) out.push({ label: b.blockTitle, body });
        break;
      }
      case "badges": {
        const opts = b.options.filter((x) => typeof x === "string" && x.trim().length > 0);
        if (opts.length === 0) break;
        out.push({ label: b.blockTitle, body: opts.join(", ") });
        break;
      }
      case "upload": {
        const name = nonEmptyTrimmed(b.fileName);
        const url = nonEmptyTrimmed(b.assetUrl);
        if (url) {
          if (wizardUploadDisplaysAsImage(name, url)) {
            out.push({
              label: b.blockTitle,
              body: "",
              imageUrl: url,
            });
          } else {
            out.push({
              label: b.blockTitle,
              body: name ?? url,
              fileUrl: url,
            });
          }
        } else if (name) {
          out.push({ label: b.blockTitle, body: name });
        }
        break;
      }
      case "proportion":
        out.push({
          label: b.blockTitle,
          body: `${b.defaultPercent}%`,
        });
        break;
      default:
        break;
    }
  }
  return out;
}

export type CommunityRuleEntryFromChipOptions = {
  consensusLevelKey?: string;
  customFieldBlocks?: CustomMethodCardFieldBlock[];
};

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

/**
 * Conflict-management applicable scope is a single textarea; preset JSON often
 * splits one sentence across multiple strings (legacy chip fragments). Join
 * with ", " for normal sentence display. Prefer non-empty `selectedApplicableScope`
 * when present, otherwise `applicableScope`.
 */
export function formatConflictApplicableScopeForTextarea(
  selectedApplicableScope: readonly string[],
  applicableScope: readonly string[],
): string {
  const sel = selectedApplicableScope.filter(
    (x): x is string => typeof x === "string" && x.trim().length > 0,
  );
  const app = applicableScope.filter(
    (x): x is string => typeof x === "string" && x.trim().length > 0,
  );
  const parts = sel.length > 0 ? sel : app;
  if (parts.length === 0) return "";
  return parts.join(", ");
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
  options?: CommunityRuleEntryFromChipOptions,
): CommunityRuleEntry | null {
  const presetBlocks = blocksFromKeyedRecord(
    sections,
    labelByKey,
    options?.consensusLevelKey
      ? { consensusLevelKey: options.consensusLevelKey }
      : undefined,
  );
  const wizardBlocks =
    options?.customFieldBlocks && options.customFieldBlocks.length > 0
      ? labeledBlocksFromCustomMethodCardFieldBlocks(options.customFieldBlocks)
      : [];
  const blocks = [...presetBlocks, ...wizardBlocks];
  if (blocks.length === 0) return null;
  return { title, body: "", blocks };
}

export function sectionFromCommunication(
  ms: NonNullable<PublishedMethodSelections["communication"]>,
  customFieldBlocksById?: Record<string, CustomMethodCardFieldBlock[]>,
): CommunityRuleSection | null {
  if (ms.length === 0) return null;
  const entries: CommunityRuleEntry[] = [];
  for (const m of ms) {
    const sec = m.sections as unknown as Record<string, unknown>;
    const e = communityRuleEntryFromMethodChip(m.label, sec, COMM_LABELS, {
      customFieldBlocks: customFieldBlocksById?.[m.id],
    });
    if (e) entries.push(e);
  }
  return entries.length > 0
    ? { categoryName: RULE_SECTION_CATEGORY.communication, entries }
    : null;
}

export function sectionFromMembership(
  ms: NonNullable<PublishedMethodSelections["membership"]>,
  customFieldBlocksById?: Record<string, CustomMethodCardFieldBlock[]>,
): CommunityRuleSection | null {
  if (ms.length === 0) return null;
  const entries: CommunityRuleEntry[] = [];
  for (const m of ms) {
    const sec = m.sections as unknown as Record<string, unknown>;
    const e = communityRuleEntryFromMethodChip(m.label, sec, MEM_LABELS, {
      customFieldBlocks: customFieldBlocksById?.[m.id],
    });
    if (e) entries.push(e);
  }
  return entries.length > 0
    ? { categoryName: RULE_SECTION_CATEGORY.membership, entries }
    : null;
}

export function sectionFromDecision(
  ms: NonNullable<PublishedMethodSelections["decisionApproaches"]>,
  customFieldBlocksById?: Record<string, CustomMethodCardFieldBlock[]>,
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
      customFieldBlocks: customFieldBlocksById?.[m.id],
    });
    if (e) entries.push(e);
  }
  return entries.length > 0
    ? { categoryName: RULE_SECTION_CATEGORY.decisionMaking, entries }
    : null;
}

export function sectionFromConflict(
  ms: NonNullable<PublishedMethodSelections["conflictManagement"]>,
  customFieldBlocksById?: Record<string, CustomMethodCardFieldBlock[]>,
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
    const e = communityRuleEntryFromMethodChip(m.label, merged, CM_LABELS, {
      customFieldBlocks: customFieldBlocksById?.[m.id],
    });
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
  customFieldBlocksById?: Record<string, CustomMethodCardFieldBlock[]>,
): CommunityRuleSection[] {
  return sections.map((s) => {
    const gk = templateCategoryToGroupKey(s.categoryName);
    if (gk === "communication" && ms.communication?.length) {
      return sectionFromCommunication(ms.communication, customFieldBlocksById) ?? s;
    }
    if (gk === "membership" && ms.membership?.length) {
      return sectionFromMembership(ms.membership, customFieldBlocksById) ?? s;
    }
    if (gk === "decisionApproaches" && ms.decisionApproaches?.length) {
      return sectionFromDecision(ms.decisionApproaches, customFieldBlocksById) ?? s;
    }
    if (gk === "conflictManagement" && ms.conflictManagement?.length) {
      return sectionFromConflict(ms.conflictManagement, customFieldBlocksById) ?? s;
    }
    return s;
  });
}
