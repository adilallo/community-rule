import { describe, it, expect } from "vitest";
import { buildFacetQueryString } from "../../lib/create/buildFacetQueryString";

describe("buildFacetQueryString", () => {
  it("maps community chip ids to facet.* query params", () => {
    const qs = buildFacetQueryString({
      selectedCommunitySizeIds: ["2"],
      selectedOrganizationTypeIds: ["3"],
      selectedScaleIds: ["1"],
      selectedMaturityIds: ["1"],
    });
    const params = new URLSearchParams(qs);
    expect(params.get("facet.size")).toBe("twoToFive");
    expect(params.get("facet.orgType")).toBe("openSource");
    expect(params.get("facet.scale")).toBe("local");
    expect(params.get("facet.maturity")).toBe("earlyStage");
  });

  it("returns empty string when no selections", () => {
    expect(buildFacetQueryString({})).toBe("");
  });
});
