import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getBlogPostBySlug,
  getAllBlogPosts as getAllPosts,
} from "../../../lib/content";
import ContentBanner from "../../components/ContentBanner";
import RelatedArticles from "../../components/RelatedArticles";
import AskOrganizer from "../../components/AskOrganizer";
import { getAssetPath, ASSETS } from "../../../lib/assetUtils";

// AskOrganizer data - same as index page
const askOrganizerData = {
  title: "Still have questions?",
  subtitle: "Get answers from an experienced organizer",
  buttonText: "Ask an organizer",
  buttonHref: "#contact",
};

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
        url: `https://communityrule.com/blog/${slug}`,
        siteName: "CommunityRule",
      },
      twitter: {
        card: "summary_large_image",
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        creator: "@communityrule",
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

  // Get related articles with improved algorithm
  const allPosts = getAllPosts();

  // Simple related articles algorithm based on content similarity
  const getRelatedArticles = (currentPost, allPosts, limit = 3) => {
    const otherPosts = allPosts.filter((p) => p.slug !== currentPost.slug);

    // Score posts based on content similarity
    const scoredPosts = otherPosts.map((post) => {
      let score = 0;

      // Check for similar keywords in title and description
      const currentTitle = currentPost.frontmatter.title.toLowerCase();
      const currentDesc = currentPost.frontmatter.description.toLowerCase();
      const postTitle = post.frontmatter.title.toLowerCase();
      const postDesc = post.frontmatter.description.toLowerCase();

      // Common keywords that indicate similarity
      const keywords = [
        "community",
        "conflict",
        "decision",
        "governance",
        "security",
        "trust",
        "collaboration",
        "organization",
      ];

      keywords.forEach((keyword) => {
        if (currentTitle.includes(keyword) && postTitle.includes(keyword))
          score += 3;
        if (currentDesc.includes(keyword) && postDesc.includes(keyword))
          score += 2;
        if (currentTitle.includes(keyword) && postDesc.includes(keyword))
          score += 1;
        if (currentDesc.includes(keyword) && postTitle.includes(keyword))
          score += 1;
      });

      return { ...post, score };
    });

    // Sort by score and return top posts
    return scoredPosts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ score, ...post }) => post); // Remove score from final result
  };

  const relatedArticles = getRelatedArticles(post, allPosts);

  // Generate structured data for search engines
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    author: {
      "@type": "Person",
      name: post.frontmatter.author,
    },
    publisher: {
      "@type": "Organization",
      name: "CommunityRule",
      url: "https://communityrule.com",
      logo: {
        "@type": "ImageObject",
        url: "https://communityrule.com/assets/Logo.svg",
      },
    },
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://communityrule.com/blog/${post.slug}`,
    },
    url: `https://communityrule.com/blog/${post.slug}`,
    articleSection: "Community Building",
    keywords: ["community", "governance", "decision making", "collaboration"],
  };

  // Breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://communityrule.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://communityrule.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.frontmatter.title,
        item: `https://communityrule.com/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />

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

        {/* Ask Organizer Section */}
        <AskOrganizer {...askOrganizerData} variant="inverse" />
      </div>
    </>
  );
}
