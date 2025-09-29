import ContentThumbnailTemplate from "../components/ContentThumbnailTemplate";
import ContentLockup from "../components/ContentLockup";
import AskOrganizer from "../components/AskOrganizer";
import { getAllBlogPosts, getRecentBlogPosts } from "../../lib/content";

export default function LearnPage() {
  // Get real blog posts from the content system
  const allPosts = getAllBlogPosts();
  const recentPosts = getRecentBlogPosts(3);

  const contentLockupData = {
    title: "Organizing is hard",
    subtitle:
      "Find answers to your questions and see how other groups have solved similar challenges.",
    variant: "learn",
    alignment: "left",
  };

  const askOrganizerData = {
    title: "Still have questions?",
    subtitle: "Get answers from an experienced organizer",
    description:
      "Our community of organizers is here to help you navigate the challenges of building and maintaining effective community organizations.",
    buttonText: "Ask an organizer",
    buttonHref: "/contact",
    variant: "centered",
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)]">
      <ContentLockup {...contentLockupData} />

      <div className="pt-[var(--spacing-scale-024)] pb-[var(--spacing-scale-024)] px-[var(--spacing-scale-020)] space-y-[var(--spacing-scale-002)]">
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

      <AskOrganizer {...askOrganizerData} />
    </div>
  );
}
