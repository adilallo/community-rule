import { describe, it, expect } from "vitest";
import {
  FLOW_STEP_ORDER,
  buildTemplateReviewHref,
  getNextStep,
  getPreviousStep,
  isValidStep,
  getStepIndex,
  parseReviewReturnSearchParam,
  resolveCreateFlowBackTarget,
  TEMPLATES_FACET_RECOMMEND_QUERY,
  TEMPLATES_FACET_RECOMMEND_VALUE,
  TEMPLATE_REVIEW_FROM_CREATE_FLOW_QUERY,
  TEMPLATE_REVIEW_FROM_CREATE_FLOW_VALUE,
} from "../../app/(app)/create/utils/flowSteps";

describe("flowSteps", () => {
  it("places confirm-stakeholders immediately before final-review", () => {
    const i = FLOW_STEP_ORDER.indexOf("confirm-stakeholders");
    const j = FLOW_STEP_ORDER.indexOf("final-review");
    expect(i).toBeGreaterThanOrEqual(0);
    expect(j).toBe(i + 1);
  });

  it("getNextStep returns next step in order", () => {
    expect(getNextStep("communication-methods")).toBe("membership-methods");
    expect(getNextStep("membership-methods")).toBe("decision-approaches");
    expect(getNextStep("decision-approaches")).toBe("conflict-management");
    expect(getNextStep("conflict-management")).toBe("confirm-stakeholders");
    expect(getNextStep("confirm-stakeholders")).toBe("final-review");
  });

  it("getNextStep returns null for last step or invalid", () => {
    expect(getNextStep("completed")).toBeNull();
    expect(getNextStep(null)).toBeNull();
    // @ts-expect-error — exercise invalid step id at runtime
    expect(getNextStep("not-a-step")).toBeNull();
  });

  it("getPreviousStep returns prior step or null", () => {
    expect(getPreviousStep("final-review")).toBe("confirm-stakeholders");
    expect(getPreviousStep("informational")).toBeNull();
    expect(getPreviousStep(null)).toBeNull();
  });

  it("isValidStep allows branch-only edit-rule URL segment", () => {
    expect(isValidStep("edit-rule")).toBe(true);
  });

  it("getNextStep and getPreviousStep return null for edit-rule (not in linear order)", () => {
    expect(getNextStep("edit-rule")).toBeNull();
    expect(getPreviousStep("edit-rule")).toBeNull();
  });

  it("getStepIndex matches position in FLOW_STEP_ORDER", () => {
    expect(getStepIndex("informational")).toBe(0);
    expect(getStepIndex("completed")).toBe(FLOW_STEP_ORDER.length - 1);
    // @ts-expect-error — invalid step id
    expect(getStepIndex("bogus")).toBe(-1);
  });

  it("places community-structure before community-context and community-size (Figma order)", () => {
    expect(getStepIndex("community-structure")).toBe(2);
    expect(getStepIndex("community-context")).toBe(3);
    expect(getStepIndex("community-size")).toBe(4);
    expect(getNextStep("community-name")).toBe("community-structure");
    expect(getNextStep("community-structure")).toBe("community-context");
    expect(getNextStep("community-context")).toBe("community-size");
  });

  it("skipCommunitySave bridges upload → review and review → upload", () => {
    const opts = { skipCommunitySave: true } as const;
    expect(getNextStep("community-upload", opts)).toBe("review");
    expect(getPreviousStep("review", opts)).toBe("community-upload");
  });

  it("skipCommunitySave does not change steps outside the save segment", () => {
    const opts = { skipCommunitySave: true } as const;
    expect(getNextStep("community-size", opts)).toBe("community-upload");
    expect(getNextStep("review", opts)).toBe("core-values");
    expect(getPreviousStep("communication-methods", opts)).toBe("core-values");
  });

  it("resolveCreateFlowBackTarget returns template review when use-without slug is set on confirm-stakeholders", () => {
    expect(
      resolveCreateFlowBackTarget(
        "confirm-stakeholders",
        undefined,
        "mutual-aid-mondays",
      ),
    ).toEqual({ kind: "templateReview", slug: "mutual-aid-mondays" });
  });

  it("resolveCreateFlowBackTarget falls back to linear previous when slug is absent", () => {
    expect(
      resolveCreateFlowBackTarget("confirm-stakeholders", undefined, undefined),
    ).toEqual({ kind: "step", step: "conflict-management" });
  });

  it("resolveCreateFlowBackTarget ignores whitespace-only slug", () => {
    expect(
      resolveCreateFlowBackTarget("confirm-stakeholders", undefined, "   "),
    ).toEqual({ kind: "step", step: "conflict-management" });
  });

  it("buildTemplateReviewHref encodes slug and optional fromFlow query", () => {
    expect(buildTemplateReviewHref("a/b")).toBe("/create/review-template/a%2Fb");
    expect(buildTemplateReviewHref("mutual-aid", { fromCreateWizard: true })).toBe(
      "/create/review-template/mutual-aid?fromFlow=1",
    );
  });

  it("review Create from template uses fromFlow and recommendTemplates together", () => {
    expect(
      `/templates?${TEMPLATE_REVIEW_FROM_CREATE_FLOW_QUERY}=${TEMPLATE_REVIEW_FROM_CREATE_FLOW_VALUE}&${TEMPLATES_FACET_RECOMMEND_QUERY}=${TEMPLATES_FACET_RECOMMEND_VALUE}`,
    ).toBe("/templates?fromFlow=1&recommendTemplates=1");
  });

  it("parseReviewReturnSearchParam accepts only final-review and edit-rule", () => {
    expect(
      parseReviewReturnSearchParam(
        new URLSearchParams("reviewReturn=final-review"),
      ),
    ).toBe("final-review");
    expect(
      parseReviewReturnSearchParam(
        new URLSearchParams("reviewReturn=edit-rule"),
      ),
    ).toBe("edit-rule");
    expect(
      parseReviewReturnSearchParam(new URLSearchParams("reviewReturn=nope")),
    ).toBeNull();
    expect(parseReviewReturnSearchParam(null)).toBeNull();
  });
});
