import { describe, expect, it } from "vitest";
import { moveFacetSelectionIdToFront } from "../../lib/create/methodCardSelectionOrder";

describe("moveFacetSelectionIdToFront", () => {
  it("places a new id at index 0", () => {
    expect(moveFacetSelectionIdToFront(["a", "b"], "c")).toEqual(["c", "a", "b"]);
  });

  it("moves an existing id to index 0 without duplicating", () => {
    expect(moveFacetSelectionIdToFront(["a", "b", "c"], "b")).toEqual([
      "b",
      "a",
      "c",
    ]);
  });

  it("handles empty prior selection", () => {
    expect(moveFacetSelectionIdToFront([], "x")).toEqual(["x"]);
  });
});
