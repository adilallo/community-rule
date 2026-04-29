import type {
  CommunicationMethodDetailEntry,
  ConflictManagementDetailEntry,
  CreateFlowState,
  DecisionApproachDetailEntry,
  MembershipMethodDetailEntry,
} from "../../app/(app)/create/types";
import type { CommunityRuleSection } from "../../app/components/type/CommunityRule/CommunityRule.types";
import { resolveMethodPresetIdFromLabel } from "./buildFinalReviewCategories";
import {
  communicationPresetFor,
  conflictManagementPresetFor,
  decisionApproachPresetFor,
  membershipPresetFor,
  mergeCoreValueDetailWithPresets,
  methodLabelFor,
} from "./finalReviewChipPresets";
import { isDocumentEntry } from "./documentEntryGuards";
import { replaceMethodSectionsWithMethodSelections } from "./ruleSectionsFromMethodSelections";
import { templateCategoryToGroupKey } from "./templateReviewMapping";

export { isDocumentEntry } from "./documentEntryGuards";

function isDocumentSection(x: unknown): x is CommunityRuleSection {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.categoryName !== "string") return false;
  if (!Array.isArray(o.entries)) return false;
  return o.entries.every(isDocumentEntry);
}

/** Narrow `CreateFlowState.sections` into Community Rule document sections. */
export function parseSectionsFromCreateFlowState(
  state: CreateFlowState,
): CommunityRuleSection[] {
  const raw = state.sections;
  if (!Array.isArray(raw)) return [];
  const out: CommunityRuleSection[] = [];
  for (const x of raw) {
    if (isDocumentSection(x)) out.push(x);
  }
  return out;
}

/** Core values selected in the flow with labels and detail text for the published document. */
export function buildCoreValuesForDocument(state: CreateFlowState): Array<{
  chipId: string;
  label: string;
  meaning: string;
  signals: string;
}> {
  const snap = state.coreValuesChipsSnapshot;
  const selected = new Set(state.selectedCoreValueIds ?? []);
  const details = state.coreValueDetailsByChipId ?? {};
  if (!snap?.length) return [];
  return snap
    .filter((r) => selected.has(r.id))
    .map((r) => {
      const merged = mergeCoreValueDetailWithPresets(r.id, r.label, details[r.id]);
      return {
        chipId: r.id,
        label: r.label,
        meaning: merged.meaning,
        signals: merged.signals,
      };
    });
}

/**
 * Structured per-group method selections emitted into `document.methodSelections`
 * at publish time. Each entry carries the preset id (stable key), display
 * label, and the fully-resolved section payload (override on top of preset).
 * Empty groups are omitted so downstream readers can iterate just the set
 * the author actually picked.
 */
export type PublishedMethodSelections = {
  communication?: Array<{
    id: string;
    label: string;
    sections: CommunicationMethodDetailEntry;
  }>;
  membership?: Array<{
    id: string;
    label: string;
    sections: MembershipMethodDetailEntry;
  }>;
  decisionApproaches?: Array<{
    id: string;
    label: string;
    sections: DecisionApproachDetailEntry;
  }>;
  conflictManagement?: Array<{
    id: string;
    label: string;
    sections: ConflictManagementDetailEntry;
  }>;
};

export type BuildPublishPayloadResult =
  | {
      ok: true;
      title: string;
      summary?: string;
      document: Record<string, unknown>;
    }
  | { ok: false; error: string };

export const PUBLISH_FALLBACK_OVERVIEW_CATEGORY = "Overview";

const FALLBACK_CATEGORY = PUBLISH_FALLBACK_OVERVIEW_CATEGORY;

const DEFAULT_FALLBACK_BODY =
  "This CommunityRule was created in the create flow. Add more detail in a future edit.";

export function buildPublishPayload(
  state: CreateFlowState,
): BuildPublishPayloadResult {
  const title = typeof state.title === "string" ? state.title.trim() : "";
  if (!title) {
    return { ok: false, error: "missingCommunityName" };
  }

  const firstNonEmpty = (...candidates: unknown[]): string | undefined => {
    for (const c of candidates) {
      if (typeof c !== "string") continue;
      const t = c.trim();
      if (t.length > 0) return t;
    }
    return undefined;
  };

  /** Community context wins over `summary` (template review no longer copies template description into `summary`). */
  let summary = firstNonEmpty(state.communityContext, state.summary);

  let sections = parseSectionsFromCreateFlowState(state);
  if (sections.length === 0) {
    const body = summary ?? DEFAULT_FALLBACK_BODY;
    sections = [
      {
        categoryName: FALLBACK_CATEGORY,
        entries: [{ title: "Community", body }],
      },
    ];
  }

  const coreValues = buildCoreValuesForDocument(state);
  if (coreValues.length > 0) {
    sections = sections.filter(
      (s) => templateCategoryToGroupKey(s.categoryName) !== "coreValues",
    );
  }

  const methodSelections = buildMethodSelectionsForDocument(state);

  if (hasAnyMethodSelection(methodSelections)) {
    sections = replaceMethodSectionsWithMethodSelections(sections, methodSelections);
  }

  const document: Record<string, unknown> = { sections, coreValues };
  if (hasAnyMethodSelection(methodSelections)) {
    document.methodSelections = methodSelections;
  }

  if (summary !== undefined) {
    return { ok: true, title, summary, document };
  }
  return { ok: true, title, document };
}

function hasAnyMethodSelection(m: PublishedMethodSelections): boolean {
  return Boolean(
    m.communication?.length ||
      m.membership?.length ||
      m.decisionApproaches?.length ||
      m.conflictManagement?.length,
  );
}

function deriveMethodPresetIdsFromSections(
  sections: CommunityRuleSection[],
): {
  communication: string[];
  membership: string[];
  decisionApproaches: string[];
  conflictManagement: string[];
} {
  const out = {
    communication: [] as string[],
    membership: [] as string[],
    decisionApproaches: [] as string[],
    conflictManagement: [] as string[],
  };
  for (const s of sections) {
    const gk = templateCategoryToGroupKey(s.categoryName);
    if (!gk || gk === "coreValues") continue;
    const ids: string[] = [];
    for (const e of s.entries) {
      const title = typeof e.title === "string" ? e.title.trim() : "";
      if (title.length === 0) continue;
      const id = resolveMethodPresetIdFromLabel(title, gk);
      if (id) ids.push(id);
    }
    if (ids.length === 0) continue;
    switch (gk) {
      case "communication":
        out.communication = ids;
        break;
      case "membership":
        out.membership = ids;
        break;
      case "decisionApproaches":
        out.decisionApproaches = ids;
        break;
      case "conflictManagement":
        out.conflictManagement = ids;
        break;
      default:
        break;
    }
  }
  return out;
}

function pickMethodIds(
  fromState: string[] | undefined,
  derived: string[],
): string[] {
  if (fromState && fromState.length > 0) return fromState;
  return derived;
}

/**
 * Merge `selected*MethodIds` with any saved `{group}MethodDetailsById`
 * overrides authored on the final-review screen. Preset defaults from the
 * shipped `messages/en/create/customRule/*.json` seed any sub-fields the
 * user didn't edit so consumers of `document.methodSelections` always see
 * a complete payload per method.
 */
export function buildMethodSelectionsForDocument(
  state: CreateFlowState,
): PublishedMethodSelections {
  const derived = deriveMethodPresetIdsFromSections(
    parseSectionsFromCreateFlowState(state),
  );
  const out: PublishedMethodSelections = {};

  const commIds = pickMethodIds(
    state.selectedCommunicationMethodIds,
    derived.communication,
  );
  if (commIds.length > 0) {
    out.communication = commIds.map((id) => {
      const preset = communicationPresetFor(id);
      const override = state.communicationMethodDetailsById?.[id];
      return {
        id,
        label: methodLabelFor("communication", id),
        sections: override ? { ...preset, ...override } : preset,
      };
    });
  }

  const memIds = pickMethodIds(
    state.selectedMembershipMethodIds,
    derived.membership,
  );
  if (memIds.length > 0) {
    out.membership = memIds.map((id) => {
      const preset = membershipPresetFor(id);
      const override = state.membershipMethodDetailsById?.[id];
      return {
        id,
        label: methodLabelFor("membership", id),
        sections: override ? { ...preset, ...override } : preset,
      };
    });
  }

  const daIds = pickMethodIds(
    state.selectedDecisionApproachIds,
    derived.decisionApproaches,
  );
  if (daIds.length > 0) {
    out.decisionApproaches = daIds.map((id) => {
      const preset = decisionApproachPresetFor(id);
      const override = state.decisionApproachDetailsById?.[id];
      return {
        id,
        label: methodLabelFor("decisionApproaches", id),
        sections: override ? { ...preset, ...override } : preset,
      };
    });
  }

  const cmIds = pickMethodIds(
    state.selectedConflictManagementIds,
    derived.conflictManagement,
  );
  if (cmIds.length > 0) {
    out.conflictManagement = cmIds.map((id) => {
      const preset = conflictManagementPresetFor(id);
      const override = state.conflictManagementDetailsById?.[id];
      return {
        id,
        label: methodLabelFor("conflictManagement", id),
        sections: override ? { ...preset, ...override } : preset,
      };
    });
  }

  return out;
}

/** Read `document.sections` from a stored published payload for display. */
export function parseDocumentSectionsForDisplay(
  document: unknown,
): CommunityRuleSection[] {
  if (!document || typeof document !== "object") return [];
  const sections = (document as Record<string, unknown>).sections;
  if (!Array.isArray(sections)) return [];
  return sections.filter(isDocumentSection);
}
