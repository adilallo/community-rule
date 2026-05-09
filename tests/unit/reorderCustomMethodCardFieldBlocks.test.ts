import { describe, expect, it } from "vitest";
import { reorderCustomMethodCardFieldBlocks } from "../../lib/create/reorderCustomMethodCardFieldBlocks";

describe("reorderCustomMethodCardFieldBlocks", () => {
  it("returns a new array with the item moved forward", () => {
    const blocks = ["a", "b", "c"];
    expect(reorderCustomMethodCardFieldBlocks(blocks, 0, 2)).toEqual([
      "b",
      "c",
      "a",
    ]);
    expect(blocks).toEqual(["a", "b", "c"]);
  });

  it("returns a new array with the item moved backward", () => {
    expect(
      reorderCustomMethodCardFieldBlocks(["a", "b", "c"], 2, 0),
    ).toEqual(["c", "a", "b"]);
  });

  it("returns a shallow copy when from and to are equal", () => {
    const blocks = ["a", "b"];
    const next = reorderCustomMethodCardFieldBlocks(blocks, 1, 1);
    expect(next).toEqual(blocks);
    expect(next).not.toBe(blocks);
  });

  it("returns a copy when indices are out of range", () => {
    const blocks = ["a"];
    expect(reorderCustomMethodCardFieldBlocks(blocks, -1, 0)).toEqual(["a"]);
    expect(reorderCustomMethodCardFieldBlocks(blocks, 0, 5)).toEqual(["a"]);
  });
});
