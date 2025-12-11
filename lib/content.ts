import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  validateBlogPost,
  sanitizeBlogPost,
  type BlogPostFrontmatter,
} from "./validation";

/**
 * Content processing utilities for blog posts
 */

export interface BlogPost {
  slug: string;
  frontmatter: BlogPostFrontmatter;
  content: string;
  htmlContent: string;
  filePath: string;
  lastModified: Date;
}

/**
 * Generate a URL-friendly slug from a string
 * @param text - Text to convert to slug
 * @returns URL-friendly slug
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();
}

/**
 * Get all blog post files from the content directory
 * @returns Array of file paths
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return "";

  return (
    markdown
      // Headers
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Lists
      .replace(/^\* (.*$)/gim, "<li>$1</li>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/gim, "<ul>$1</ul>")
      // Paragraphs
      .replace(/\n\n/g, "</p><p>")
      .replace(/^(?!<[h|u|li])(.*$)/gim, "<p>$1</p>")
      // Clean up empty paragraphs
      .replace(/<p><\/p>/g, "")
      .replace(/<p>(.*?)<\/p>/g, (match, content) => {
        return content.trim() ? match : "";
      })
  );
}

export function getBlogPostFiles(): string[] {
  const contentDirectory = path.join(process.cwd(), "content/blog");

  try {
    const files = fs.readdirSync(contentDirectory);
    return files.filter(
      (file) => file.endsWith(".md") || file.endsWith(".mdx")
    );
  } catch (error) {
    console.error("Error reading blog content directory:", error);
    return [];
  }
}

/**
 * Parse a single blog post file
 * @param filePath - Path to the markdown file
 * @returns Parsed blog post data or null if invalid
 */
export function parseBlogPost(filePath: string): BlogPost | null {
  const fullPath = path.join(process.cwd(), "content/blog", filePath);

  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const validationResult = validateBlogPost(data);
    if (!validationResult.isValid) {
      console.error(
        `Validation errors for ${filePath}:`,
        validationResult.errors
      );
      return null;
    }

    const sanitizedFrontmatter = sanitizeBlogPost(data);
    const slug = generateSlug(filePath.replace(/\.mdx?$/, ""));

    return {
      slug,
      frontmatter: sanitizedFrontmatter,
      content,
      htmlContent: markdownToHtml(content),
      filePath,
      lastModified: fs.statSync(fullPath).mtime,
    };
  } catch (error) {
    console.error(`Error parsing blog post file ${filePath}:`, error);
    return null;
  }
}

/**
 * Get all blog posts, sorted by date
 * @returns Array of parsed blog post objects
 */
export function getAllBlogPosts(): BlogPost[] {
  const fileNames = getBlogPostFiles();
  const allPosts = fileNames
    .map((fileName) => parseBlogPost(fileName))
    .filter((post): post is BlogPost => post !== null) // Filter out nulls (invalid posts)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    ); // Sort by date descending
  return allPosts;
}

/**
 * Get a single blog post by its slug
 * @param slug - The slug of the blog post
 * @returns The parsed blog post data or null if not found
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  const allPosts = getAllBlogPosts();
  return allPosts.find((post) => post.slug === slug) || null;
}

/**
 * Get related blog posts based on provided slugs or fallback to recent posts.
 * @param currentPostSlug - The slug of the current post to exclude.
 * @param relatedSlugs - Array of slugs for explicitly related posts.
 * @param limit - Maximum number of related posts to return.
 * @returns Array of related blog post objects.
 */
export function getRelatedBlogPosts(
  currentPostSlug: string,
  relatedSlugs: string[] = [],
  limit: number = 3
): BlogPost[] {
  const allPosts = getAllBlogPosts();
  const filteredPosts = allPosts.filter(
    (post) => post.slug !== currentPostSlug
  );

  let related: BlogPost[] = [];
  if (relatedSlugs && relatedSlugs.length > 0) {
    related = relatedSlugs
      .map((slug) => filteredPosts.find((post) => post.slug === slug))
      .filter((post): post is BlogPost => post !== undefined); // Filter out any related slugs that don't exist
  }

  // If not enough related posts, or no related slugs provided, fill with recent posts
  if (related.length < limit) {
    const remainingSlots = limit - related.length;
    const existingRelatedSlugs = new Set(related.map((p) => p.slug));
    const recentPosts = filteredPosts
      .filter((post) => !existingRelatedSlugs.has(post.slug))
      .slice(0, remainingSlots);
    related = [...related, ...recentPosts];
  }

  return related.slice(0, limit);
}

/**
 * Get all unique tags from all blog posts.
 * @returns Array of unique tags.
 */
export function getAllTags(): string[] {
  const allPosts = getAllBlogPosts();
  const tags = new Set<string>();
  allPosts.forEach((post) => {
    if (post.frontmatter.tags) {
      post.frontmatter.tags.forEach((tag) => tags.add(tag));
    }
  });
  return Array.from(tags);
}

/**
 * Get blog posts filtered by a specific tag.
 * @param tag - The tag to filter by.
 * @returns Array of blog post objects matching the tag.
 */
export function getBlogPostsByTag(tag: string): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter(
    (post) => post.frontmatter.tags && post.frontmatter.tags.includes(tag)
  );
}

/**
 * Search blog posts by text content
 * @param query - Search query
 * @param limit - Maximum number of results
 * @returns Array of matching blog post objects
 */
export function searchBlogPosts(query: string, limit: number = 10): BlogPost[] {
  if (!query || query.trim() === "") return [];

  const searchTerm = query.toLowerCase().trim();
  const allPosts = getAllBlogPosts();

  const results = allPosts.filter((post) => {
    const titleMatch = post.frontmatter.title
      .toLowerCase()
      .includes(searchTerm);
    const descriptionMatch = post.frontmatter.description
      .toLowerCase()
      .includes(searchTerm);
    const contentMatch = post.content.toLowerCase().includes(searchTerm);
    const tagMatch = post.frontmatter.tags?.some((tag) =>
      tag.toLowerCase().includes(searchTerm)
    );

    return titleMatch || descriptionMatch || contentMatch || tagMatch;
  });

  return results.slice(0, limit);
}

/**
 * Get blog posts by author
 * @param author - Author name to filter by
 * @returns Array of blog post objects by the author
 */
export function getBlogPostsByAuthor(author: string): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter(
    (post) => post.frontmatter.author.toLowerCase() === author.toLowerCase()
  );
}

/**
 * Get recent blog posts
 * @param limit - Maximum number of posts to return
 * @returns Array of recent blog post objects
 */
export function getRecentBlogPosts(limit: number = 5): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.slice(0, limit);
}

export interface BlogStats {
  totalPosts: number;
  totalTags: number;
  totalAuthors: number;
  dateRange: {
    earliest: string | null;
    latest: string | null;
  };
  averagePostsPerMonth: number;
}

/**
 * Get blog post statistics
 * @returns Statistics about blog posts
 */
export function getBlogStats(): BlogStats {
  const allPosts = getAllBlogPosts();
  const tags = getAllTags();

  return {
    totalPosts: allPosts.length,
    totalTags: tags.length,
    totalAuthors: new Set(allPosts.map((post) => post.frontmatter.author)).size,
    dateRange: {
      earliest:
        allPosts.length > 0
          ? allPosts[allPosts.length - 1].frontmatter.date
          : null,
      latest: allPosts.length > 0 ? allPosts[0].frontmatter.date : null,
    },
    averagePostsPerMonth:
      allPosts.length > 0
        ? Math.round(
            (allPosts.length /
              Math.max(
                1,
                (new Date(allPosts[0].frontmatter.date).getTime() -
                  new Date(
                    allPosts[allPosts.length - 1].frontmatter.date
                  ).getTime()) /
                  (1000 * 60 * 60 * 24 * 30)
              )) *
              10
          ) / 10
        : 0,
  };
}
