import { describe, it, expect, beforeAll } from "vitest";
import {
  contentProcessor,
  getAllPosts,
  getBlogStats,
} from "../../lib/contentProcessor.js";

describe("Content Processor", () => {
  beforeAll(async () => {
    await contentProcessor.initialize();
  });

  describe("Basic Functionality", () => {
    it("should initialize successfully", () => {
      expect(contentProcessor.isInitialized).toBe(true);
    });

    it("should process blog posts", () => {
      const posts = getAllPosts();
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBeGreaterThan(0);
    });

    it("should extract blog statistics", () => {
      const stats = getBlogStats();
      expect(stats.totalPosts).toBeGreaterThan(0);
    });
  });

  describe("Post Processing", () => {
    it("should process markdown content correctly", () => {
      const posts = getAllPosts();
      const firstPost = posts[0];

      expect(firstPost).toHaveProperty("frontmatter");
      expect(firstPost).toHaveProperty("content");
      expect(firstPost).toHaveProperty("htmlContent");
      expect(firstPost).toHaveProperty("headings");
      expect(firstPost).toHaveProperty("tableOfContents");
    });

    it("should generate proper slugs", () => {
      const posts = getAllPosts();
      const firstPost = posts[0];

      expect(firstPost.slug).toBeDefined();
      expect(typeof firstPost.slug).toBe("string");
      expect(firstPost.slug.length).toBeGreaterThan(0);
    });
  });

  describe("Content Enhancement", () => {
    it("should extract headings for table of contents", () => {
      const posts = getAllPosts();
      const firstPost = posts[0];

      expect(Array.isArray(firstPost.headings)).toBe(true);
      if (firstPost.headings.length > 0) {
        expect(firstPost.headings[0]).toHaveProperty("level");
        expect(firstPost.headings[0]).toHaveProperty("text");
        expect(firstPost.headings[0]).toHaveProperty("id");
      }
    });

    it("should generate HTML content", () => {
      const posts = getAllPosts();
      const firstPost = posts[0];

      expect(firstPost.htmlContent).toBeDefined();
      expect(typeof firstPost.htmlContent).toBe("string");
      expect(firstPost.htmlContent.length).toBeGreaterThan(0);
      expect(firstPost.htmlContent).toContain("<");
    });

    it("should generate table of contents", () => {
      const posts = getAllPosts();
      const firstPost = posts[0];

      expect(firstPost.tableOfContents).toBeDefined();
      expect(typeof firstPost.tableOfContents).toBe("string");
    });
  });
});
