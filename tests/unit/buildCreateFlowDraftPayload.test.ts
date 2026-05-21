import { describe, expect, it } from "vitest";
import { buildCreateFlowDraftPayload } from "../../lib/create/buildCreateFlowDraftPayload";

describe("buildCreateFlowDraftPayload", () => {
  it("merges state with currentStep when provided", () => {
    expect(
      buildCreateFlowDraftPayload(
        { title: "Oak Street Collective" },
        "community-save",
      ),
    ).toEqual({
      title: "Oak Street Collective",
      currentStep: "community-save",
    });
  });

  it("returns state unchanged when currentStep is omitted", () => {
    expect(
      buildCreateFlowDraftPayload({ title: "Oak Street Collective" }),
    ).toEqual({ title: "Oak Street Collective" });
  });
});
