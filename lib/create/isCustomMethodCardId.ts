import type { CreateFlowState } from "../../app/(app)/create/types";

/**
 * True when `customMethodCardMetaById` has an entry for this id: wizard-finalized
 * custom UUIDs, duplicate prefab clones, and **preset display overrides** after the
 * user saves title/description in Customize mode (see {@link mergePresetMethodsWithCustom}).
 */
export function isCustomMethodCardId(
  methodId: string,
  customMeta: CreateFlowState["customMethodCardMetaById"],
): boolean {
  return Boolean(customMeta?.[methodId]);
}
