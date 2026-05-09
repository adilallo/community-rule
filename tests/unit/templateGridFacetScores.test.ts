import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  deriveRecommendedTemplateSlugs,
  gridEntriesWithFacetScores,
} from "../../lib/templates/templateGridPresentation";
import { fetchRankedTemplatesByFacets } from "../../lib/create/fetchTemplates";
import type { RuleTemplateDto } from "../../lib/create/fetchTemplates";

const minimalTemplate = (slug: string, title: string): RuleTemplateDto => ({
  id: "x",
  slug,
  title,
  category: null,
  description: null,
  body: null,
  sortOrder: 0,
  featured: false,
});

describe("deriveRecommendedTemplateSlugs", () => {
  it("returns at most limit slugs in the top score tier (API order for ties)", () => {
    const templates = ["a", "b", "c", "d", "e", "f"].map((s) => ({ slug: s }));
    const scores = Object.fromEntries(
      ["a", "b", "c", "d", "e", "f"].map((s) => [
        s,
        { score: 1, matchedFacets: [] as string[] },
      ]),
    );
    const set = deriveRecommendedTemplateSlugs(templates, scores, 5);
    expect(set.size).toBe(5);
    expect([...set]).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("only recommends the highest score group, not lower tiers to fill the cap", () => {
    const templates = ["a", "b", "c", "d", "e"].map((s) => ({ slug: s }));
    const scores = {
      a: { score: 4, matchedFacets: [] as string[] },
      b: { score: 4, matchedFacets: [] as string[] },
      c: { score: 3, matchedFacets: [] as string[] },
      d: { score: 3, matchedFacets: [] as string[] },
      e: { score: 3, matchedFacets: [] as string[] },
    };
    const set = deriveRecommendedTemplateSlugs(templates, scores, 5);
    expect([...set]).toEqual(["a", "b"]);
  });
});

describe("gridEntriesWithFacetScores", () => {
  it("sets recommended true only for top compact matches (like card decks)", () => {
    const t = minimalTemplate("do-ocracy", "Do-ocracy");
    const [row] = gridEntriesWithFacetScores([t], {
      "do-ocracy": { score: 3, matchedFacets: ["a"] },
    });
    expect(row.recommended).toBe(true);
  });

  it("does not mark lower-scoring templates recommended when a higher tier exists", () => {
    const high = [
      minimalTemplate("a", "A"),
      minimalTemplate("b", "B"),
    ];
    const low = minimalTemplate("c", "C");
    const rows = gridEntriesWithFacetScores([...high, low], {
      a: { score: 4, matchedFacets: [] },
      b: { score: 4, matchedFacets: [] },
      c: { score: 3, matchedFacets: [] },
    });
    const rec = rows.filter((r) => r.recommended).map((r) => r.slug);
    expect(rec).toEqual(["a", "b"]);
  });

  it("caps top-tier recommended badges to compactRecommendedLimit", () => {
    const slugs = ["a", "b", "c", "d", "e", "f"];
    const templates = slugs.map((s) => minimalTemplate(s, s));
    const scores = Object.fromEntries(
      slugs.map((s) => [s, { score: 1, matchedFacets: [] as string[] }]),
    );
    const rows = gridEntriesWithFacetScores(templates, scores, {
      compactRecommendedLimit: 5,
    });
    expect(rows.filter((r) => r.recommended).map((r) => r.slug)).toEqual([
      "a",
      "b",
      "c",
      "d",
      "e",
    ]);
  });

  it("sets recommended false when score is zero or missing", () => {
    const t = minimalTemplate("consensus", "Consensus");
    const [a] = gridEntriesWithFacetScores([t], {
      consensus: { score: 0, matchedFacets: [] },
    });
    const [b] = gridEntriesWithFacetScores([t], {});
    expect(a.recommended).toBe(false);
    expect(b.recommended).toBe(false);
  });
});

describe("fetchRankedTemplatesByFacets", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("parses ok JSON with templates and scores", async () => {
    const template = minimalTemplate("s", "T");
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        templates: [template],
        scores: { s: { score: 1, matchedFacets: ["size:oneMember"] } },
      }),
    } as Response);
    const r = await fetchRankedTemplatesByFacets({
      facetQuery: "facet.size=oneMember",
    });
    expect("error" in r).toBe(false);
    if (!("error" in r)) {
      expect(r.templates).toEqual([template]);
      expect(r.scores.s?.score).toBe(1);
    }
  });

  it("returns error when facetQuery is empty", async () => {
    const r = await fetchRankedTemplatesByFacets({ facetQuery: "" });
    expect("error" in r).toBe(true);
  });
});
