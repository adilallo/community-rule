import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { validateBlogPost, sanitizeBlogPost } from "./validation.js";

/**
 * Content processing utilities for blog posts
 */

/**
 * Get all blog post files from the content directory
 * @returns {Array} Array of file paths
 */
export function getBlogPostFiles() {
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
 * @param {string} filePath - Path to the markdown file
 * @returns {Object|null} Parsed blog post data or null if invalid
 */
export function parseBlogPost(filePath) {
  try {
    const fullPath = path.join(process.cwd(), "content/blog", filePath);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data: frontmatter, content } = matter(fileContents);

    // Validate frontmatter
    const validation = validateBlogPost(frontmatter);
    if (!validation.isValid) {
      console.error(`Validation failed for ${filePath}:`, validation.errors);
      return null;
    }

    // Sanitize frontmatter
    const sanitized = sanitizeBlogPost(frontmatter);

    // Generate slug from filename
    const slug = filePath.replace(/\.(md|mdx)$/, "");

    return {
      slug,
      frontmatter: sanitized,
      content,
      filePath,
    };
  } catch (error) {
    console.error(`Error parsing blog post ${filePath}:`, error);
    return null;
  }
}

/**
 * Get all blog posts with parsed data
 * @returns {Array} Array of parsed blog post objects
 */
export function getAllBlogPosts() {
  const files = getBlogPostFiles();
  const posts = files
    .map((file) => parseBlogPost(file))
    .filter((post) => post !== null)
    .sort(
      (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
    );

  return posts;
}

/**
 * Get a single blog post by slug
 * @param {string} slug - The post slug
 * @returns {Object|null} Parsed blog post or null if not found
 */
export function getBlogPostBySlug(slug) {
  const files = getBlogPostFiles();
  const file = files.find((f) => f.replace(/\.(md|mdx)$/, "") === slug);

  if (!file) {
    return null;
  }

  return parseBlogPost(file);
}

/**
 * Get related blog posts
 * @param {string} currentSlug - Current post slug
 * @param {Array} relatedSlugs - Array of related post slugs
 * @param {number} limit - Maximum number of related posts to return
 * @returns {Array} Array of related blog posts
 */
export function getRelatedBlogPosts(currentSlug, relatedSlugs = [], limit = 3) {
  if (!relatedSlugs || relatedSlugs.length === 0) {
    // Fallback: get posts with similar tags or recent posts
    const allPosts = getAllBlogPosts();
    return allPosts.filter((post) => post.slug !== currentSlug).slice(0, limit);
  }

  const allPosts = getAllBlogPosts();
  const related = allPosts
    .filter((post) => relatedSlugs.includes(post.slug))
    .slice(0, limit);

  // If we don't have enough related posts, fill with recent ones
  if (related.length < limit) {
    const recent = allPosts
      .filter(
        (post) => post.slug !== currentSlug && !relatedSlugs.includes(post.slug)
      )
      .slice(0, limit - related.length);
    return [...related, ...recent];
  }

  return related;
}

/**
 * Get all unique tags from blog posts
 * @returns {Array} Array of unique tags
 */
export function getAllTags() {
  const posts = getAllBlogPosts();
  const tags = new Set();

  posts.forEach((post) => {
    if (post.frontmatter.tags) {
      post.frontmatter.tags.forEach((tag) => tags.add(tag));
    }
  });

  return Array.from(tags).sort();
}

/**
 * Get blog posts by tag
 * @param {string} tag - Tag to filter by
 * @returns {Array} Array of blog posts with the specified tag
 */
export function getBlogPostsByTag(tag) {
  const posts = getAllBlogPosts();
  return posts.filter(
    (post) => post.frontmatter.tags && post.frontmatter.tags.includes(tag)
  );
}
