/**
 * Comprehensive content processing system for blog posts
 */

import {
  processMarkdown,
  generateTableOfContents,
  processFrontmatter,
  formatDate,
} from "./mdx.js";
import { validateBlogPost, sanitizeBlogPost } from "./validation.js";
import {
  getCachedBlogPost,
  cacheBlogPost,
  getCachedBlogList,
  cacheBlogList,
  getCachedTags,
  cacheTags,
  warmCache,
} from "./cache.js";
import fs from "fs";
import path from "path";

/**
 * Main content processor class
 */
class ContentProcessor {
  constructor() {
    this.contentDirectory = path.join(process.cwd(), "content/blog");
    this.processedPosts = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialize the content processor
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Warm up cache
      await warmCache(
        () => this.getAllPosts(),
        () => this.getAllTags()
      );

      this.isInitialized = true;
      console.log("Content processor initialized successfully");
    } catch (error) {
      console.error("Failed to initialize content processor:", error);
      throw error;
    }
  }

  /**
   * Get all blog post files
   * @returns {Array} Array of file paths
   */
  getBlogPostFiles() {
    try {
      const files = fs.readdirSync(this.contentDirectory);
      return files.filter(
        (file) => file.endsWith(".md") || file.endsWith(".mdx")
      );
    } catch (error) {
      console.error("Error reading blog content directory:", error);
      return [];
    }
  }

  /**
   * Process a single blog post file
   * @param {string} filePath - Path to the markdown file
   * @returns {Object|null} Processed blog post data or null if invalid
   */
  processBlogPost(filePath) {
    const fullPath = path.join(this.contentDirectory, filePath);

    try {
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = require("gray-matter")(fileContents);

      // Validate frontmatter
      const validationResult = validateBlogPost(data);
      if (!validationResult.isValid) {
        console.error(
          `Validation errors for ${filePath}:`,
          validationResult.errors
        );
        return null;
      }

      // Sanitize frontmatter
      const sanitizedFrontmatter = sanitizeBlogPost(data);

      // Process markdown content
      const processedContent = processMarkdown(content);

      // Generate slug
      const slug = this.generateSlug(filePath.replace(/\.mdx?$/, ""));

      // Get file stats
      const stats = fs.statSync(fullPath);

      // Create processed post object
      const processedPost = {
        slug,
        frontmatter: processFrontmatter(sanitizedFrontmatter),
        content: processedContent.content,
        htmlContent: processedContent.htmlContent,
        headings: processedContent.headings,
        links: processedContent.links,
        images: processedContent.images,
        tableOfContents: generateTableOfContents(processedContent.headings),
        filePath,
        lastModified: stats.mtime,
        fileSize: stats.size,
        metadata: {
          processedAt: new Date(),
          processorVersion: "1.0.0",
        },
      };

      // Cache the processed post
      cacheBlogPost(slug, processedPost);

      return processedPost;
    } catch (error) {
      console.error(`Error processing blog post file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Get all blog posts with caching
   * @returns {Array} Array of processed blog post objects
   */
  getAllPosts() {
    // Check cache first
    const cached = getCachedBlogList("all");
    if (cached) return cached;

    const fileNames = this.getBlogPostFiles();
    const allPosts = fileNames
      .map((fileName) => this.processBlogPost(fileName))
      .filter(Boolean)
      .sort(
        (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
      );

    // Cache the result
    cacheBlogList("all", allPosts);

    return allPosts;
  }

  /**
   * Get a single blog post by slug with caching
   * @param {string} slug - The slug of the blog post
   * @returns {Object|null} The processed blog post data or null if not found
   */
  getBlogPostBySlug(slug) {
    // Check cache first
    const cached = getCachedBlogPost(slug);
    if (cached) return cached;

    // If not in cache, find and process the post
    const allPosts = this.getAllPosts();
    const post = allPosts.find((post) => post.slug === slug);

    if (post) {
      cacheBlogPost(slug, post);
      return post;
    }

    return null;
  }

  /**
   * Get recent blog posts
   * @param {number} limit - Maximum number of posts to return
   * @returns {Array} Array of recent blog post objects
   */
  getRecentPosts(limit = 5) {
    const cacheKey = `recent:${limit}`;
    const cached = getCachedBlogList(cacheKey);
    if (cached) return cached;

    const allPosts = this.getAllPosts();
    const recentPosts = allPosts.slice(0, limit);

    cacheBlogList(cacheKey, recentPosts);
    return recentPosts;
  }

  /**
   * Search blog posts
   * @param {string} query - Search query
   * @param {number} limit - Maximum number of results
   * @returns {Array} Array of matching blog post objects
   */
  searchPosts(query, limit = 10) {
    if (!query || query.trim() === "") return [];

    const searchTerm = query.toLowerCase().trim();
    const allPosts = this.getAllPosts();

    const results = allPosts.filter((post) => {
      const titleMatch = post.frontmatter.title
        .toLowerCase()
        .includes(searchTerm);
      const descriptionMatch = post.frontmatter.description
        .toLowerCase()
        .includes(searchTerm);
      const contentMatch = post.content.toLowerCase().includes(searchTerm);

      return titleMatch || descriptionMatch || contentMatch;
    });

    return results.slice(0, limit);
  }

  /**
   * Get blog statistics
   * @returns {Object} Statistics about blog posts
   */
  getBlogStats() {
    const allPosts = this.getAllPosts();

    return {
      totalPosts: allPosts.length,
      totalAuthors: new Set(
        allPosts.map((post) => post.frontmatter.author).size
      ),
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
                    (1000 * 60 * 60 * 24 * 30)
                )) *
                10
            ) / 10
          : 0,
    };
  }

  /**
   * Generate a URL-friendly slug from a string
   * @param {string} text - Text to convert to slug
   * @returns {string} URL-friendly slug
   */
  generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  /**
   * Refresh content (reprocess all posts)
   * @returns {Array} Array of reprocessed blog post objects
   */
  refreshContent() {
    console.log("Refreshing content...");

    // Clear processed posts cache
    this.processedPosts.clear();

    // Reprocess all posts
    const allPosts = this.getAllPosts();

    console.log(`Refreshed ${allPosts.length} blog posts`);
    return allPosts;
  }

  /**
   * Get content processing status
   * @returns {Object} Status information
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      totalFiles: this.getBlogPostFiles().length,
      processedPosts: this.processedPosts.size,
      contentDirectory: this.contentDirectory,
      lastRefresh: new Date().toISOString(),
    };
  }
}

// Create and export singleton instance
const contentProcessor = new ContentProcessor();

// Export the instance and convenience functions
export { contentProcessor };

// Export convenience functions bound to the instance
export const getAllPosts = () => contentProcessor.getAllPosts();
export const getBlogPostBySlug = (slug) =>
  contentProcessor.getBlogPostBySlug(slug);
export const getRecentPosts = (limit) => contentProcessor.getRecentPosts(limit);
export const searchPosts = (query, limit) =>
  contentProcessor.searchPosts(query, limit);
export const getBlogStats = () => contentProcessor.getBlogStats();
export const refreshContent = () => contentProcessor.refreshContent();
export const getStatus = () => contentProcessor.getStatus();
export const initialize = () => contentProcessor.initialize();
