import type { CreateFlowState } from "../../app/(app)/create/types";
import type { CustomMethodCardFieldBlock } from "./customMethodCardFieldBlocks";
import { isCustomMethodCardId } from "./isCustomMethodCardId";

/**
 * Create modals use {@link CustomMethodCardModalBody} when there are structured field
 * blocks for this method id (wizard-finalized cards, final-review chip edits, etc.),
 * including **proportion-only** layouts.
 *
 * Check persisted blocks **before** {@link isCustomMethodCardId}: `meta` can be absent
 * while `customMethodCardFieldBlocksById[id]` is still populated (e.g. partial merges).
 *
 * Duplicating a preset registers `meta` for the clone but leaves blocks empty — those
 * stubs keep the facet's structured edit fields until the user adds blocks (then this
 * returns true once persisted blocks are non-empty).
 *
 * **View mode** (`modalEditUnlocked` false): when the custom card still has facet copy
 * that matches preset seeds only (see `./methodCardFacetMatchesPresetForId`), route to
 * {@link CustomMethodCardModalBody} so meta-only wizard cards show policy copy instead
 * of empty preset section editors. Pass `customFacetDetailsMatchPreset: false` when the
 * caller knows facet details were edited or cloned from a filled preset.
 */
export function usesWizardFieldBlocksModalBody(args: {
  methodId: string;
  meta: CreateFlowState["customMethodCardMetaById"];
  fieldBlocksById: CreateFlowState["customMethodCardFieldBlocksById"];
  modalEditUnlocked: boolean;
  draftFieldBlocks: readonly CustomMethodCardFieldBlock[] | null;
  /** When strictly `true` and modal is read-only, use wizard body for custom cards with empty blocks. */
  customFacetDetailsMatchPreset?: boolean;
}): boolean {
  const persisted = args.fieldBlocksById?.[args.methodId];
  if (Array.isArray(persisted) && persisted.length > 0) {
    return true;
  }
  if (!isCustomMethodCardId(args.methodId, args.meta)) {
    return false;
  }
  if (
    args.modalEditUnlocked &&
    args.draftFieldBlocks !== null &&
    args.draftFieldBlocks.length > 0
  ) {
    return true;
  }
  return (
    !args.modalEditUnlocked && args.customFacetDetailsMatchPreset === true
  );
}
