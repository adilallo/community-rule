import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug, getAllPosts } from "../../../lib/contentProcessor";
import ContentThumbnailTemplate from "../../components/ContentThumbnailTemplate";

/**
 * Generate static params for all blog posts
 * This enables static generation for all blog posts at build time
 */
export async function generateStaticParams() {
  try {
    const posts = getAllPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

/**
 * Generate metadata for each blog post
 */
export async function generateMetadata({ params }) {
  try {
    const post = getBlogPostBySlug(params.slug);

    if (!post) {
      return {
        title: "Post Not Found",
        description: "The requested blog post could not be found.",
      };
    }

    return {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      authors: [{ name: post.frontmatter.author }],
      openGraph: {
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        type: "article",
        publishedTime: post.frontmatter.date,
        authors: [post.frontmatter.author],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog Post",
      description: "A blog post from our community.",
    };
  }
}

/**
 * Dynamic blog post page
 */
export default function BlogPostPage({ params }) {
  // Get the blog post data
  const post = getBlogPostBySlug(params.slug);

  // If post doesn't exist, show 404
  if (!post) {
    notFound();
  }

  // Get related posts (for now, just get other posts)
  const allPosts = getAllPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3); // Show up to 3 related posts

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.frontmatter.title}
          </h1>

          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <span className="font-medium">{post.frontmatter.author}</span>
            <span>•</span>
            <time dateTime={post.frontmatter.date}>
              {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>

          <p className="text-xl text-gray-700 leading-relaxed">
            {post.frontmatter.description}
          </p>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: post.htmlContent }}
            className="text-gray-800 leading-relaxed"
          />
        </div>
      </article>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="bg-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Related Articles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <ContentThumbnailTemplate
                  key={relatedPost.slug}
                  post={relatedPost}
                  variant="vertical"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
