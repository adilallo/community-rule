import { describe, it, expect } from "vitest";
import { migrateLegacyCreateFlowState } from "../../lib/create/migrateLegacyCreateFlowState";

describe("migrateLegacyCreateFlowState", () => {
  it("passes through object payloads", () => {
    const out = migrateLegacyCreateFlowState({
      title: "T",
      currentStep: "community-save",
    });
    expect(out.title).toBe("T");
    expect(out.currentStep).toBe("community-save");
  });

  it("returns empty object for nullish input", () => {
    expect(migrateLegacyCreateFlowState(null)).toEqual({});
    expect(migrateLegacyCreateFlowState(undefined)).toEqual({});
  });

  it("renames legacy right-rail step to decision-approaches", () => {
    const out = migrateLegacyCreateFlowState({
      currentStep: "right-rail",
      title: "T",
    });
    expect(out.currentStep).toBe("decision-approaches");
    expect(out.title).toBe("T");
  });
});
