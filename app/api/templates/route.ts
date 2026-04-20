import { NextResponse, type NextRequest } from "next/server";
import { isDatabaseConfigured } from "../../../lib/server/env";
import { listRankedRuleTemplatesFromDb } from "../../../lib/server/ruleTemplates";
import { dbUnavailable } from "../../../lib/server/responses";
import { parseRequestedFacetsFromSearchParams } from "../../../lib/server/validation/methodFacetsSchemas";

/**
 * GET /api/templates
 *
 * No params → curated ordering (`featured` desc, `sortOrder` asc, `title`
 * asc). With `facet.<group>=<value>` query params (repeatable per group),
 * templates are re-ranked by composed-method match count; ties fall back to
 * the curated order, score-0 templates remain at the end.
 *
 * See `docs/guides/template-recommendation-matrix.md` §9.1.
 */
export async function GET(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return dbUnavailable();
  }

  const facets = parseRequestedFacetsFromSearchParams(
    request.nextUrl.searchParams,
  );
  const { templates, scores } = await listRankedRuleTemplatesFromDb(facets);
  const hasScores = Object.keys(scores).length > 0;

  return NextResponse.json(
    hasScores ? { templates, scores } : { templates },
  );
}
