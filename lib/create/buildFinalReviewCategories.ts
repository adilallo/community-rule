import type { CreateFlowState } from "../../app/(app)/create/types";
import { readMethodPresetsForFacetGroup } from "./customRuleFacets";
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
  customMeta?: CreateFlowState["customMethodCardMetaById"],
): FinalReviewChipEntry[] {
  if (!ids || ids.length === 0) return [];
  const byId = new Map(methods.map((m) => [m.id, m.label] as const));
  const seen = new Set<string>();
  const out: FinalReviewChipEntry[] = [];
  for (const id of ids) {
    const presetLabel = byId.get(id);
    const fromCustom = customMeta?.[id]?.label?.trim();
    const label =
      typeof presetLabel === "string" && presetLabel.length > 0
        ? presetLabel
        : typeof fromCustom === "string" && fromCustom.length > 0
          ? fromCustom
          : "";
    if (label.length === 0) continue;
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
  if (groupKey == null) return [];
  return readMethodPresetsForFacetGroup(groupKey);
}

function selectedMethodIdsForGroup(
  state: CreateFlowState,
  groupKey: TemplateFacetGroupKey,
): string[] | undefined {
  switch (groupKey) {
    case "communication":
      return state.selectedCommunicationMethodIds;
    case "membership":
      return state.selectedMembershipMethodIds;
    case "decisionApproaches":
      return state.selectedDecisionApproachIds;
    case "conflictManagement":
      return state.selectedConflictManagementIds;
    default:
      return undefined;
  }
}

/** Mirrors {@link buildPublishPayload}'s `pickMethodIds` — state wins when set. */
function pickMethodIdsForReview(
  fromState: string[] | undefined,
  derived: readonly string[],
): string[] {
  if (fromState && fromState.length > 0) return [...fromState];
  return [...derived];
}

/**
 * Resolve a preset method id from a chip label (template sections / display
 * enrichment where entries carry titles but not stable ids).
 */
export function resolveMethodPresetIdFromLabel(
  label: string,
  groupKey: TemplateFacetGroupKey,
): string | null {
  if (groupKey === "coreValues") return null;
  return overrideKeyForLabel(label, methodsForGroup(groupKey));
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

      if (groupKey && groupKey !== "coreValues") {
        const stateSel = selectedMethodIdsForGroup(state, groupKey);
        const derivedIds: string[] = [];
        for (const e of s.entries) {
          const title = typeof e.title === "string" ? e.title.trim() : "";
          if (title.length === 0) continue;
          const id = resolveMethodPresetIdFromLabel(title, groupKey);
          if (id) derivedIds.push(id);
        }
        // Customize flow keeps `sections` from the template but writes real
        // facet picks into `selected*MethodIds` (including custom UUID cards).
        // Match publish (`pickMethodIds`): when those ids exist, drive chips
        // from state + `customMethodCardMetaById`, not from section titles alone.
        if (stateSel && stateSel.length > 0) {
          const ids = pickMethodIdsForReview(stateSel, derivedIds);
          entries.push(
            ...entriesFromIds(
              ids,
              methods,
              groupKey,
              state.customMethodCardMetaById,
            ),
          );
        } else {
          for (const e of s.entries) {
            const title = typeof e.title === "string" ? e.title.trim() : "";
            if (title.length === 0) continue;
            const overrideKey = overrideKeyForLabel(title, methods);
            entries.push({ label: title, groupKey, overrideKey });
          }
        }
      } else {
        for (const e of s.entries) {
          const title = typeof e.title === "string" ? e.title.trim() : "";
          if (title.length === 0) continue;
          entries.push({ label: title, groupKey, overrideKey: null });
        }
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
        state.customMethodCardMetaById,
      ),
    },
    {
      name: names.membership,
      groupKey: "membership",
      entries: entriesFromIds(
        state.selectedMembershipMethodIds,
        methodsForGroup("membership"),
        "membership",
        state.customMethodCardMetaById,
      ),
    },
    {
      name: names.decisions,
      groupKey: "decisionApproaches",
      entries: entriesFromIds(
        state.selectedDecisionApproachIds,
        methodsForGroup("decisionApproaches"),
        "decisionApproaches",
        state.customMethodCardMetaById,
      ),
    },
    {
      name: names.conflict,
      groupKey: "conflictManagement",
      entries: entriesFromIds(
        state.selectedConflictManagementIds,
        methodsForGroup("conflictManagement"),
        "conflictManagement",
        state.customMethodCardMetaById,
      ),
    },
  ];
  return rows.filter((r) => r.entries.length > 0);
}

/**
 * Derive the final-review Rule category rows from the current
 * {@link CreateFlowState}.
 *
 * Contract across template + customize paths:
 * 1. **Use without changes** — `state.sections` carries the applied template
 *    body; method facets render from section titles when `selected*MethodIds`
 *    were cleared (see `stripCustomRuleSelectionFields`). Core values still
 *    come from `buildCoreValuesForDocument` when captured separately.
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
