import { describe, it, expect } from "vitest";
import { migrateLegacyCreateFlowState } from "../../lib/create/migrateLegacyCreateFlowState";

describe("migrateLegacyCreateFlowState", () => {
  it("maps communityReflection to communitySaveEmail when save email empty", () => {
    const out = migrateLegacyCreateFlowState({
      title: "T",
      communityReflection: "old@example.com",
    });
    expect(out.communitySaveEmail).toBe("old@example.com");
    expect("communityReflection" in out).toBe(false);
  });

  it("does not overwrite existing communitySaveEmail", () => {
    const out = migrateLegacyCreateFlowState({
      communityReflection: "old@example.com",
      communitySaveEmail: "kept@example.com",
    });
    expect(out.communitySaveEmail).toBe("kept@example.com");
  });

  it("rewrites currentStep slug", () => {
    const out = migrateLegacyCreateFlowState({
      currentStep: "community-reflection",
    });
    expect(out.currentStep).toBe("community-save");
  });

  it("returns empty object for nullish input", () => {
    expect(migrateLegacyCreateFlowState(null)).toEqual({});
    expect(migrateLegacyCreateFlowState(undefined)).toEqual({});
  });
});
