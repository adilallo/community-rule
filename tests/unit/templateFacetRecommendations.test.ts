import { beforeEach, describe, expect, it, vi } from "vitest";

const templateFindManyMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => true,
}));

vi.mock("../../lib/server/db", () => ({
  prisma: {
    templateFacet: {
      findMany: (...args: unknown[]) => templateFindManyMock(...args),
    },
  },
}));

import {
  getTemplateFacetSlugSet,
  scoreTemplatesByTemplateFacets,
} from "../../lib/server/methodRecommendations";

beforeEach(() => {
  templateFindManyMock.mockReset();
});

describe("scoreTemplatesByTemplateFacets", () => {
  it("counts matches against TemplateFacet rows", async () => {
    templateFindManyMock.mockResolvedValueOnce([
      { templateSlug: "consensus", group: "size", value: "oneMember" },
      { templateSlug: "consensus", group: "orgType", value: "dao" },
    ]);

    const out = await scoreTemplatesByTemplateFacets({
      templateSlugs: ["consensus", "unknown-slug"],
      facets: {
        size: ["oneMember"],
        orgType: ["dao"],
        scale: [],
        maturity: [],
      },
    });

    const consensus = out?.find((r) => r.templateSlug === "consensus");
    const unknown = out?.find((r) => r.templateSlug === "unknown-slug");
    expect(consensus?.score).toBe(2);
    expect(consensus?.matchedFacets).toEqual([
      "size:oneMember",
      "orgType:dao",
    ]);
    expect(unknown?.score).toBe(0);
  });

  it("returns zero when no facets requested", async () => {
    const out = await scoreTemplatesByTemplateFacets({
      templateSlugs: ["consensus"],
      facets: {},
    });
    expect(out?.[0]?.score).toBe(0);
    expect(templateFindManyMock).not.toHaveBeenCalled();
  });
});

describe("getTemplateFacetSlugSet", () => {
  it("returns distinct template slugs", async () => {
    templateFindManyMock.mockResolvedValueOnce([
      { templateSlug: "consensus" },
      { templateSlug: "do-ocracy" },
    ]);

    const set = await getTemplateFacetSlugSet();
    expect(set?.has("consensus")).toBe(true);
    expect(set?.has("do-ocracy")).toBe(true);
  });
});
