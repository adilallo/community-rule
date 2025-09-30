import { describe, it, expect } from "vitest";
import {
  validateBlogPost,
  sanitizeBlogPost,
  BLOG_POST_SCHEMA,
} from "../../lib/validation.js";

describe("Blog Post Validation", () => {
  describe("validateBlogPost", () => {
    it("should validate a correct blog post", () => {
      const validPost = {
        title: "Test Title",
        description:
          "This is a test description that meets the minimum length requirement",
        author: "Test Author",
        date: "2025-04-15",
        related: ["post-1", "post-2"],
        thumbnail: {
          vertical: "test-vertical.svg",
          horizontal: "test-horizontal.svg",
        },
        banner: {
          horizontal: "test-banner.svg",
        },
        background: {
          color: "#F4F3F1",
        },
      };

      const result = validateBlogPost(validPost);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject missing required fields", () => {
      const invalidPost = {
        title: "Test Title",
        // Missing description, author, date
      };

      const result = validateBlogPost(invalidPost);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Missing required field: description");
      expect(result.errors).toContain("Missing required field: author");
      expect(result.errors).toContain("Missing required field: date");
    });

    it("should validate title length constraints", () => {
      const shortTitle = {
        title: "", // Empty string (less than 1 character minimum)
        description:
          "This is a test description that meets the minimum length requirement",
        author: "Test Author",
        date: "2025-04-15",
      };

      const result = validateBlogPost(shortTitle);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Missing required field: title");
    });

    it("should validate date format", () => {
      const invalidDate = {
        title: "Test Title",
        description:
          "This is a test description that meets the minimum length requirement",
        author: "Test Author",
        date: "2025/04/15", // Wrong format
      };

      const result = validateBlogPost(invalidDate);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Field date format is invalid");
    });
  });

  describe("sanitizeBlogPost", () => {
    it("should return original data when all fields are present", () => {
      const post = {
        title: "Test Title",
        description: "Test description",
        author: "Test Author",
        date: "2025-04-15",
        related: ["post-1"],
      };

      const sanitized = sanitizeBlogPost(post);
      expect(sanitized).toEqual(post);
    });

    it("should add default values for missing optional fields", () => {
      const post = {
        title: "Test Title",
        description: "Test description",
        author: "Test Author",
        date: "2025-04-15",
        // Missing related, thumbnail, banner, background
      };

      const sanitized = sanitizeBlogPost(post);
      expect(sanitized.related).toEqual([]);
      expect(sanitized.thumbnail).toBeNull();
      expect(sanitized.banner).toBeNull();
      expect(sanitized.background).toBeNull();
    });

    it("should preserve existing optional fields", () => {
      const post = {
        title: "Test Title",
        description: "Test description",
        author: "Test Author",
        date: "2025-04-15",
        related: ["custom-post"],
        thumbnail: {
          vertical: "custom-vertical.svg",
          horizontal: "custom-horizontal.svg",
        },
        banner: {
          horizontal: "custom-banner.svg",
        },
        background: {
          color: "#E2EFFF",
        },
      };

      const sanitized = sanitizeBlogPost(post);
      expect(sanitized.related).toEqual(["custom-post"]);
      expect(sanitized.thumbnail).toEqual({
        vertical: "custom-vertical.svg",
        horizontal: "custom-horizontal.svg",
      });
      expect(sanitized.banner).toEqual({
        horizontal: "custom-banner.svg",
      });
      expect(sanitized.background).toEqual({
        color: "#E2EFFF",
      });
    });
  });

  describe("BLOG_POST_SCHEMA", () => {
    it("should have correct structure", () => {
      expect(BLOG_POST_SCHEMA).toHaveProperty("title");
      expect(BLOG_POST_SCHEMA).toHaveProperty("description");
      expect(BLOG_POST_SCHEMA).toHaveProperty("author");
      expect(BLOG_POST_SCHEMA).toHaveProperty("date");
      expect(BLOG_POST_SCHEMA).toHaveProperty("related");
      expect(BLOG_POST_SCHEMA).toHaveProperty("thumbnail");
      expect(BLOG_POST_SCHEMA).toHaveProperty("banner");
      expect(BLOG_POST_SCHEMA).toHaveProperty("background");
    });

    it("should have correct required field configuration", () => {
      expect(BLOG_POST_SCHEMA.title.required).toBe(true);
      expect(BLOG_POST_SCHEMA.description.required).toBe(true);
      expect(BLOG_POST_SCHEMA.author.required).toBe(true);
      expect(BLOG_POST_SCHEMA.date.required).toBe(true);
      expect(BLOG_POST_SCHEMA.related.required).toBe(false);
      expect(BLOG_POST_SCHEMA.thumbnail.required).toBe(false);
      expect(BLOG_POST_SCHEMA.banner.required).toBe(false);
      expect(BLOG_POST_SCHEMA.background.required).toBe(false);
    });
  });
});
