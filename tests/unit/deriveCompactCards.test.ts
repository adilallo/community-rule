import { describe, expect, it } from "vitest";
import { deriveCompactCards } from "../../app/(app)/create/hooks/useFacetRecommendations";

const methods = [
  { id: "alpha" },
  { id: "bravo" },
  { id: "charlie" },
  { id: "delta" },
  { id: "echo" },
  { id: "foxtrot" },
  { id: "golf" },
] as const;

describe("deriveCompactCards", () => {
  it("falls back to authoring order with no badges when no facets selected", () => {
    const result = deriveCompactCards(methods, {}, false, 5);
    expect(result.compactCardIds).toEqual([
      "alpha",
      "bravo",
      "charlie",
      "delta",
      "echo",
    ]);
    expect(result.recommendedIds.size).toBe(0);
  });

  it("falls back to authoring order with no badges when facets selected but every score is zero", () => {
    const result = deriveCompactCards(methods, {}, true, 5);
    expect(result.compactCardIds).toEqual([
      "alpha",
      "bravo",
      "charlie",
      "delta",
      "echo",
    ]);
    expect(result.recommendedIds.size).toBe(0);
  });

  it("shows only recommended (matched) cards when fewer than the limit match", () => {
    const result = deriveCompactCards(
      methods,
      { bravo: 2, delta: 1 },
      true,
      5,
    );
    // Caller is responsible for pre-ranking by score (rankMethodsByScore).
    // This test passes already-ranked input; the hook just respects ordering
    // and tags only the matched subset — no padding with unrecommended cards.
    expect(result.compactCardIds).toEqual(["bravo", "delta"]);
    expect([...result.recommendedIds].sort()).toEqual(["bravo", "delta"]);
  });

  it("caps recommended cards at the limit when more than `limit` match", () => {
    const scores = {
      alpha: 4,
      bravo: 3,
      charlie: 3,
      delta: 2,
      echo: 1,
      foxtrot: 1,
      golf: 1,
    };
    const result = deriveCompactCards(methods, scores, true, 5);
    expect(result.compactCardIds).toEqual([
      "alpha",
      "bravo",
      "charlie",
      "delta",
      "echo",
    ]);
    expect(result.recommendedIds.size).toBe(5);
    expect([...result.recommendedIds].sort()).toEqual([
      "alpha",
      "bravo",
      "charlie",
      "delta",
      "echo",
    ]);
  });

  it("returns a single card when only one method matches", () => {
    const result = deriveCompactCards(methods, { charlie: 4 }, true, 5);
    expect(result.compactCardIds).toEqual(["charlie"]);
    expect([...result.recommendedIds]).toEqual(["charlie"]);
  });

  it("respects a smaller `limit` even when many methods match", () => {
    const scores = { alpha: 4, bravo: 3, charlie: 3, delta: 2 };
    const result = deriveCompactCards(methods, scores, true, 3);
    expect(result.compactCardIds).toEqual(["alpha", "bravo", "charlie"]);
    expect(result.recommendedIds.size).toBe(3);
  });
});
