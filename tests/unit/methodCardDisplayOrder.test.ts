import { describe, it, expect } from "vitest";
import {
  mergeCompactCardIdsWithPinnedSelected,
  orderRankedMethodsWithPinnedSelection,
} from "../../lib/create/methodCardDisplayOrder";

describe("orderRankedMethodsWithPinnedSelection", () => {
  const methods = [
    { id: "a", rank: "top" },
    { id: "b", rank: "mid" },
    { id: "c", rank: "low" },
  ];

  it("returns ranked order when pinning is inactive", () => {
    expect(
      orderRankedMethodsWithPinnedSelection(methods, ["c", "b"], false),
    ).toEqual(methods);
  });

  it("returns ranked order when there are no selections", () => {
    expect(orderRankedMethodsWithPinnedSelection(methods, [], true)).toEqual(
      methods,
    );
  });

  it("pins selected ids ahead of ranked tail while preserving ranking in each block", () => {
    expect(
      orderRankedMethodsWithPinnedSelection(methods, ["c", "a"], true),
    ).toEqual([
      { id: "c", rank: "low" },
      { id: "a", rank: "top" },
      { id: "b", rank: "mid" },
    ]);
  });

  it("dedupes repeated ids in the selection list", () => {
    expect(
      orderRankedMethodsWithPinnedSelection(methods, ["b", "b", "c"], true),
    ).toEqual([
      { id: "b", rank: "mid" },
      { id: "c", rank: "low" },
      { id: "a", rank: "top" },
    ]);
  });
});

describe("mergeCompactCardIdsWithPinnedSelected", () => {
  const showcaseOrder = ["x", "a", "b", "y", "c"];
  const baseCompact = ["a", "y", "b"];

  it("delegates when pinning is inactive", () => {
    expect(
      mergeCompactCardIdsWithPinnedSelected(
        showcaseOrder,
        baseCompact,
        ["x"],
        false,
        3,
      ),
    ).toEqual(["a", "y", "b"]);
  });

  it("pads selected-first then facet-derived compact slots", () => {
    expect(
      mergeCompactCardIdsWithPinnedSelected(
        showcaseOrder,
        baseCompact,
        ["c"],
        true,
        4,
      ),
    ).toEqual(["c", "a", "y", "b"]);
  });

  it("fills remaining compact slots from showcase tail when facets run short", () => {
    expect(
      mergeCompactCardIdsWithPinnedSelected(showcaseOrder, [], ["x"], true, 3),
    ).toEqual(["x", "a", "b"]);
  });
});
