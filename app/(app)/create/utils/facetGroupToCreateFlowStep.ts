import type { TemplateFacetGroupKey } from "../../../../lib/create/templateReviewMapping";
import { createFlowStepForCustomRuleFacetGroup } from "../../../../lib/create/customRuleFacets";
import type { CreateFlowStep } from "../types";

/**
 * Custom-rule URL segment for a final-review category row (`+` navigation).
 * Source: {@link CUSTOM_RULE_FACETS} (CR-92).
 */
export function createFlowStepForFacetGroup(
  groupKey: TemplateFacetGroupKey,
): CreateFlowStep {
  return createFlowStepForCustomRuleFacetGroup(groupKey);
}
