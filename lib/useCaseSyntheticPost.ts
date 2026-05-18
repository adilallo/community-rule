import type { BlogPost } from "./content";
import { markdownToHtml } from "./content";
import type useCasesDetail from "../messages/en/pages/useCasesDetail.json";

export const USE_CASE_DETAIL_SLUGS = [
  "mutual-aid-colorado",
  "food-not-bombs",
  "boulder-county-street-medics",
] as const;

export type UseCaseDetailSlug = (typeof USE_CASE_DETAIL_SLUGS)[number];

type UseCasesDetailMessages = typeof useCasesDetail;

export type UseCaseDetailContentKey = keyof UseCasesDetailMessages;

const SLUG_TO_CONTENT_KEY: Record<UseCaseDetailSlug, UseCaseDetailContentKey> = {
  "mutual-aid-colorado": "mutualAidColorado",
  "food-not-bombs": "foodNotBombs",
  "boulder-county-street-medics": "boulderCountyStreetMedics",
};

export function isUseCaseDetailSlug(slug: string): slug is UseCaseDetailSlug {
  return (USE_CASE_DETAIL_SLUGS as readonly string[]).includes(slug);
}

export function useCaseContentKeyForSlug(
  slug: UseCaseDetailSlug,
): UseCaseDetailContentKey {
  return SLUG_TO_CONTENT_KEY[slug];
}

export function buildUseCaseSyntheticPost(
  slug: UseCaseDetailSlug,
  detail: UseCasesDetailMessages,
): BlogPost {
  const contentKey = useCaseContentKeyForSlug(slug);
  const entry = detail[contentKey];
  const { banner, bodyMarkdown } = entry;

  return {
    slug: `__use-case__:${slug}`,
    frontmatter: {
      title: banner.title,
      description: banner.description,
      author: banner.author,
      date: banner.date,
    },
    content: bodyMarkdown,
    htmlContent: markdownToHtml(bodyMarkdown),
    filePath: `messages/en/pages/useCasesDetail.json#${contentKey}`,
    lastModified: new Date(banner.date),
  };
}

export function getUseCaseDetailEntry(
  slug: UseCaseDetailSlug,
  detail: UseCasesDetailMessages,
) {
  return detail[useCaseContentKeyForSlug(slug)];
}
