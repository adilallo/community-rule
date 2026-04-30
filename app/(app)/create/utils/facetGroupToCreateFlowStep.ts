import type { TemplateFacetGroupKey } from "../../../../lib/create/templateReviewMapping";
import type { CreateFlowStep } from "../types";

const MAP: Record<TemplateFacetGroupKey, CreateFlowStep> = {
  coreValues: "core-values",
  communication: "communication-methods",
  membership: "membership-methods",
  decisionApproaches: "decision-approaches",
  conflictManagement: "conflict-management",
};

/**
 * Custom-rule URL segment for a final-review category row (`+` navigation).
 */
export function createFlowStepForFacetGroup(
  groupKey: TemplateFacetGroupKey,
): CreateFlowStep {
  return MAP[groupKey];
}
