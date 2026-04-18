import type { ProportionBarState } from "../../components/progress/ProportionBar/ProportionBar.types";
import type { CreateFlowStep } from "../types";
import { FLOW_STEP_ORDER, getStepIndex } from "./flowSteps";

/**
 * One `ProportionBarState` per index in `FLOW_STEP_ORDER` (same length).
 * Third Create Community step (`community-structure`) uses `1-2` per Figma.
 */
const PROPORTION_BY_STEP_INDEX: readonly ProportionBarState[] = [
  "1-0", // informational
  "1-1", // community-name
  "1-2", // community-structure
  "1-3", // community-context
  "1-4", // community-size
  "1-5", // community-upload
  "2-0", // community-save
  "2-0", // review (Figma Flow — Review `19706:12135`: same segment fill as end of Create Community)
  "2-0", // core-values (same segment as review / end of Create Community)
  "2-1", // communication-methods (Figma — Compact Card Stack)
  "2-2", // membership-methods (Figma — Compact Card Stack `20858:13947`)
  "2-3", // decision-approaches (Figma Flow — Right Rail `20523:23509`)
  "3-0", // conflict-management (Figma Flow — Compact Card Stack `20879:15979`; start of Review segment)
  "3-1", // confirm-stakeholders
  "3-2", // final-review
  "3-2", // completed
] as const;

if (PROPORTION_BY_STEP_INDEX.length !== FLOW_STEP_ORDER.length) {
  throw new Error(
    "createFlowProportionProgress: PROPORTION_BY_STEP_INDEX length must match FLOW_STEP_ORDER",
  );
}

export function getProportionBarProgressForCreateFlowStep(
  step: CreateFlowStep | null | undefined,
): ProportionBarState {
  const idx = getStepIndex(step);
  if (idx < 0) return "1-0";
  return PROPORTION_BY_STEP_INDEX[idx] ?? "1-0";
}
