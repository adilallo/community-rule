import { describe, it, expect } from "vitest";
import { hasCreateFlowUserInput } from "../../app/create/utils/hasCreateFlowUserInput";

describe("hasCreateFlowUserInput", () => {
  it("returns false for empty state", () => {
    expect(hasCreateFlowUserInput({})).toBe(false);
  });

  it("ignores currentStep alone", () => {
    expect(hasCreateFlowUserInput({ currentStep: "informational" })).toBe(
      false,
    );
  });

  it("returns true for non-empty title", () => {
    expect(hasCreateFlowUserInput({ title: "My rule" })).toBe(true);
  });

  it("returns false for whitespace-only title", () => {
    expect(hasCreateFlowUserInput({ title: "   " })).toBe(false);
  });

  it("returns true for non-empty sections array", () => {
    expect(hasCreateFlowUserInput({ sections: [{}] })).toBe(true);
  });

  it("returns false for empty sections array", () => {
    expect(hasCreateFlowUserInput({ sections: [] })).toBe(false);
  });

  it("returns true for extra step-specific keys with content", () => {
    expect(hasCreateFlowUserInput({ cards: ["a"] })).toBe(true);
  });

  it("returns false for extra keys with empty object", () => {
    expect(hasCreateFlowUserInput({ foo: {} })).toBe(false);
  });
});
