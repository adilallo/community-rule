import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { validateBlogPost, sanitizeBlogPost } from "./validation.js";

/**
 * Content processing utilities for blog posts
 */

/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-friendly slug
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();
}

/**
 * Get all blog post files from the content directory
 * @returns {Array} Array of file paths
 */
export function markdownToHtml(markdown) {
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

export function getBlogPostFiles() {
  const contentDirectory = path.join(process.cwd(), "content/blog");

  try {
    const files = fs.readdirSync(contentDirectory);
    return files.filter(
      (file) => file.endsWith(".md") || file.endsWith(".mdx"),
    );
  } catch (error) {
    console.error("Error reading blog content directory:", error);
    return [];
  }
}

/**
 * Parse a single blog post file
 * @param {string} filePath - Path to the markdown file
 * @returns {Object|null} Parsed blog post data or null if invalid
 */
export function parseBlogPost(filePath) {
  const fullPath = path.join(process.cwd(), "content/blog", filePath);

  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const validationResult = validateBlogPost(data);
    if (!validationResult.isValid) {
      console.error(
        `Validation errors for ${filePath}:`,
        validationResult.errors,
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
 * @returns {Array} Array of parsed blog post objects
 */
export function getAllBlogPosts() {
  const fileNames = getBlogPostFiles();
  const allPosts = fileNames
    .map((fileName) => parseBlogPost(fileName))
    .filter(Boolean) // Filter out nulls (invalid posts)
    .sort(
      (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date),
    ); // Sort by date descending
  return allPosts;
}

/**
 * Get a single blog post by its slug
 * @param {string} slug - The slug of the blog post
 * @returns {Object|null} The parsed blog post data or null if not found
 */
export function getBlogPostBySlug(slug) {
  const allPosts = getAllBlogPosts();
  return allPosts.find((post) => post.slug === slug) || null;
}

/**
 * Get related blog posts based on provided slugs or fallback to recent posts.
 * @param {string} currentPostSlug - The slug of the current post to exclude.
 * @param {string[]} relatedSlugs - Array of slugs for explicitly related posts.
 * @param {number} limit - Maximum number of related posts to return.
 * @returns {Array} Array of related blog post objects.
 */
export function getRelatedBlogPosts(
  currentPostSlug,
  relatedSlugs = [],
  limit = 3,
) {
  const allPosts = getAllBlogPosts();
  const filteredPosts = allPosts.filter(
    (post) => post.slug !== currentPostSlug,
  );

  let related = [];
  if (relatedSlugs && relatedSlugs.length > 0) {
    related = relatedSlugs
      .map((slug) => filteredPosts.find((post) => post.slug === slug))
      .filter(Boolean); // Filter out any related slugs that don't exist
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
 * @returns {string[]} Array of unique tags.
 */
export function getAllTags() {
  const allPosts = getAllBlogPosts();
  const tags = new Set();
  allPosts.forEach((post) => {
    if (post.frontmatter.tags) {
      post.frontmatter.tags.forEach((tag) => tags.add(tag));
    }
  });
  return Array.from(tags);
}

/**
 * Get blog posts filtered by a specific tag.
 * @param {string} tag - The tag to filter by.
 * @returns {Object[]} Array of blog post objects matching the tag.
 */
export function getBlogPostsByTag(tag) {
  const allPosts = getAllBlogPosts();
  return allPosts.filter(
    (post) => post.frontmatter.tags && post.frontmatter.tags.includes(tag),
  );
}

/**
 * Search blog posts by text content
 * @param {string} query - Search query
 * @param {number} limit - Maximum number of results
 * @returns {Object[]} Array of matching blog post objects
 */
export function searchBlogPosts(query, limit = 10) {
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
      tag.toLowerCase().includes(searchTerm),
    );

    return titleMatch || descriptionMatch || contentMatch || tagMatch;
  });

  return results.slice(0, limit);
}

/**
 * Get blog posts by author
 * @param {string} author - Author name to filter by
 * @returns {Object[]} Array of blog post objects by the author
 */
export function getBlogPostsByAuthor(author) {
  const allPosts = getAllBlogPosts();
  return allPosts.filter(
    (post) => post.frontmatter.author.toLowerCase() === author.toLowerCase(),
  );
}

/**
 * Get recent blog posts
 * @param {number} limit - Maximum number of posts to return
 * @returns {Object[]} Array of recent blog post objects
 */
export function getRecentBlogPosts(limit = 5) {
  const allPosts = getAllBlogPosts();
  return allPosts.slice(0, limit);
}

/**
 * Get blog post statistics
 * @returns {Object} Statistics about blog posts
 */
export function getBlogStats() {
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
                (new Date(allPosts[0].frontmatter.date) -
                  new Date(allPosts[allPosts.length - 1].frontmatter.date)) /
                  (1000 * 60 * 60 * 24 * 30),
              )) *
              10,
          ) / 10
        : 0,
  };
}
