import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs";
import path from "path";

// Mock fs and path modules
vi.mock("fs");
vi.mock("path");
vi.mock("../../lib/logger", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Import the content processing functions
import { getBlogPostFiles, markdownToHtml } from "../../lib/content";
import { logger } from "../../lib/logger";

describe("Content Processing Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("File System Integration", () => {
    it("should read blog post files from content directory", () => {
      const mockFiles = ["post1.md", "post2.md", "image.png", "post3.md"];
      fs.readdirSync.mockReturnValue(mockFiles);

      const result = getBlogPostFiles();

      expect(fs.readdirSync).toHaveBeenCalledWith(
        path.join(process.cwd(), "content/blog"),
      );
      expect(result).toEqual(["post1.md", "post2.md", "post3.md"]);
    });

    it("should handle directory read errors gracefully", () => {
      fs.readdirSync.mockImplementation(() => {
        throw new Error("Directory not found");
      });

      const result = getBlogPostFiles();

      expect(result).toEqual([]);
      // Verify we log the error without polluting test output
      expect(logger.error).toHaveBeenCalled();
    });

    it("should filter out non-markdown files", () => {
      const mockFiles = [
        "post1.md",
        "post2.mdx",
        "image.png",
        "post3.md",
        "readme.txt",
      ];
      fs.readdirSync.mockReturnValue(mockFiles);

      const result = getBlogPostFiles();

      expect(result).toEqual(["post1.md", "post2.mdx", "post3.md"]);
    });
  });

  describe("Markdown to HTML Integration", () => {
    it("should convert markdown to HTML with proper formatting", () => {
      const markdown = `# Main Title

## Subtitle

This is a paragraph with **bold** and *italic* text.

- List item 1
- List item 2

[Link text](https://example.com)`;

      const result = markdownToHtml(markdown);

      expect(result).toContain("<h1>Main Title</h1>");
      expect(result).toContain("<h2>Subtitle</h2>");
      expect(result).toContain("<strong>bold</strong>");
      expect(result).toContain("<em>italic</em>");
      expect(result).toContain('<a href="https://example.com">Link text</a>');
    });

    it("should handle empty markdown gracefully", () => {
      const result = markdownToHtml("");

      expect(result).toBe("");
    });

    it("should handle markdown with special characters", () => {
      const markdown = `# Title with Special Characters: & < > " '

Content with **bold** and *italic* text.`;

      const result = markdownToHtml(markdown);

      expect(result).toContain(
        "<h1>Title with Special Characters: & < > \" '</h1>",
      );
      expect(result).toContain("<strong>bold</strong>");
      expect(result).toContain("<em>italic</em>");
    });
  });
});
