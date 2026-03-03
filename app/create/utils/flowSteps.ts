/**
 * Step definitions and helpers for the Create Rule Flow
 *
 * Single source of truth for step order and navigation helpers.
 */

import type { CreateFlowStep } from "../types";

/**
 * Ordered list of steps in the create rule flow
 */
export const FLOW_STEP_ORDER: readonly CreateFlowStep[] = [
  "informational",
  "text",
  "select",
  "upload",
  "review",
  "cards",
  "right-rail",
  "final-review",
  "completed",
] as const;

/**
 * Valid step IDs for the create flow (for validation)
 */
export const VALID_STEPS: readonly CreateFlowStep[] = FLOW_STEP_ORDER;

/**
 * First step in the flow (entry point)
 */
export const FIRST_STEP: CreateFlowStep = FLOW_STEP_ORDER[0];

/**
 * Returns the next step in the flow, or null if current is last/invalid
 */
export function getNextStep(
  currentStep: CreateFlowStep | null | undefined,
): CreateFlowStep | null {
  if (!currentStep) return null;
  const index = FLOW_STEP_ORDER.indexOf(currentStep);
  if (index === -1 || index === FLOW_STEP_ORDER.length - 1) return null;
  return FLOW_STEP_ORDER[index + 1] as CreateFlowStep;
}

/**
 * Returns the previous step in the flow, or null if current is first/invalid
 */
export function getPreviousStep(
  currentStep: CreateFlowStep | null | undefined,
): CreateFlowStep | null {
  if (!currentStep) return null;
  const index = FLOW_STEP_ORDER.indexOf(currentStep);
  if (index <= 0) return null;
  return FLOW_STEP_ORDER[index - 1] as CreateFlowStep;
}

/**
 * Returns the index of the step (0-based), or -1 if invalid
 */
export function getStepIndex(step: CreateFlowStep | null | undefined): number {
  if (!step) return -1;
  return FLOW_STEP_ORDER.indexOf(step);
}

/**
 * Whether the given string is a valid create flow step
 */
export function isValidStep(
  step: string | null | undefined,
): step is CreateFlowStep {
  return (
    typeof step === "string" &&
    (VALID_STEPS as readonly string[]).includes(step)
  );
}
