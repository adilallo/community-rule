import { describe, expect, it } from "vitest";
import {
  flattenRequestedFacets,
  methodFacetsSchema,
  parseRequestedFacetsFromSearchParams,
  resolveFacetMatch,
} from "../../lib/server/validation/methodFacetsSchemas";

describe("methodFacetsSchema", () => {
  it("accepts boolean cells and partial groups", () => {
    expect(
      methodFacetsSchema.safeParse({
        size: { oneMember: true, twoToFive: false },
        orgType: { dao: { match: true, weight: 0.5 } },
      }).success,
    ).toBe(true);
  });

  it("rejects unknown facet group", () => {
    expect(
      methodFacetsSchema.safeParse({
        nonsense: { foo: true },
      }).success,
    ).toBe(false);
  });

  it("rejects unknown value within a known group", () => {
    expect(
      methodFacetsSchema.safeParse({
        size: { gigantic: true },
      }).success,
    ).toBe(false);
  });
});

describe("resolveFacetMatch", () => {
  it("treats undefined as { match:false }", () => {
    expect(resolveFacetMatch(undefined)).toEqual({
      match: false,
      weight: null,
    });
  });
  it("preserves weight when given as object", () => {
    expect(resolveFacetMatch({ match: true, weight: 1.5 })).toEqual({
      match: true,
      weight: 1.5,
    });
  });
});

describe("parseRequestedFacetsFromSearchParams", () => {
  it("collects facet.* params across multiple values per group", () => {
    const params = new URLSearchParams();
    params.append("facet.size", "oneMember");
    params.append("facet.orgType", "dao");
    params.append("facet.orgType", "nonprofit");
    const out = parseRequestedFacetsFromSearchParams(params);
    expect(out.size).toEqual(["oneMember"]);
    expect(out.orgType?.sort()).toEqual(["dao", "nonprofit"]);
  });

  it("silently drops unknown groups and values", () => {
    const params = new URLSearchParams();
    params.append("facet.size", "tiny");
    params.append("facet.unknown", "dao");
    params.append("foo", "bar");
    expect(parseRequestedFacetsFromSearchParams(params)).toEqual({});
  });
});

describe("flattenRequestedFacets", () => {
  it("emits one entry per (group, value) pair", () => {
    const flat = flattenRequestedFacets({
      size: ["oneMember", "twoToFive"],
      orgType: ["dao"],
    });
    expect(flat).toEqual([
      { group: "size", value: "oneMember" },
      { group: "size", value: "twoToFive" },
      { group: "orgType", value: "dao" },
    ]);
  });
});
