import { NextResponse, type NextRequest } from "next/server";
import { isDatabaseConfigured } from "../../../../lib/server/env";
import {
  listCatalogCoreValues,
  listCatalogMethods,
  type CatalogCoreValueDto,
  type CatalogMethodDto,
} from "../../../../lib/server/governanceCatalog";
import { listMethodRecommendations } from "../../../../lib/server/methodRecommendations";
import { apiRoute } from "../../../../lib/server/apiRoute";
import { dbUnavailable, errorJson } from "../../../../lib/server/responses";
import { CATALOG_SECTION_IDS } from "../../../../lib/create/customRuleFacets";
import {
  type CatalogSectionId,
  type SectionId,
  flattenRequestedFacets,
  parseRequestedFacetsFromSearchParams,
} from "../../../../lib/server/validation/methodFacetsSchemas";

const CATALOG_SECTION_SET = new Set<string>(CATALOG_SECTION_IDS);
const CATALOG_CACHE_CONTROL = "public, max-age=3600";

/** Route query alias → canonical `coreValues`. */
function normalizeSectionParam(raw: string): string {
  return raw === "values" ? "coreValues" : raw;
}

type MethodMatch = { score: number; matchedFacets: string[] };

function rankCatalogMethods(
  catalog: CatalogMethodDto[],
  matchesBySlug: Record<string, MethodMatch> | null,
  includeMatches: boolean,
): Array<CatalogMethodDto & { matches?: MethodMatch }> {
  if (!matchesBySlug || !includeMatches) {
    return catalog;
  }

  const indexBySlug = new Map(catalog.map((m, i) => [m.slug, i]));
  const sorted = [...catalog].sort((a, b) => {
    const sa = matchesBySlug[a.slug]?.score ?? 0;
    const sb = matchesBySlug[b.slug]?.score ?? 0;
    if (sa !== sb) return sb - sa;
    return (indexBySlug.get(a.slug) ?? 0) - (indexBySlug.get(b.slug) ?? 0);
  });

  return sorted.map((m) => ({
    ...m,
    matches: matchesBySlug[m.slug] ?? { score: 0, matchedFacets: [] },
  }));
}

/**
 * GET /api/create-flow/methods?section=<section>[&facet.*=...]
 *
 * Returns the full built-in catalog for one facet: four method decks
 * (with optional facet ranking) or all preset core values. Copy is
 * included in v1 (English only).
 *
 * See `docs/guides/template-recommendation-matrix.md` §9.2 / §9.5 (CR-115).
 */
export const GET = apiRoute(
  "createFlow.methods.get",
  async (request: NextRequest) => {
    if (!isDatabaseConfigured()) {
      return dbUnavailable();
    }

    const sectionParam = request.nextUrl.searchParams.get("section");
    if (!sectionParam) {
      return errorJson(
        "validation_error",
        `Unknown section. Expected one of: ${CATALOG_SECTION_IDS.join(", ")} (alias: values → coreValues)`,
        400,
      );
    }

    const normalized = normalizeSectionParam(sectionParam);
    if (!CATALOG_SECTION_SET.has(normalized)) {
      return errorJson(
        "validation_error",
        `Unknown section. Expected one of: ${CATALOG_SECTION_IDS.join(", ")} (alias: values → coreValues)`,
        400,
      );
    }
    const section = normalized as CatalogSectionId;

    if (section === "coreValues") {
      const methods: CatalogCoreValueDto[] = listCatalogCoreValues();
      return NextResponse.json(
        { section: "coreValues" as const, methods },
        { headers: { "Cache-Control": CATALOG_CACHE_CONTROL } },
      );
    }

    const facets = parseRequestedFacetsFromSearchParams(
      request.nextUrl.searchParams,
    );
    const catalog = listCatalogMethods(section as SectionId);
    const facetSection = section as SectionId;

    const ranking = await listMethodRecommendations({
      section: facetSection,
      facets,
    });

    const includeMatches = flattenRequestedFacets(facets).length > 0;

    let matchesBySlug: Record<string, MethodMatch> | null = null;
    if (includeMatches && ranking) {
      matchesBySlug = ranking.matchesBySlug;
    }

    const methods = rankCatalogMethods(
      catalog,
      matchesBySlug,
      includeMatches,
    );

    return NextResponse.json(
      { section, methods },
      { headers: { "Cache-Control": CATALOG_CACHE_CONTROL } },
    );
  },
);
