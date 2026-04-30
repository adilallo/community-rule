import type { RuleTemplateDto, TemplateFacetScoreDto } from "../create/fetchTemplates";
import { templateSummaryFromBody } from "../create/templateReviewMapping";
import type { GovernanceTemplateCatalogEntry } from "./governanceTemplateCatalog";
import {
  GOVERNANCE_TEMPLATE_CATALOG,
  getGovernanceTemplateCatalogEntry,
  governanceTemplateIconPath,
} from "./governanceTemplateCatalog";

/** Matches TemplateReviewCard when slug is absent from the Figma catalog. */
export const TEMPLATE_GRID_FALLBACK_PRESENTATION = {
  iconPath: governanceTemplateIconPath("consensus"),
  backgroundColor: "bg-[var(--color-surface-invert-brand-teal)]",
  recommended: false,
} as const;

export type TemplateGridCardEntry = GovernanceTemplateCatalogEntry;

function presentationForSlug(slug: string): Pick<
  GovernanceTemplateCatalogEntry,
  "iconPath" | "backgroundColor" | "recommended"
> {
  const catalog = getGovernanceTemplateCatalogEntry(slug);
  if (catalog) {
    return {
      iconPath: catalog.iconPath,
      backgroundColor: catalog.backgroundColor,
      recommended: catalog.recommended === true,
    };
  }
  return TEMPLATE_GRID_FALLBACK_PRESENTATION;
}

/**
 * One grid card: API copy + Figma icon/surface from catalog (or fallback).
 */
export function ruleTemplateToGridEntry(template: RuleTemplateDto): TemplateGridCardEntry {
  const pres = presentationForSlug(template.slug);
  const description = templateSummaryFromBody(template.description, template.body);
  return {
    slug: template.slug,
    title: template.title,
    description,
    iconPath: pres.iconPath,
    backgroundColor: pres.backgroundColor,
    recommended: pres.recommended,
  };
}

/**
 * Max templates that show the “RECOMMENDED” tag when facet-ranked. Within the
 * **top score tier** only: we do not pad with lower-scoring templates (e.g. two
 * at score 4 and three at 3 → recommend the two 4s only), but if the top tier
 * exceeds this cap we still take the first `limit` in API order.
 */
export const TEMPLATE_GRID_COMPACT_RECOMMENDED_LIMIT = 5;

/**
 * Among templates in **API rank order** (score desc) with `score > 0`, mark
 * only those in the **maximum-score tier** (no lower tiers), at most `limit`
 * (API order is the tie-break when many tie for first place).
 */
export function deriveRecommendedTemplateSlugs(
  templatesInRankOrder: ReadonlyArray<{ slug: string }>,
  scores: Record<string, { score?: number } | undefined>,
  limit: number,
): Set<string> {
  if (limit <= 0) return new Set();
  const matched = templatesInRankOrder.filter(
    (t) => (scores[t.slug]?.score ?? 0) > 0,
  );
  if (matched.length === 0) return new Set();
  let maxScore = 0;
  for (const t of matched) {
    const s = scores[t.slug]?.score ?? 0;
    if (s > maxScore) maxScore = s;
  }
  const topTier = matched.filter(
    (t) => (scores[t.slug]?.score ?? 0) === maxScore,
  );
  return new Set(topTier.slice(0, limit).map((t) => t.slug));
}

export type GridEntriesWithFacetScoresOptions = {
  /** Default {@link TEMPLATE_GRID_COMPACT_RECOMMENDED_LIMIT}. */
  compactRecommendedLimit?: number;
};

/**
 * After `GET /api/templates?facet.*` with `scores`, mark `recommended` only
 * for the top facet matches (see {@link deriveRecommendedTemplateSlugs}).
 */
export function gridEntriesWithFacetScores(
  templates: RuleTemplateDto[],
  scores: Record<string, TemplateFacetScoreDto>,
  options?: GridEntriesWithFacetScoresOptions,
): TemplateGridCardEntry[] {
  const cap =
    options?.compactRecommendedLimit ?? TEMPLATE_GRID_COMPACT_RECOMMENDED_LIMIT;
  const recommendedSlugs = deriveRecommendedTemplateSlugs(
    templates,
    scores,
    cap,
  );
  return templates.map((t) => {
    const base = ruleTemplateToGridEntry(t);
    return {
      ...base,
      recommended: recommendedSlugs.has(t.slug),
    };
  });
}

const bySlug = (templates: RuleTemplateDto[]) =>
  new Map(templates.map((t) => [t.slug, t] as const));

/**
 * Ordered subset for home: follow `slugOrder`; skip missing slugs.
 */
export function gridEntriesForSlugOrder(
  templates: RuleTemplateDto[],
  slugOrder: readonly string[],
): TemplateGridCardEntry[] {
  const map = bySlug(templates);
  const out: TemplateGridCardEntry[] = [];
  for (const slug of slugOrder) {
    const t = map.get(slug);
    if (t) out.push(ruleTemplateToGridEntry(t));
  }
  return out;
}

/**
 * Home row: prefer API row per slug; if missing, use static Figma catalog entry.
 */
export function gridEntriesForSlugOrderWithCatalogFallback(
  templates: RuleTemplateDto[],
  slugOrder: readonly string[],
): TemplateGridCardEntry[] {
  const map = bySlug(templates);
  const out: TemplateGridCardEntry[] = [];
  for (const slug of slugOrder) {
    const t = map.get(slug);
    if (t) {
      out.push(ruleTemplateToGridEntry(t));
      continue;
    }
    const cat = getGovernanceTemplateCatalogEntry(slug);
    if (cat) out.push(cat);
  }
  return out;
}

/**
 * Full templates index: `featured` first, then `sortOrder`, then title.
 */
export function gridEntriesForFullCatalog(templates: RuleTemplateDto[]): TemplateGridCardEntry[] {
  const withSort = [...templates].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.title.localeCompare(b.title);
  });
  return withSort.map(ruleTemplateToGridEntry);
}

/**
 * Marketing `/templates`: use API order when rows exist; otherwise static catalog.
 */
export function gridEntriesForFullCatalogWithFallback(
  templates: RuleTemplateDto[],
): TemplateGridCardEntry[] {
  if (templates.length === 0) {
    return [...GOVERNANCE_TEMPLATE_CATALOG];
  }
  return gridEntriesForFullCatalog(templates);
}
