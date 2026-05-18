import type { BlogPost } from "./content";
import { markdownToHtml } from "./content";
import type howItWorksPage from "../messages/en/pages/howItWorks.json";

export const HOW_IT_WORKS_SENTINEL_SLUG = "__how-it-works__";

type HowItWorksMessages = typeof howItWorksPage;

/**
 * Builds a {@link BlogPost}-shaped object for static marketing pages that reuse
 * blog article chrome (`ContentBanner`, `.post-body`) without a markdown file.
 */
export function buildHowItWorksSyntheticPost(
  page: HowItWorksMessages,
): BlogPost {
  const { banner, bodyMarkdown } = page;

  return {
    slug: HOW_IT_WORKS_SENTINEL_SLUG,
    frontmatter: {
      title: banner.title,
      description: banner.description,
      author: banner.author,
      date: banner.date,
    },
    content: bodyMarkdown,
    htmlContent: markdownToHtml(bodyMarkdown),
    filePath: "messages/en/pages/howItWorks.json",
    lastModified: new Date(banner.date),
  };
}
