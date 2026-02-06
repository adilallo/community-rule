import { getAllBlogPosts } from "../../lib/content";
import ContentThumbnailTemplate from "../components/content/ContentThumbnailTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - CommunityRule",
  description:
    "Learn about community governance, decision-making, and building successful organizations.",
  openGraph: {
    title: "Blog - CommunityRule",
    description:
      "Learn about community governance, decision-making, and building successful organizations.",
    url: "https://communityrule.com/blog",
    siteName: "CommunityRule",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - CommunityRule",
    description:
      "Learn about community governance, decision-making, and building successful organizations.",
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  // Create slug order for consistent icon cycling
  const slugOrder = posts.map((post) => post.slug);

  return (
    <div className="min-h-screen bg-[#F4F3F1]">
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-content-default-primary)] mb-4">
              Blog
            </h1>
            <p className="text-lg text-[var(--color-content-default-secondary)] max-w-2xl mx-auto">
              Learn about community governance, decision-making, and building
              successful organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <ContentThumbnailTemplate
                key={post.slug}
                post={post}
                slugOrder={slugOrder}
                variant={index % 2 === 0 ? "vertical" : "horizontal"}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
