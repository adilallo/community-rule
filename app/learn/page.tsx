import ContentThumbnailTemplate from "../components/ContentThumbnailTemplate";
import ContentLockup from "../components/ContentLockup";
import AskOrganizer from "../components/AskOrganizer";
import { getAllBlogPosts } from "../../lib/content";

export default function LearnPage() {
  // Get real blog posts from the content system
  const allPosts = getAllBlogPosts();

  const contentLockupData = {
    title: "Organizing is hard",
    subtitle:
      "Find answers to your questions and see how other groups have solved similar challenges.",
    variant: "learn" as const,
    alignment: "left" as const,
  };

  const askOrganizerData = {
    title: "Still have questions?",
    subtitle: "Get answers from an experienced organizer",
    description:
      "Our community of organizers is here to help you navigate the challenges of building and maintaining effective community organizations.",
    buttonText: "Ask an organizer",
    buttonHref: "/contact",
    variant: "centered" as const,
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)]">
      <ContentLockup {...contentLockupData} />

      {/* Horizontal list (below smd) */}
      <div className="smd:hidden sm:pt-[var(--spacing-scale-024)] sm:pb-[var(--spacing-scale-024)] sm:px-[var(--spacing-scale-020)] space-y-[var(--spacing-scale-002)] sm:space-y-[var(--spacing-scale-008)]">
        {allPosts.slice(0, 3).map((post, index) => (
          <ContentThumbnailTemplate
            key={`${post.slug}-${index}-${
              post.frontmatter.thumbnail?.horizontal || "default"
            }`}
            post={post}
            variant="horizontal"
          />
        ))}
      </div>

      {/* smd and up: 2x3 grid of vertical thumbnails, repeat posts as needed */}
      <div className="hidden smd:grid smd:grid-cols-2 xmd:grid-cols-3 lg:grid-cols-3 lg2:grid-cols-4 xl:grid-cols-5 smd:gap-[var(--spacing-scale-008)] md:gap-[var(--spacing-scale-016)] xmd:gap-[var(--spacing-scale-012)] lg:gap-[var(--spacing-scale-016)] lg2:gap-x-[var(--spacing-scale-016)] lg2:gap-y-[var(--spacing-scale-024)] xl:gap-x-[var(--spacing-scale-016)] xl:gap-y-[var(--spacing-scale-016)] smd:pt-[var(--spacing-scale-024)] smd:pb-[var(--spacing-scale-024)] smd:px-[var(--spacing-scale-020)] md:px-[var(--spacing-scale-032)] lg:pt-[var(--spacing-scale-032)] lg:pb-[var(--spacing-scale-064)] lg:px-[var(--spacing-scale-064)]">
        {Array.from({ length: 16 }).map((_, i) => {
          const post = allPosts[i % allPosts.length];
          return (
            <ContentThumbnailTemplate
              key={`grid-${post.slug}-${i}-${
                post.frontmatter.thumbnail?.vertical || "default"
              }`}
              post={post}
              variant="vertical"
              className={`${i >= 6 ? "hidden lg2:block" : ""} ${
                i >= 10 ? "xl:hidden" : ""
              }`}
            />
          );
        })}
      </div>

      <AskOrganizer {...askOrganizerData} />
    </div>
  );
}
