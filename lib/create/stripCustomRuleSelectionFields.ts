import type { CreateFlowState } from "../../app/(app)/create/types";
import { STRIP_CUSTOM_RULE_SELECTION_STATE_KEYS } from "./customRuleFacets";

/**
 * Same field removal as {@link resetCustomRuleSelections} in CreateFlowProvider.
 * Used to apply template "Use without changes" in one atomic replaceState updater.
 *
 * Keys come from {@link CUSTOM_RULE_FACETS} / {@link STRIP_CUSTOM_RULE_SELECTION_STATE_KEYS}
 * (Linear CR-92).
 */
export function stripCustomRuleSelectionFields(
  prev: CreateFlowState,
): CreateFlowState {
  const out: CreateFlowState = { ...prev };
  for (const key of STRIP_CUSTOM_RULE_SELECTION_STATE_KEYS) {
    delete (out as Record<string, unknown>)[key as string];
  }
  return out;
}
