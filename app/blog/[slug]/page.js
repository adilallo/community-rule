import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug, getAllPosts } from "../../../lib/contentProcessor";
import ContentBanner from "../../components/ContentBanner";
import RelatedArticles from "../../components/RelatedArticles";
import { getAssetPath, ASSETS } from "../../../lib/assetUtils";

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
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);

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
export default async function BlogPostPage({ params }) {
  // Get the blog post data
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  // If post doesn't exist, show 404
  if (!post) {
    notFound();
  }

  // Get related articles (for now, just get other posts)
  const allPosts = getAllPosts();
  const relatedArticles = allPosts; // Pass all posts to RelatedArticles component for filtering

  return (
    <div className="min-h-screen bg-[#F4F3F1] relative overflow-hidden">
      {/* Content Banner */}
      <ContentBanner post={post} />

      {/* Decorative Shapes */}
      {/* Right Side Shape (3/4 up the page) */}
      <div
        className="hidden md:block absolute top-1/4 right-0 pointer-events-none z-10"
        style={{ transform: "translateX(40%)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getAssetPath(ASSETS.CONTENT_SHAPE_1)}
          alt=""
          className="w-auto h-auto max-w-none"
          style={{
            width: "clamp(120px, 15vw, 200px)",
            height: "auto",
          }}
        />
      </div>

      {/* Left Side Shape (3/4 down the page) */}
      <div
        className="hidden md:block absolute top-1/2 left-0 pointer-events-none z-10"
        style={{ transform: "translateX(-10%)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getAssetPath(ASSETS.CONTENT_SHAPE_2)}
          alt=""
          className="w-auto h-auto max-w-none"
          style={{
            width: "clamp(100px, 12vw, 180px)",
            height: "auto",
          }}
        />
      </div>

      {/* Main Content */}
      <article className="p-[var(--spacing-scale-024)] sm:py-[var(--spacing-scale-032)]">
        {/* Article Content */}
        <div className="post-body -mt-[var(--spacing-scale-048)] text-[var(--color-content-inverse-primary)] text-[16px] leading-[24px] sm:text-[18px] sm:leading-[130%] lg:text-[24px] lg:leading-[32px] xl:text-[32px] xl:leading-[40px] sm:mx-auto sm:max-w-[390px] md:max-w-[472px] lg:max-w-[700px] xl:max-w-[904px]">
          <div dangerouslySetInnerHTML={{ __html: post.htmlContent }} />
        </div>
      </article>

      {/* Related Articles Section */}
      <RelatedArticles
        relatedPosts={relatedArticles}
        currentPostSlug={post.slug}
      />
    </div>
  );
}
