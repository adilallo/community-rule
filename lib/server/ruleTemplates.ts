import type { RuleTemplateDto } from "../create/fetchTemplates";
import { prisma } from "./db";
import { isDatabaseConfigured } from "./env";
import {
  getTemplateFacetSlugSet,
  scoreTemplatesByFacets,
  scoreTemplatesByTemplateFacets,
} from "./methodRecommendations";
import { templateMethodsFromBody } from "./templateMethods";
import type { RequestedFacets } from "./validation/methodFacetsSchemas";
import { flattenRequestedFacets } from "./validation/methodFacetsSchemas";

const TEMPLATE_SELECT = {
  id: true,
  slug: true,
  title: true,
  category: true,
  description: true,
  body: true,
  sortOrder: true,
  featured: true,
} as const;

const CURATED_ORDER_BY = [
  { featured: "desc" as const },
  { sortOrder: "asc" as const },
  { title: "asc" as const },
];

/**
 * Curated templates for public list UIs (same query as GET /api/templates).
 * Returns [] when the database is not configured or on query failure.
 */
export async function listRuleTemplatesFromDb(): Promise<RuleTemplateDto[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }
  try {
    return await prisma.ruleTemplate.findMany({
      orderBy: CURATED_ORDER_BY,
      select: TEMPLATE_SELECT,
    });
  } catch {
    return [];
  }
}

export type TemplateScore = {
  score: number;
  matchedFacets: string[];
};

export type RankedTemplatesResult = {
  templates: RuleTemplateDto[];
  /** Per-template-slug score map; absent slugs scored `0`. */
  scores: Record<string, TemplateScore>;
};

/**
 * Curated templates ranked by facet match. Templates with a row in
 * `TemplateFacet` (seeded from `data/templates/templateFacet.json`, Template
 * Composition-2, cols G–Y) use that matrix; others fall back to
 * composed-method × `MethodFacet`
 * scoring (§9.1). When `facets` is empty, returns the curated ordering with
 * an empty `scores` map (caller can omit it from the API response).
 *
 * Ties (and zero-score templates) fall back to the curated
 * `(featured, sortOrder, title)` order so no-facets and zero-match cases
 * produce identical output to `listRuleTemplatesFromDb`.
 */
export async function listRankedRuleTemplatesFromDb(
  facets: RequestedFacets,
): Promise<RankedTemplatesResult> {
  if (!isDatabaseConfigured()) {
    return { templates: [], scores: {} };
  }
  const requested = flattenRequestedFacets(facets);
  if (requested.length === 0) {
    const templates = await listRuleTemplatesFromDb();
    return { templates, scores: {} };
  }

  let templates: RuleTemplateDto[];
  try {
    templates = await prisma.ruleTemplate.findMany({
      orderBy: CURATED_ORDER_BY,
      select: TEMPLATE_SELECT,
    });
  } catch {
    return { templates: [], scores: {} };
  }

  const slugs = templates.map((t) => t.slug);
  const templateMethods = templates.map((t) => ({
    templateSlug: t.slug,
    methods: templateMethodsFromBody(t.body),
  }));

  const [matrixRanked, facetSlugSet, methodRanked] = await Promise.all([
    scoreTemplatesByTemplateFacets({ templateSlugs: slugs, facets }),
    getTemplateFacetSlugSet(),
    scoreTemplatesByFacets({ templateMethods, facets }),
  ]);

  if (!methodRanked) {
    return { templates, scores: {} };
  }

  const matrixBySlug =
    matrixRanked == null
      ? new Map()
      : new Map(matrixRanked.map((r) => [r.templateSlug, r] as const));
  const methodBySlug = new Map(
    methodRanked.map((r) => [r.templateSlug, r] as const),
  );

  const scores: Record<string, TemplateScore> = {};
  for (const t of templates) {
    const useMatrix =
      matrixRanked != null && (facetSlugSet?.has(t.slug) ?? false);
    if (useMatrix) {
      const m = matrixBySlug.get(t.slug);
      if (m) {
        scores[t.slug] = {
          score: m.score,
          matchedFacets: m.matchedFacets,
        };
      }
    } else {
      const m = methodBySlug.get(t.slug);
      if (m) {
        scores[t.slug] = {
          score: m.score,
          matchedFacets: m.matchedFacets,
        };
      }
    }
  }

  // Stable sort: scoreDesc, then preserve curated index order.
  const indexBySlug = new Map(templates.map((t, i) => [t.slug, i]));
  const sorted = [...templates].sort((a, b) => {
    const sa = scores[a.slug]?.score ?? 0;
    const sb = scores[b.slug]?.score ?? 0;
    if (sa !== sb) return sb - sa;
    return (indexBySlug.get(a.slug) ?? 0) - (indexBySlug.get(b.slug) ?? 0);
  });

  return { templates: sorted, scores };
}
