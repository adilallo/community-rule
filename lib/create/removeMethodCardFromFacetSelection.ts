import type { CreateFlowState } from "../../app/(app)/create/types";
import {
  CUSTOM_RULE_FACET_BY_GROUP,
  type TemplateFacetGroupKey,
} from "./customRuleFacets";
import { isCustomMethodCardId } from "./isCustomMethodCardId";

export type MethodFacetGroupKey = Exclude<TemplateFacetGroupKey, "coreValues">;

/**
 * Removes one method card id from a facet’s selection and clears its detail
 * override row; if the id is a custom wizard card, also drops meta + field blocks.
 */
export function removeMethodCardFromFacetSelection(
  state: CreateFlowState,
  facetGroupKey: MethodFacetGroupKey,
  cardId: string,
): Partial<CreateFlowState> {
  const row = CUSTOM_RULE_FACET_BY_GROUP.get(facetGroupKey);
  if (!row || row.kind !== "method") {
    throw new Error(
      `removeMethodCardFromFacetSelection: not a method facet (${facetGroupKey})`,
    );
  }

  const selectedIds = [...row.selectionIds(state)];
  if (!selectedIds.includes(cardId)) {
    return {};
  }
  const nextSelected = selectedIds.filter((id) => id !== cardId);

  const detailKey = row.detailOverridesStateKey as
    | "communicationMethodDetailsById"
    | "membershipMethodDetailsById"
    | "decisionApproachDetailsById"
    | "conflictManagementDetailsById";
  const prevDetails = state[detailKey] as Record<string, unknown> | undefined;
  const nextDetails: Record<string, unknown> = { ...(prevDetails ?? {}) };
  delete nextDetails[cardId];

  const patch: Partial<CreateFlowState> = {};

  (patch as Record<string, unknown>)[row.selectedIdsStateKey] = nextSelected;

  const detailsPatch =
    Object.keys(nextDetails).length > 0 ? nextDetails : undefined;
  switch (detailKey) {
    case "communicationMethodDetailsById":
      patch.communicationMethodDetailsById =
        detailsPatch as CreateFlowState["communicationMethodDetailsById"];
      break;
    case "membershipMethodDetailsById":
      patch.membershipMethodDetailsById =
        detailsPatch as CreateFlowState["membershipMethodDetailsById"];
      break;
    case "decisionApproachDetailsById":
      patch.decisionApproachDetailsById =
        detailsPatch as CreateFlowState["decisionApproachDetailsById"];
      break;
    case "conflictManagementDetailsById":
      patch.conflictManagementDetailsById =
        detailsPatch as CreateFlowState["conflictManagementDetailsById"];
      break;
    default: {
      const _exhaustive: never = detailKey;
      throw new Error(
        `removeMethodCardFromFacetSelection: unknown detail key ${_exhaustive}`,
      );
    }
  }

  const meta = state.customMethodCardMetaById ?? {};
  if (isCustomMethodCardId(cardId, meta)) {
    const nextMeta = { ...meta };
    delete nextMeta[cardId];
    patch.customMethodCardMetaById =
      Object.keys(nextMeta).length > 0 ? nextMeta : undefined;

    const nextBlocks = { ...(state.customMethodCardFieldBlocksById ?? {}) };
    delete nextBlocks[cardId];
    patch.customMethodCardFieldBlocksById =
      Object.keys(nextBlocks).length > 0 ? nextBlocks : undefined;
  }

  return patch;
}
