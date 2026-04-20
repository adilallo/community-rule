import type { SectionId } from "./validation/methodFacetsSchemas";

/**
 * Extracts the `(section, slug)` pairs that a curated `RuleTemplate.body`
 * composes. Used by `/api/templates` to score templates by facet match
 * (CR-88, §9.1).
 *
 * `body.sections[].categoryName` is mapped to the canonical recommendation
 * `section` id; `entries[].title` is slugified the same way the messages
 * ingest produced `methods[].id` (kebab-case, ASCII-folded, lowercase) so
 * the slugs line up with `MethodFacet.slug`.
 *
 * "Values" entries are intentionally skipped — values are out of scope for
 * the facet matrix (§11).
 */

const CATEGORY_NAME_TO_SECTION: Record<string, SectionId> = {
  Communication: "communication",
  Membership: "membership",
  "Decision-making": "decisionApproaches",
  "Conflict management": "conflictManagement",
};

export function methodSlugFromTitle(title: string): string {
  // Match the slugify rules of the one-time messages ingest: NFKD-normalize,
  // strip diacritics, drop apostrophes/brackets, collapse non-alphanumerics
  // to single hyphens, trim leading/trailing hyphens.
  const folded = title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  const stripped = folded
    .toLowerCase()
    .replace(/['’`()\[\]]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return stripped;
}

type RuleTemplateBodySection = {
  categoryName?: unknown;
  entries?: unknown;
};
type RuleTemplateBody = { sections?: unknown };

export type TemplateMethodRef = { section: SectionId; slug: string };

export function templateMethodsFromBody(
  body: unknown,
): TemplateMethodRef[] {
  if (!body || typeof body !== "object") return [];
  const sections = (body as RuleTemplateBody).sections;
  if (!Array.isArray(sections)) return [];

  const out: TemplateMethodRef[] = [];
  const seen = new Set<string>();
  for (const raw of sections) {
    if (!raw || typeof raw !== "object") continue;
    const sec = raw as RuleTemplateBodySection;
    const categoryName =
      typeof sec.categoryName === "string" ? sec.categoryName : null;
    if (!categoryName) continue;
    const section = CATEGORY_NAME_TO_SECTION[categoryName];
    if (!section) continue; // Values, or any future category we don't score.
    if (!Array.isArray(sec.entries)) continue;
    for (const entry of sec.entries) {
      if (!entry || typeof entry !== "object") continue;
      const title = (entry as { title?: unknown }).title;
      if (typeof title !== "string" || title.trim() === "") continue;
      const slug = methodSlugFromTitle(title);
      if (!slug) continue;
      const key = `${section}:${slug}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ section, slug });
    }
  }
  return out;
}
