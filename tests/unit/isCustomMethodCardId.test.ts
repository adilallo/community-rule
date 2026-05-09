import { describe, expect, it } from "vitest";
import { isCustomMethodCardId } from "../../lib/create/isCustomMethodCardId";

describe("isCustomMethodCardId", () => {
  it("is false when meta is missing or id has no entry", () => {
    expect(isCustomMethodCardId("signal", undefined)).toBe(false);
    expect(isCustomMethodCardId("signal", {})).toBe(false);
  });

  it("is true when customMethodCardMetaById has the id", () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    expect(
      isCustomMethodCardId(id, {
        [id]: { label: "L", supportText: "S" },
      }),
    ).toBe(true);
  });
});
