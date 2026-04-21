import { beforeEach, describe, expect, it, vi } from "vitest";

const findManyMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => true,
}));

vi.mock("../../lib/server/db", () => ({
  prisma: {
    methodFacet: {
      findMany: (...args: unknown[]) => findManyMock(...args),
    },
  },
}));

import {
  listMethodRecommendations,
  scoreTemplatesByFacets,
} from "../../lib/server/methodRecommendations";

beforeEach(() => {
  findManyMock.mockReset();
});

describe("listMethodRecommendations (CR-88 §9.2)", () => {
  it("returns empty rankings when no facets are requested", async () => {
    const result = await listMethodRecommendations({
      section: "communication",
      facets: {},
    });
    expect(result).toEqual({ rankedSlugs: [], matchesBySlug: {} });
    expect(findManyMock).not.toHaveBeenCalled();
  });

  it("scores methods by counting matched (group, value) pairs", async () => {
    findManyMock.mockResolvedValueOnce([
      { slug: "loomio", group: "size", value: "thirteenToOneHundred" },
      { slug: "loomio", group: "orgType", value: "workersCoop" },
      { slug: "in-person", group: "size", value: "thirteenToOneHundred" },
    ]);

    const result = await listMethodRecommendations({
      section: "communication",
      facets: {
        size: ["thirteenToOneHundred"],
        orgType: ["workersCoop"],
      },
    });

    expect(result).toEqual({
      rankedSlugs: ["loomio", "in-person"],
      matchesBySlug: {
        loomio: {
          score: 2,
          matchedFacets: ["size:thirteenToOneHundred", "orgType:workersCoop"],
        },
        "in-person": {
          score: 1,
          matchedFacets: ["size:thirteenToOneHundred"],
        },
      },
    });
  });

  it("returns null on query failure (caller falls back to authoring order)", async () => {
    findManyMock.mockRejectedValueOnce(new Error("db down"));
    const result = await listMethodRecommendations({
      section: "communication",
      facets: { size: ["oneMember"] },
    });
    expect(result).toBeNull();
  });

  it("dedupes (group, value) so the same row never double-counts", async () => {
    findManyMock.mockResolvedValueOnce([
      { slug: "loomio", group: "size", value: "twoToFive" },
      { slug: "loomio", group: "size", value: "twoToFive" },
    ]);
    const result = await listMethodRecommendations({
      section: "communication",
      facets: { size: ["twoToFive"] },
    });
    expect(result?.matchesBySlug["loomio"]?.score).toBe(1);
  });
});

describe("scoreTemplatesByFacets (CR-88 §9.1)", () => {
  it("aggregates per-method matches per template", async () => {
    findManyMock.mockResolvedValueOnce([
      {
        section: "communication",
        slug: "loomio",
        group: "size",
        value: "twoToFive",
      },
      {
        section: "decisionApproaches",
        slug: "consensus-decision-making",
        group: "orgType",
        value: "workersCoop",
      },
    ]);

    const result = await scoreTemplatesByFacets({
      facets: {
        size: ["twoToFive"],
        orgType: ["workersCoop"],
      },
      templateMethods: [
        {
          templateSlug: "consensus",
          methods: [
            { section: "communication", slug: "loomio" },
            {
              section: "decisionApproaches",
              slug: "consensus-decision-making",
            },
          ],
        },
        {
          templateSlug: "monarch",
          methods: [
            {
              section: "decisionApproaches",
              slug: "benevolent-dictator",
            },
          ],
        },
      ],
    });

    expect(result).toEqual([
      {
        templateSlug: "consensus",
        score: 2,
        matchedFacets: [
          "communication:loomio:size:twoToFive",
          "decisionApproaches:consensus-decision-making:orgType:workersCoop",
        ],
      },
      { templateSlug: "monarch", score: 0, matchedFacets: [] },
    ]);
  });

  it("returns 0-score entries for every template when facets are empty", async () => {
    const result = await scoreTemplatesByFacets({
      facets: {},
      templateMethods: [
        { templateSlug: "consensus", methods: [] },
        { templateSlug: "monarch", methods: [] },
      ],
    });
    expect(result).toEqual([
      { templateSlug: "consensus", score: 0, matchedFacets: [] },
      { templateSlug: "monarch", score: 0, matchedFacets: [] },
    ]);
    expect(findManyMock).not.toHaveBeenCalled();
  });
});
