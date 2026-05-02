import type { CreateFlowState } from "../../app/(app)/create/types";

/**
 * User-authored method cards (UUID ids) register a meta row when finalized
 * from {@link CustomMethodCardWizard}. Preset rows from `methods[]` never
 * appear here — keeps edit surfaces from treating custom ids like presets.
 */
export function isCustomMethodCardId(
  methodId: string,
  customMeta: CreateFlowState["customMethodCardMetaById"],
): boolean {
  return Boolean(customMeta?.[methodId]);
}
