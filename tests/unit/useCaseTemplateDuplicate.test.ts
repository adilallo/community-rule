import { describe, expect, it } from "vitest";
import { useCaseTemplateDuplicateTitle } from "../../lib/useCaseTemplateDuplicate";

describe("useCaseTemplateDuplicateTitle", () => {
  it("appends Template (Copy) to the source title", () => {
    expect(useCaseTemplateDuplicateTitle("BoCo Street Medics")).toBe(
      "BoCo Street Medics Template (Copy)",
    );
  });

  it("falls back when the source title is empty", () => {
    expect(useCaseTemplateDuplicateTitle("   ")).toBe(
      "Community Rule Template (Copy)",
    );
  });
});
