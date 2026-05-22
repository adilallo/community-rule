import { NextResponse, type NextRequest } from "next/server";
import { isDatabaseConfigured } from "../../../../lib/server/env";
import { getRuleTemplateBySlug } from "../../../../lib/server/ruleTemplates";
import { templateMethodsFromBody } from "../../../../lib/server/templateMethods";
import { apiRoute } from "../../../../lib/server/apiRoute";
import { dbUnavailable, notFound } from "../../../../lib/server/responses";

type RouteContext = { params: Promise<{ slug: string }> };

const CATALOG_CACHE_CONTROL = "public, max-age=3600";

/**
 * GET /api/templates/[slug]
 *
 * Single seeded template plus normalized `(section, slug)` composition
 * derived from `body`. Public read; 404 when unknown.
 *
 * See `docs/guides/template-recommendation-matrix.md` §9.4 (CR-115).
 */
export const GET = apiRoute<RouteContext>(
  "templates.bySlug",
  async (_request: NextRequest, context) => {
    if (!isDatabaseConfigured()) {
      return dbUnavailable();
    }

    const { slug } = await context.params;
    const template = await getRuleTemplateBySlug(slug);
    if (!template) {
      return notFound();
    }

    const methods = templateMethodsFromBody(template.body);
    return NextResponse.json(
      { template, methods },
      { headers: { "Cache-Control": CATALOG_CACHE_CONTROL } },
    );
  },
);
