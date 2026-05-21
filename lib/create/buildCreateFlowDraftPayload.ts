import type { CreateFlowState, CreateFlowStep } from "../../app/(app)/create/types";

/** Snapshot for save-progress / draft transfer (includes optional resume step). */
export function buildCreateFlowDraftPayload(
  state: CreateFlowState,
  currentStep?: CreateFlowStep | null,
): CreateFlowState {
  return {
    ...state,
    ...(currentStep ? { currentStep } : {}),
  };
}
