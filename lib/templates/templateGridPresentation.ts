import type { RuleTemplateDto } from "../create/fetchTemplates";
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
} as const;

export type TemplateGridCardEntry = GovernanceTemplateCatalogEntry;

function presentationForSlug(slug: string): Pick<
  GovernanceTemplateCatalogEntry,
  "iconPath" | "backgroundColor"
> {
  const catalog = getGovernanceTemplateCatalogEntry(slug);
  return catalog ?? TEMPLATE_GRID_FALLBACK_PRESENTATION;
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
  };
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
