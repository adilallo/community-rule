import type { CreateFlowState } from "../../app/(app)/create/types";
import communicationMessages from "../../messages/en/create/customRule/communication.json";
import conflictManagementMessages from "../../messages/en/create/customRule/conflictManagement.json";
import decisionApproachesMessages from "../../messages/en/create/customRule/decisionApproaches.json";
import membershipMessages from "../../messages/en/create/customRule/membership.json";
import {
  buildCoreValuesForDocument,
  parseSectionsFromCreateFlowState,
} from "./buildPublishPayload";
import {
  templateCategoryToGroupKey,
  type TemplateFacetGroupKey,
} from "./templateReviewMapping";

/**
 * Chip row shape shared with `messages/en/create/reviewAndComplete/finalReview.json`
 * so the final-review screen can keep its existing category → chip label rendering
 * contract regardless of whether chips came from state or from fallback content.
 */
export type FinalReviewCategoryRow = { name: string; chips: string[] };

/**
 * Per-chip details needed to open an *editable* chip modal on the final-review
 * screen. `overrideKey` is the stable id we use to look up / write user edits
 * in `CreateFlowState`:
 *
 * - `coreValues` → the chip id from `coreValuesChipsSnapshot`
 *   (round-trips via `coreValueDetailsByChipId`).
 * - Method groups → the preset method id from
 *   `messages/en/create/customRule/{group}.json` `methods[].id`
 *   (round-trips via `{group}MethodDetailsById`).
 * - Unknown / template-only chips → `null` (modal falls back to read-only).
 */
export type FinalReviewChipEntry = {
  label: string;
  groupKey: TemplateFacetGroupKey | null;
  overrideKey: string | null;
};

/** Detailed row paired with per-chip override + group metadata. */
export type FinalReviewCategoryRowDetailed = {
  name: string;
  groupKey: TemplateFacetGroupKey | null;
  entries: FinalReviewChipEntry[];
};

/** Category labels supplied by the caller (pulled from localized messages). */
export type FinalReviewCategoryNames = {
  values: string;
  communication: string;
  membership: string;
  decisions: string;
  conflict: string;
};

type MethodPreset = { id: string; label: string };

function readMethodsArray(source: unknown): MethodPreset[] {
  if (!source || typeof source !== "object") return [];
  const methods = (source as { methods?: unknown }).methods;
  if (!Array.isArray(methods)) return [];
  const out: MethodPreset[] = [];
  for (const raw of methods) {
    if (!raw || typeof raw !== "object") continue;
    const o = raw as Record<string, unknown>;
    if (typeof o.id === "string" && typeof o.label === "string") {
      out.push({ id: o.id, label: o.label });
    }
  }
  return out;
}

/**
 * Resolve an ordered list of preset ids to `{label, id}` entries, filtering
 * missing/duplicate labels. The id is returned alongside so callers can key
 * per-chip overrides by the stable preset id (e.g. `"signal"`) even after
 * labels change through localization.
 */
function entriesFromIds(
  ids: readonly string[] | undefined,
  methods: readonly MethodPreset[],
  groupKey: TemplateFacetGroupKey,
): FinalReviewChipEntry[] {
  if (!ids || ids.length === 0) return [];
  const byId = new Map(methods.map((m) => [m.id, m.label] as const));
  const seen = new Set<string>();
  const out: FinalReviewChipEntry[] = [];
  for (const id of ids) {
    const label = byId.get(id);
    if (typeof label !== "string" || label.length === 0) continue;
    if (seen.has(label)) continue;
    seen.add(label);
    out.push({ label, groupKey, overrideKey: id });
  }
  return out;
}

/**
 * Reverse-lookup a preset id by label for the template-sections path, where
 * chips carry entry titles rather than ids. Used to recover an overrideKey
 * for chips the user sees on a "Use without changes" template review.
 */
function overrideKeyForLabel(
  label: string,
  methods: readonly MethodPreset[],
): string | null {
  const normalized = label.trim().toLowerCase();
  if (normalized.length === 0) return null;
  for (const m of methods) {
    if (m.label.trim().toLowerCase() === normalized) return m.id;
  }
  return null;
}

function methodsForGroup(
  groupKey: TemplateFacetGroupKey | null,
): readonly MethodPreset[] {
  switch (groupKey) {
    case "communication":
      return readMethodsArray(communicationMessages);
    case "membership":
      return readMethodsArray(membershipMessages);
    case "decisionApproaches":
      return readMethodsArray(decisionApproachesMessages);
    case "conflictManagement":
      return readMethodsArray(conflictManagementMessages);
    default:
      return [];
  }
}

/**
 * Detailed builder: same logic as {@link buildFinalReviewCategoriesFromState}
 * but each chip is returned with its `overrideKey` + `groupKey` so the
 * final-review screen can wire chip clicks to an editable modal that
 * round-trips writes back into `CreateFlowState`.
 */
export function buildFinalReviewCategoryRowsDetailed(
  state: CreateFlowState,
  names: FinalReviewCategoryNames,
): FinalReviewCategoryRowDetailed[] {
  const sections = parseSectionsFromCreateFlowState(state);
  const coreValues = buildCoreValuesForDocument(state);

  const coreValueEntries: FinalReviewChipEntry[] = coreValues.map((r) => ({
    label: r.label,
    groupKey: "coreValues" as const,
    overrideKey: r.chipId,
  }));

  // Use-without-changes / pre-rendered template body.
  if (sections.length > 0) {
    const rows: FinalReviewCategoryRowDetailed[] = [];

    // Always prefer the chip-snapshot derived entries when present so the
    // values row uses stable per-chip ids the edit modal can attach to.
    // We then skip any Values section in the template body to avoid
    // duplicating the row (the snapshot already represents the same data).
    if (coreValueEntries.length > 0) {
      rows.push({
        name: names.values,
        groupKey: "coreValues",
        entries: coreValueEntries,
      });
    }

    for (const s of sections) {
      const groupKey = templateCategoryToGroupKey(s.categoryName);
      if (groupKey === "coreValues" && coreValueEntries.length > 0) continue;
      const methods = methodsForGroup(groupKey);
      const entries: FinalReviewChipEntry[] = [];
      for (const e of s.entries) {
        const title = e.title.trim();
        if (title.length === 0) continue;
        // For the Values section inside template bodies we can't recover a
        // stable chip id (no snapshot), so override is unavailable — the
        // modal will render read-only. Method sections fall back to label
        // → preset-id resolution so matching titles stay editable.
        let overrideKey: string | null = null;
        if (groupKey && groupKey !== "coreValues") {
          overrideKey = overrideKeyForLabel(title, methods);
        }
        entries.push({ label: title, groupKey, overrideKey });
      }
      if (entries.length === 0) continue;
      rows.push({ name: s.categoryName, groupKey, entries });
    }
    return rows;
  }

  const rows: FinalReviewCategoryRowDetailed[] = [
    { name: names.values, groupKey: "coreValues", entries: coreValueEntries },
    {
      name: names.communication,
      groupKey: "communication",
      entries: entriesFromIds(
        state.selectedCommunicationMethodIds,
        methodsForGroup("communication"),
        "communication",
      ),
    },
    {
      name: names.membership,
      groupKey: "membership",
      entries: entriesFromIds(
        state.selectedMembershipMethodIds,
        methodsForGroup("membership"),
        "membership",
      ),
    },
    {
      name: names.decisions,
      groupKey: "decisionApproaches",
      entries: entriesFromIds(
        state.selectedDecisionApproachIds,
        methodsForGroup("decisionApproaches"),
        "decisionApproaches",
      ),
    },
    {
      name: names.conflict,
      groupKey: "conflictManagement",
      entries: entriesFromIds(
        state.selectedConflictManagementIds,
        methodsForGroup("conflictManagement"),
        "conflictManagement",
      ),
    },
  ];
  return rows.filter((r) => r.entries.length > 0);
}

/**
 * Derive the final-review Rule category rows from the current
 * {@link CreateFlowState}.
 *
 * Two-mode contract, mirroring the two template entry points:
 * 1. **Use without changes** — `state.sections` carries the applied template
 *    body; we render it verbatim (`categoryName` + entry `title`s). Core
 *    values still come from `buildCoreValuesForDocument` when they were
 *    captured separately.
 * 2. **Customize / plain custom-rule flow** — each Create Custom screen writes
 *    its selection ids into a dedicated state field. We resolve those ids
 *    against the curated message `methods[]` list to get the display labels,
 *    matching what the user saw as chips in-flow.
 *
 * Empty categories are filtered out so the review card doesn't render headings
 * with no chips. If nothing in state resolves to any chip, the caller should
 * fall back to the demo categories shipped in `finalReview.json`.
 */
export function buildFinalReviewCategoriesFromState(
  state: CreateFlowState,
  names: FinalReviewCategoryNames,
): FinalReviewCategoryRow[] {
  return buildFinalReviewCategoryRowsDetailed(state, names).map((r) => ({
    name: r.name,
    chips: r.entries.map((e) => e.label),
  }));
}
