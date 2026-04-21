import type { CreateFlowState } from "../../app/(app)/create/types";

/** Legacy `currentStep` values mapped to the current `CreateFlowStep` id. */
const LEGACY_CREATE_FLOW_STEP_RENAMES: Readonly<Record<string, string>> = {
  "right-rail": "decision-approaches",
};

/**
 * Normalizes parsed draft JSON before merging into create-flow context.
 * Renames deprecated step ids so old drafts and bookmarks stay valid.
 */
export function migrateLegacyCreateFlowState(
  raw: Record<string, unknown> | null | undefined,
): CreateFlowState {
  if (!raw || typeof raw !== "object") return {};
  const step = raw.currentStep;
  if (typeof step === "string") {
    const next = LEGACY_CREATE_FLOW_STEP_RENAMES[step];
    if (next !== undefined) {
      return { ...raw, currentStep: next } as CreateFlowState;
    }
  }
  return raw as CreateFlowState;
}
