import ContentThumbnailTemplate from "../components/ContentThumbnailTemplate";

// Mock blog post data for testing
const mockPost1 = {
  slug: "resolving-active-conflicts",
  frontmatter: {
    title: "Resolving Active Conflicts",
    description:
      "Practical steps for resolving conflicts while maintaining trust, cooperation, and shared goals",
    author: "Author name",
    date: "2025-04-15",
  },
};

const mockPost2 = {
  slug: "operational-security-mutual-aid",
  frontmatter: {
    title: "Operational Security for Mutual Aid",
    description:
      "Tactics to protect members, secure communication, and prevent Infiltration",
    author: "Author name",
    date: "2025-04-10",
  },
};

const mockPost3 = {
  slug: "making-decisions-without-hierarchy",
  frontmatter: {
    title: "Making decisions without hierarchy",
    description:
      "A brief guide to collaborative nonhierarchical decision making",
    author: "Author name",
    date: "2025-04-05",
  },
};

export default function LearnPage() {
  // Mock slug order for consistent background cycling
  const mockSlugOrder = [
    "resolving-active-conflicts",
    "operational-security-mutual-aid",
    "making-decisions-without-hierarchy",
  ];

  return (
    <div className="min-h-screen bg-[#F4F3F1]">
      <div className="max-w-6xl mx-auto p-8 pt-24">
        <h1 className="text-3xl font-bold text-[var(--color-content-default-primary)] mb-8">
          Learn
        </h1>

        <div className="space-y-12">
          {/* Featured Articles */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--color-content-default-primary)] mb-6">
              Featured Articles
            </h2>
            <div className="flex flex-wrap gap-6">
              <ContentThumbnailTemplate
                post={mockPost1}
                className="mb-4"
                slugOrder={mockSlugOrder}
              />
              <ContentThumbnailTemplate
                post={mockPost2}
                className="mb-4"
                slugOrder={mockSlugOrder}
              />
              <ContentThumbnailTemplate
                post={mockPost3}
                className="mb-4"
                slugOrder={mockSlugOrder}
              />
            </div>
          </section>

          {/* More Articles */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--color-content-default-primary)] mb-6">
              More Articles
            </h2>
            <div className="space-y-4">
              <ContentThumbnailTemplate
                post={mockPost1}
                variant="horizontal"
                slugOrder={mockSlugOrder}
              />
              <ContentThumbnailTemplate
                post={mockPost2}
                variant="horizontal"
                slugOrder={mockSlugOrder}
              />
              <ContentThumbnailTemplate
                post={mockPost3}
                variant="horizontal"
                slugOrder={mockSlugOrder}
              />
            </div>
          </section>

          {/* Coming Soon */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-[var(--color-content-default-primary)] mb-4">
              More Content Coming Soon
            </h2>
            <p className="text-[var(--color-content-default-secondary)]">
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
