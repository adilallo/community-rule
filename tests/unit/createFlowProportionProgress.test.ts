import { describe, it, expect } from "vitest";
import { getProportionBarProgressForCreateFlowStep } from "../../app/(app)/create/utils/createFlowProportionProgress";

describe("getProportionBarProgressForCreateFlowStep", () => {
  it("uses 1-2 on community-structure (third Create Community step)", () => {
    expect(getProportionBarProgressForCreateFlowStep("community-structure")).toBe(
      "1-2",
    );
  });

  it("advances proportion after structure for context and size", () => {
    expect(getProportionBarProgressForCreateFlowStep("community-context")).toBe(
      "1-3",
    );
    expect(getProportionBarProgressForCreateFlowStep("community-size")).toBe(
      "1-4",
    );
  });

  it("uses 2-0 on community-save, review, and core-values (Create Community segment / same fill)", () => {
    expect(getProportionBarProgressForCreateFlowStep("community-save")).toBe(
      "2-0",
    );
    expect(getProportionBarProgressForCreateFlowStep("review")).toBe("2-0");
    expect(getProportionBarProgressForCreateFlowStep("core-values")).toBe(
      "2-0",
    );
  });

  it("uses 2-1 on communication-methods", () => {
    expect(
      getProportionBarProgressForCreateFlowStep("communication-methods"),
    ).toBe("2-1");
  });

  it("uses 2-2 on membership-methods", () => {
    expect(
      getProportionBarProgressForCreateFlowStep("membership-methods"),
    ).toBe("2-2");
  });

  it("uses 2-3 on decision-approaches (Figma Flow — Right Rail)", () => {
    expect(
      getProportionBarProgressForCreateFlowStep("decision-approaches"),
    ).toBe("2-3");
  });

  it("uses 3-0 on conflict-management (start of Review segment)", () => {
    expect(
      getProportionBarProgressForCreateFlowStep("conflict-management"),
    ).toBe("3-0");
  });
});
