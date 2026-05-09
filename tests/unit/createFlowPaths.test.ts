import { describe, expect, it } from "vitest";
import {
  CREATE_FLOW_SYNC_DRAFT_QUERY,
  CREATE_FLOW_SYNC_DRAFT_VALUE,
  CREATE_ROUTES,
  createFlowStepPath,
  createFlowStepPathAfterStrippingReviewReturn,
  createFlowStepPathWithSyncDraft,
} from "../../app/(app)/create/utils/createFlowPaths";
import { CREATE_FLOW_REVIEW_RETURN_QUERY_KEY } from "../../app/(app)/create/utils/flowSteps";

describe("createFlowPaths (CR-92 §2)", () => {
  it("createFlowStepPath builds segment path", () => {
    expect(createFlowStepPath("review")).toBe("/create/review");
  });

  it("createFlowStepPath encodes query", () => {
    expect(
      createFlowStepPath("completed", { celebrate: "1", foo: "bar" }),
    ).toBe("/create/completed?celebrate=1&foo=bar");
  });

  it("createFlowStepPathWithSyncDraft", () => {
    expect(createFlowStepPathWithSyncDraft("final-review")).toBe(
      `/create/final-review?${CREATE_FLOW_SYNC_DRAFT_QUERY}=${CREATE_FLOW_SYNC_DRAFT_VALUE}`,
    );
  });

  it("createFlowStepPathAfterStrippingReviewReturn drops reviewReturn only", () => {
    const sp = new URLSearchParams(
      `a=1&${CREATE_FLOW_REVIEW_RETURN_QUERY_KEY}=final-review&b=2`,
    );
    expect(createFlowStepPathAfterStrippingReviewReturn("final-review", sp)).toBe(
      "/create/final-review?a=1&b=2",
    );
  });

  it("CREATE_ROUTES constants", () => {
    expect(CREATE_ROUTES.review).toBe("/create/review");
    expect(CREATE_ROUTES.completed).toBe("/create/completed");
  });
});
