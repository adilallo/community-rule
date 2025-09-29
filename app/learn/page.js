import ContentThumbnailTemplate from "../components/ContentThumbnailTemplate";
import ContentLockup from "../components/ContentLockup";
import { getAllBlogPosts, getRecentBlogPosts } from "../../lib/content";

export default function LearnPage() {
  // Get real blog posts from the content system
  const allPosts = getAllBlogPosts();
  const recentPosts = getRecentBlogPosts(3);

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* More Articles */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--color-content-inverse-primary)] mb-6">
              More Articles
            </h2>
            <div className="space-y-4">
              {allPosts.slice(0, 3).map((post, index) => (
                <ContentThumbnailTemplate
                  key={post.slug}
                  post={post}
                  variant="horizontal"
                />
              ))}
            </div>
          </section>

          {/* Coming Soon */}
          <section className="bg-[var(--color-surface-default-secondary)] p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-[var(--color-content-inverse-primary)] mb-4">
              More Content Coming Soon
            </h2>
            <p className="text-[var(--color-content-inverse-secondary)]">
              We&apos;re working on adding more educational content to help you
              build better communities. Check back soon for new articles and
              resources.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
