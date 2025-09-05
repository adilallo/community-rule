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

export default function TestThumbnailPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          ContentThumbnailTemplate Test
        </h1>

        <div className="space-y-12">
          {/* Vertical Variant */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Vertical Variant
            </h2>
            <div className="flex flex-wrap gap-6">
              <ContentThumbnailTemplate post={mockPost1} className="mb-4" />
              <ContentThumbnailTemplate post={mockPost2} className="mb-4" />
              <ContentThumbnailTemplate post={mockPost3} className="mb-4" />
            </div>
          </section>

          {/* Horizontal Variant */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Horizontal Variant
            </h2>
            <div className="space-y-4">
              <ContentThumbnailTemplate post={mockPost1} variant="horizontal" />
              <ContentThumbnailTemplate post={mockPost2} variant="horizontal" />
              <ContentThumbnailTemplate post={mockPost3} variant="horizontal" />
            </div>
          </section>

          {/* Component Props */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Component Props
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  Required Props:
                </h3>
                <ul className="space-y-1 text-gray-600">
                  <li>
                    <code>post</code> - Blog post object with frontmatter
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  Optional Props:
                </h3>
                <ul className="space-y-1 text-gray-600">
                  <li>
                    <code>className</code> - Additional CSS classes
                  </li>
                  <li>
                    <code>variant</code> - "vertical" (default) or "horizontal"
                    (for development/testing)
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Mock Data */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Mock Data Structure
            </h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(mockPost1, null, 2)}
            </pre>
          </section>
        </div>
      </div>
    </div>
  );
}
