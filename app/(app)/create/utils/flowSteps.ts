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
 * Valid URL segments for `/create/[screenId]` (includes branch-only `edit-rule`).
 * Linear order for navigation remains {@link FLOW_STEP_ORDER}.
 */
export const VALID_STEPS: readonly CreateFlowStep[] = [
  ...FLOW_STEP_ORDER,
  "edit-rule",
] as const;

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
 * Where the create-flow footer Back action should go. Usually the previous
 * step in {@link FLOW_STEP_ORDER}; when the user reached `confirm-stakeholders`
 * via template **Use without changes**, Back returns to template review instead
 * of `conflict-management` (that segment was skipped).
 */
export type CreateFlowBackTarget =
  | { kind: "step"; step: CreateFlowStep }
  | { kind: "templateReview"; slug: string };

export function resolveCreateFlowBackTarget(
  currentStep: CreateFlowStep | null | undefined,
  options: CreateFlowNavigationOptions | undefined,
  templateReviewBackSlug: string | undefined | null,
): CreateFlowBackTarget | null {
  const slug =
    typeof templateReviewBackSlug === "string"
      ? templateReviewBackSlug.trim()
      : "";
  if (currentStep === "confirm-stakeholders" && slug.length > 0) {
    return { kind: "templateReview", slug };
  }
  const prev = getPreviousStep(currentStep, options);
  return prev != null ? { kind: "step", step: prev } : null;
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

/** Same query as `/templates?fromFlow=1` — template was picked after `/create/review`. */
export const TEMPLATE_REVIEW_FROM_CREATE_FLOW_QUERY = "fromFlow" as const;
export const TEMPLATE_REVIEW_FROM_CREATE_FLOW_VALUE = "1" as const;

/**
 * `/create/review-template/{slug}` with optional marker so chrome can send
 * footer Back to `/create/review` instead of marketing home.
 */
export function buildTemplateReviewHref(
  slug: string,
  options?: { fromCreateWizard?: boolean },
): string {
  const path = `/create/review-template/${encodeURIComponent(slug)}`;
  if (options?.fromCreateWizard) {
    return `${path}?${TEMPLATE_REVIEW_FROM_CREATE_FLOW_QUERY}=${TEMPLATE_REVIEW_FROM_CREATE_FLOW_VALUE}`;
  }
  return path;
}
