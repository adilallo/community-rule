/**
 * Step definitions and helpers for the Create Rule Flow
 *
 * Single source of truth for step order and navigation helpers.
 * Order matches Figma Create Community (frames 1–8) then later stages.
 * `community-structure` precedes `community-context` and `community-size` (Figma frame 3 vs 5 swap).
 */

import type { CreateFlowStep } from "../types";

/**
 * Ordered list of steps in the create rule flow
 */
export const FLOW_STEP_ORDER: readonly CreateFlowStep[] = [
  "informational",
  "community-name",
  "community-structure",
  "community-context",
  "community-size",
  "community-upload",
  "community-save",
  "review",
  "core-values",
  "communication-methods",
  "membership-methods",
  "decision-approaches",
  "conflict-management",
  "confirm-stakeholders",
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

/** Options for navigation when the email / magic-link save step is not shown (signed-in users). */
export type CreateFlowNavigationOptions = {
  skipCommunitySave?: boolean;
};

/**
 * Returns the next step in the flow, or null if current is last/invalid
 */
export function getNextStep(
  currentStep: CreateFlowStep | null | undefined,
  options?: CreateFlowNavigationOptions,
): CreateFlowStep | null {
  if (!currentStep) return null;
  const index = FLOW_STEP_ORDER.indexOf(currentStep);
  if (index === -1 || index === FLOW_STEP_ORDER.length - 1) return null;
  const next = FLOW_STEP_ORDER[index + 1] as CreateFlowStep;
  if (options?.skipCommunitySave && next === "community-save") {
    return getNextStep("community-save", options);
  }
  return next;
}

/**
 * Returns the previous step in the flow, or null if current is first/invalid
 */
export function getPreviousStep(
  currentStep: CreateFlowStep | null | undefined,
  options?: CreateFlowNavigationOptions,
): CreateFlowStep | null {
  if (!currentStep) return null;
  const index = FLOW_STEP_ORDER.indexOf(currentStep);
  if (index <= 0) return null;
  const prev = FLOW_STEP_ORDER[index - 1] as CreateFlowStep;
  if (options?.skipCommunitySave && prev === "community-save") {
    return getPreviousStep("community-save", options);
  }
  return prev;
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

/**
 * Parses `/create/{screenId}` (and optional trailing segments) from pathname.
 * Returns null for non-wizard paths (e.g. `/create/review-template/...`).
 */
export function parseCreateFlowScreenFromPathname(
  pathname: string | null,
): CreateFlowStep | null {
  if (!pathname || pathname.length === 0) return null;
  if (pathname.includes("/create/review-template/")) return null;

  const parts = pathname.split("/").filter(Boolean);
  const createIdx = parts.indexOf("create");
  if (createIdx === -1 || createIdx >= parts.length - 1) return null;

  const segment = parts[createIdx + 1];
  if (segment === "review-template") return null;

  return isValidStep(segment) ? segment : null;
}
