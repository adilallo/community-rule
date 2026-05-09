/**
 * Central `/create/...` path builders (Linear CR-92 §2).
 * Prefer these over string literals so layout, redirects, hooks, and tests stay aligned.
 */

import type { CreateFlowStep } from "../types";
import { CREATE_FLOW_REVIEW_RETURN_QUERY_KEY } from "./flowSteps";

export const CREATE_ROUTES = {
  root: "/",
  createRoot: "/create",
  /** First step resolves via redirect from `/create`. */
  createFirstStep: "/create",
  review: "/create/review",
  finalReview: "/create/final-review",
  completed: "/create/completed",
  editRule: "/create/edit-rule",
} as const;

/**
 * Post-login return and session-gate paths on wizard steps.
 * (Also used when `pathname` is unknown but `syncDraft` must be appended.)
 */
export const CREATE_FLOW_SYNC_DRAFT_QUERY = "syncDraft" as const;
export const CREATE_FLOW_SYNC_DRAFT_VALUE = "1" as const;

export function createFlowStepPathWithSyncDraft(step: CreateFlowStep): string {
  return createFlowStepPath(step, {
    [CREATE_FLOW_SYNC_DRAFT_QUERY]: CREATE_FLOW_SYNC_DRAFT_VALUE,
  });
}

export type CreateFlowPathQuery = Record<
  string,
  string | number | boolean | undefined
>;

/**
 * Path for a wizard step: `/create/{screenId}` with optional query string.
 */
export function createFlowStepPath(
  step: CreateFlowStep,
  query?: CreateFlowPathQuery,
): string {
  const base = `/create/${step}`;
  if (query == null || Object.keys(query).length === 0) return base;
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined) continue;
    sp.set(k, String(v));
  }
  const q = sp.toString();
  return q.length > 0 ? `${base}?${q}` : base;
}

export function createCompletedPath(query?: CreateFlowPathQuery): string {
  return createFlowStepPath("completed", query);
}

/**
 * Navigate back from a facet step to final-review / edit-rule, dropping
 * `reviewReturn` from the current query while preserving other params.
 */
export function createFlowStepPathAfterStrippingReviewReturn(
  step: CreateFlowStep,
  searchParams: URLSearchParams | null | undefined,
): string {
  const params = new URLSearchParams(searchParams?.toString() ?? "");
  params.delete(CREATE_FLOW_REVIEW_RETURN_QUERY_KEY);
  const query: CreateFlowPathQuery = {};
  params.forEach((value, key) => {
    query[key] = value;
  });
  return createFlowStepPath(
    step,
    Object.keys(query).length > 0 ? query : undefined,
  );
}
