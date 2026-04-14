import { describe, it, expect } from "vitest";
import {
  FLOW_STEP_ORDER,
  getNextStep,
  getPreviousStep,
  isValidStep,
  getStepIndex,
} from "../../app/create/utils/flowSteps";

describe("flowSteps", () => {
  it("places confirm-stakeholders immediately before final-review", () => {
    const i = FLOW_STEP_ORDER.indexOf("confirm-stakeholders");
    const j = FLOW_STEP_ORDER.indexOf("final-review");
    expect(i).toBeGreaterThanOrEqual(0);
    expect(j).toBe(i + 1);
  });

  it("getNextStep returns next step in order", () => {
    expect(getNextStep("right-rail")).toBe("confirm-stakeholders");
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

  it("isValidStep reflects FLOW_STEP_ORDER membership", () => {
    expect(isValidStep("community-size")).toBe(true);
    expect(isValidStep("confirm-stakeholders")).toBe(true);
    expect(isValidStep("nope")).toBe(false);
    expect(isValidStep(null)).toBe(false);
  });

  it("getStepIndex matches position in FLOW_STEP_ORDER", () => {
    expect(getStepIndex("informational")).toBe(0);
    expect(getStepIndex("completed")).toBe(FLOW_STEP_ORDER.length - 1);
    // @ts-expect-error — invalid step id
    expect(getStepIndex("bogus")).toBe(-1);
  });
});
