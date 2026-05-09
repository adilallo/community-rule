import type { CreateFlowState } from "../../app/(app)/create/types";
import type { FinalReviewChipEditPatch } from "../../app/(app)/create/components/FinalReviewChipEditModal";
import { CUSTOM_RULE_FACET_BY_GROUP } from "./customRuleFacets";

/**
 * `groupKey` cases mirror {@link CUSTOM_RULE_FACETS} / `TemplateFacetGroupKey`
 * (Linear CR-92 — keep exhaustiveness when adding a facet row).
 *
 * Translate a {@link FinalReviewChipEditPatch} into the `Partial<CreateFlowState>`
 * patch that {@link CreateFlowState}'s update merger should write back. Each
 * group key targets its own `*DetailsById` (or `coreValueDetailsByChipId`)
 * record; the patch always merges the new value onto the existing record so
 * other chips' overrides are preserved.
 *
 * Exported as a pure function so it's unit-testable without React.
 */
export function applyFinalReviewChipEditPatch(
  state: CreateFlowState,
  patch: FinalReviewChipEditPatch,
): Partial<CreateFlowState> {
  const facet = CUSTOM_RULE_FACET_BY_GROUP.get(patch.groupKey);
  if (!facet) {
    throw new Error(
      `applyFinalReviewChipEditPatch: unknown facet group ${patch.groupKey}`,
    );
  }
  const stateKey = facet.detailOverridesStateKey;
  const current = state[stateKey];
  const record =
    current && typeof current === "object"
      ? (current as Record<string, unknown>)
      : {};
  const snapshotLabelPatch =
    patch.groupKey === "coreValues" &&
    "chipLabel" in patch &&
    typeof patch.chipLabel === "string"
      ? (() => {
          const trim = patch.chipLabel.trim();
          if (trim.length === 0) {
            return {} as Partial<CreateFlowState>;
          }
          const snap = [...(state.coreValuesChipsSnapshot ?? [])];
          const i = snap.findIndex((r) => r.id === patch.overrideKey);
          if (i < 0) {
            return {} as Partial<CreateFlowState>;
          }
          snap[i] = { ...snap[i], label: trim };
          return {
            coreValuesChipsSnapshot: snap,
          } satisfies Partial<CreateFlowState>;
        })()
      : ({} as Partial<CreateFlowState>);
  const detailPatch: Partial<CreateFlowState> = {
    [stateKey]: {
      ...record,
      [patch.overrideKey]: patch.value,
    },
    ...snapshotLabelPatch,
  };
  const metaFromPatch =
    patch.groupKey !== "coreValues" &&
    "methodCardMeta" in patch &&
    patch.methodCardMeta !== undefined
      ? {
          customMethodCardMetaById: {
            ...(state.customMethodCardMetaById ?? {}),
            [patch.overrideKey]: patch.methodCardMeta,
          } satisfies NonNullable<CreateFlowState["customMethodCardMetaById"]>,
        }
      : {};
  if (
    patch.groupKey !== "coreValues" &&
    "customMethodCardFieldBlocks" in patch &&
    patch.customMethodCardFieldBlocks !== undefined
  ) {
    return {
      ...detailPatch,
      ...metaFromPatch,
      customMethodCardFieldBlocksById: {
        ...(state.customMethodCardFieldBlocksById ?? {}),
        [patch.overrideKey]: patch.customMethodCardFieldBlocks,
      },
    };
  }
  if (Object.keys(metaFromPatch).length > 0) {
    return { ...detailPatch, ...metaFromPatch };
  }
  return detailPatch;
}
