import type { CreateFlowState } from "../../app/(app)/create/types";

/**
 * Same field removal as {@link resetCustomRuleSelections} in CreateFlowProvider.
 * Used to apply template "Use without changes" in one atomic replaceState updater.
 */
export function stripCustomRuleSelectionFields(
  prev: CreateFlowState,
): CreateFlowState {
  const {
    selectedCoreValueIds: _a,
    coreValuesChipsSnapshot: _b,
    coreValueDetailsByChipId: _c,
    selectedCommunicationMethodIds: _d,
    selectedMembershipMethodIds: _e,
    selectedDecisionApproachIds: _f,
    selectedConflictManagementIds: _g,
    methodSectionsPinCommitted: _h,
    ...rest
  } = prev;
  return rest;
}
