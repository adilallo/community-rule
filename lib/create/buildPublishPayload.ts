import type {
  CommunicationMethodDetailEntry,
  ConflictManagementDetailEntry,
  CoreValueDetailEntry,
  CreateFlowState,
  DecisionApproachDetailEntry,
  MembershipMethodDetailEntry,
} from "../../app/(app)/create/types";
import type { CommunityRuleDocumentSection } from "../../app/components/sections/CommunityRuleDocument/CommunityRuleDocument.types";
import {
  communicationPresetFor,
  conflictManagementPresetFor,
  decisionApproachPresetFor,
  membershipPresetFor,
  methodLabelFor,
} from "./finalReviewChipPresets";

function isDocumentEntry(x: unknown): x is { title: string; body: string } {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.title === "string" && typeof o.body === "string";
}

function isDocumentSection(x: unknown): x is CommunityRuleDocumentSection {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.categoryName !== "string") return false;
  if (!Array.isArray(o.entries)) return false;
  return o.entries.every(isDocumentEntry);
}

/** Narrow `CreateFlowState.sections` into Community Rule document sections. */
export function parseSectionsFromCreateFlowState(
  state: CreateFlowState,
): CommunityRuleDocumentSection[] {
  const raw = state.sections;
  if (!Array.isArray(raw)) return [];
  const out: CommunityRuleDocumentSection[] = [];
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
      const d: CoreValueDetailEntry | undefined = details[r.id];
      return {
        chipId: r.id,
        label: r.label,
        meaning: d?.meaning ?? "",
        signals: d?.signals ?? "",
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

const FALLBACK_CATEGORY = "Overview";

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

  let summary = firstNonEmpty(state.summary, state.communityContext);

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
  const methodSelections = buildMethodSelectionsForDocument(state);

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
  const out: PublishedMethodSelections = {};

  const commIds = state.selectedCommunicationMethodIds ?? [];
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

  const memIds = state.selectedMembershipMethodIds ?? [];
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

  const daIds = state.selectedDecisionApproachIds ?? [];
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

  const cmIds = state.selectedConflictManagementIds ?? [];
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
): CommunityRuleDocumentSection[] {
  if (!document || typeof document !== "object") return [];
  const sections = (document as Record<string, unknown>).sections;
  if (!Array.isArray(sections)) return [];
  return sections.filter(isDocumentSection);
}
