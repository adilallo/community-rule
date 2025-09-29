import ContentThumbnailTemplate from "../components/ContentThumbnailTemplate";
import ContentLockup from "../components/ContentLockup";
import { getAllBlogPosts, getRecentBlogPosts } from "../../lib/content";

export default function LearnPage() {
  // Get real blog posts from the content system
  const allPosts = getAllBlogPosts();
  const recentPosts = getRecentBlogPosts(3);

  // Create slug order for consistent background cycling
  const slugOrder = allPosts.map((post) => post.slug);

  return (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)]">
      {/* Content Lockup Header */}
      <div className="pt-[var(--spacing-scale-016)] pb-[var(--spacing-scale-016)] px-[var(--spacing-scale-020)] gap-[var(--spacing-scale-016)]">
        <ContentLockup
          title="Organizing is hard"
          subtitle="Find answers to your questions and see how other groups have solved similar challenges."
          variant="learn"
          alignment="left"
        />
      </div>

      <div className="space-y-4">
        {allPosts.slice(0, 3).map((post, index) => (
          <ContentThumbnailTemplate
            key={post.slug}
            post={post}
            variant="horizontal"
            slugOrder={slugOrder}
          />
        ))}
      </div>
    </div>
  );
}
