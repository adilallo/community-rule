import { describe, it, expect } from "vitest";
import { createFlowStateHasKeys } from "../../lib/create/draftHydrationUtils";

describe("createFlowStateHasKeys", () => {
  it("returns false for empty object", () => {
    expect(createFlowStateHasKeys({})).toBe(false);
  });

  it("returns true when any key is present", () => {
    expect(createFlowStateHasKeys({ title: "x" })).toBe(true);
    expect(createFlowStateHasKeys({ currentStep: "community-name" })).toBe(
      true,
    );
  });
});
