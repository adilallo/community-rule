import type { CreateFlowState } from "../../app/create/types";

/** True when the client should treat a draft payload as non-empty for hydration / conflict checks. */
export function createFlowStateHasKeys(state: CreateFlowState): boolean {
  return Object.keys(state).length > 0;
}
