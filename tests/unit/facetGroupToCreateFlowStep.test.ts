import { describe, expect, it } from "vitest";
import { createFlowStepForFacetGroup } from "../../app/(app)/create/utils/facetGroupToCreateFlowStep";

describe("createFlowStepForFacetGroup", () => {
  it("maps facet keys to custom-rule URL segments", () => {
    expect(createFlowStepForFacetGroup("coreValues")).toBe("core-values");
    expect(createFlowStepForFacetGroup("communication")).toBe(
      "communication-methods",
    );
    expect(createFlowStepForFacetGroup("membership")).toBe("membership-methods");
    expect(createFlowStepForFacetGroup("decisionApproaches")).toBe(
      "decision-approaches",
    );
    expect(createFlowStepForFacetGroup("conflictManagement")).toBe(
      "conflict-management",
    );
  });
});
