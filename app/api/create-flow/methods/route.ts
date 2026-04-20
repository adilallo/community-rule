import { NextResponse, type NextRequest } from "next/server";
import { isDatabaseConfigured } from "../../../../lib/server/env";
import { listMethodRecommendations } from "../../../../lib/server/methodRecommendations";
import { dbUnavailable } from "../../../../lib/server/responses";
import {
  SECTION_IDS,
  type SectionId,
  parseRequestedFacetsFromSearchParams,
} from "../../../../lib/server/validation/methodFacetsSchemas";

const SECTION_SET = new Set<string>(SECTION_IDS);

/**
 * GET /api/create-flow/methods?section=<section>[&facet.*=...]
 *
 * Returns slugs + per-method match scores for one of the four card-deck
 * sections; the wizard renders by looking up the slug in the section's
 * messages file (`useMessages().create.customRule.<section>.methods`).
 *
 * See `docs/guides/template-recommendation-matrix.md` §9.2 / §10.
 */
export async function GET(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return dbUnavailable();
  }

  const sectionParam = request.nextUrl.searchParams.get("section");
  if (!sectionParam || !SECTION_SET.has(sectionParam)) {
    return NextResponse.json(
      {
        error: {
          code: "validation_error",
          message: `Unknown section. Expected one of: ${SECTION_IDS.join(", ")}`,
        },
      },
      { status: 400 },
    );
  }
  const section = sectionParam as SectionId;

  const facets = parseRequestedFacetsFromSearchParams(
    request.nextUrl.searchParams,
  );
  const result = await listMethodRecommendations({ section, facets });
  if (!result) {
    // DB query failed; return empty so the wizard falls back to its messages
    // deck in authoring order (§10).
    return NextResponse.json({ section, methods: [] });
  }

  const methods = result.rankedSlugs.map((slug) => ({
    slug,
    matches: result.matchesBySlug[slug] ?? { score: 0, matchedFacets: [] },
  }));
  return NextResponse.json({ section, methods });
}
