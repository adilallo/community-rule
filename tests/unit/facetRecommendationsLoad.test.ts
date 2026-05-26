import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildFacetRecommendationRequestKey,
  getCachedFacetScores,
  loadFacetScores,
} from "../../lib/create/facetRecommendationsLoad";

describe("loadFacetScores", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          methods: [
            { slug: "slack", matches: { score: 3 } },
            { slug: "email", matches: { score: 1 } },
          ],
        }),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("caches scores by section and facet query", async () => {
    const queryString = "facet.size=small";
    const scores = await loadFacetScores("communication", queryString);

    expect(scores).toEqual({ slack: 3, email: 1 });
    expect(
      getCachedFacetScores(
        buildFacetRecommendationRequestKey("communication", queryString),
      ),
    ).toEqual(scores);
    expect(fetch).toHaveBeenCalledTimes(1);

    await loadFacetScores("communication", queryString);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("dedupes in-flight requests for the same key", async () => {
    const queryString = "facet.size=small";
    const [a, b] = await Promise.all([
      loadFacetScores("membership", queryString),
      loadFacetScores("membership", queryString),
    ]);

    expect(a).toEqual(b);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
