import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getBlogPostFiles,
  parseBlogPost,
  getAllBlogPosts,
  getBlogPostBySlug,
  getRelatedBlogPosts,
  getAllTags,
  getBlogPostsByTag,
} from "../../lib/content.js";

// Mock fs and path modules
vi.mock("fs", () => ({
  readdirSync: vi.fn(),
  readFileSync: vi.fn(),
}));

vi.mock("path", () => ({
  join: vi.fn(),
}));

describe("Content Processing", () => {
  let mockReaddirSync, mockReadFileSync, mockPathJoin;

  beforeEach(() => {
    vi.clearAllMocks();

    // Get references to the mocked functions
    const fs = require("fs");
    const path = require("path");
    mockReaddirSync = fs.readdirSync;
    mockReadFileSync = fs.readFileSync;
    mockPathJoin = path.join;

    // Mock process.cwd to return a predictable path
    vi.spyOn(process, "cwd").mockReturnValue("/mock/project/root");

    // Mock path.join to return predictable paths
    mockPathJoin.mockImplementation((...args) => args.join("/"));
  });

  describe("getBlogPostFiles", () => {
    it("should return markdown files from content directory", () => {
      const mockFiles = ["post1.md", "post2.mdx", "image.png", "post3.md"];
      mockReaddirSync.mockReturnValue(mockFiles);

      const result = getBlogPostFiles();
      expect(result).toEqual(["post1.md", "post2.mdx", "post3.md"]);
      expect(mockReaddirSync).toHaveBeenCalledWith(
        "/mock/project/root/content/blog"
      );
    });

    it("should handle directory read errors gracefully", () => {
      mockReaddirSync.mockImplementation(() => {
        throw new Error("Directory not found");
      });

      const result = getBlogPostFiles();
      expect(result).toEqual([]);
      expect(mockReaddirSync).toHaveBeenCalledWith(
        "/mock/project/root/content/blog"
      );
    });
  });

  describe("parseBlogPost", () => {
    it("should parse a valid markdown file", () => {
      const mockContent = `---
title: "Test Post"
description: "A test description that meets the minimum length requirement"
author: "Test Author"
date: "2025-04-15"
tags: ["test"]
related: []
---
# Test Content
This is the content.`;

      mockReadFileSync.mockReturnValue(mockContent);

      const result = parseBlogPost("test-post.md");
      expect(result).toMatchObject({
        slug: "test-post",
        frontmatter: {
          title: "Test Post",
          description:
            "A test description that meets the minimum length requirement",
          author: "Test Author",
          date: "2025-04-15",
          tags: ["test"],
          related: [],
        },
        content: "\n# Test Content\nThis is the content.",
        filePath: "test-post.md",
      });
      expect(mockReadFileSync).toHaveBeenCalledWith(
        "/mock/project/root/content/blog/test-post.md",
        "utf8"
      );
    });

    it("should return null for invalid frontmatter", () => {
      const mockContent = `---
title: "" # Invalid title
description: "A test description"
author: "Test Author"
date: "2025-04-15"
---
# Test Content`;

      mockReadFileSync.mockReturnValue(mockContent);

      const result = parseBlogPost("invalid-post.md");
      expect(result).toBeNull();
    });

    it("should handle file read errors gracefully", () => {
      mockReadFileSync.mockImplementation(() => {
        throw new Error("File not found");
      });

      const result = parseBlogPost("non-existent-post.md");
      expect(result).toBeNull();
    });
  });

  describe("getAllBlogPosts", () => {
    it("should return all valid blog posts sorted by date", () => {
      const mockFiles = ["post1.md", "post2.md", "post3.md"];
      mockReaddirSync.mockReturnValue(mockFiles);

      // Mock fs.readFileSync for each post
      mockReadFileSync.mockReturnValueOnce(`---
title: "Post 1"
description: "Desc 1"
author: "Author 1"
date: "2025-04-10"
---
# Content 1`).mockReturnValueOnce(`---
title: "Post 2"
description: "Desc 2"
author: "Author 2"
date: "2025-04-20"
---
# Content 2`).mockReturnValueOnce(`---
title: "Post 3"
description: "Desc 3"
author: "Author 3"
date: "2025-04-05"
---
# Content 3`);

      const result = getAllBlogPosts();
      expect(result).toHaveLength(3);
      expect(result[0].slug).toBe("post2"); // Latest date
      expect(result[1].slug).toBe("post1");
      expect(result[2].slug).toBe("post3"); // Oldest date
    });
  });

  describe("getBlogPostBySlug", () => {
    it("should return blog post for valid slug", () => {
      const mockFiles = ["test-post.md"];
      mockReaddirSync.mockReturnValue(mockFiles);

      const mockContent = `---
title: "Test Post"
description: "A test description that meets the minimum length requirement"
author: "Test Author"
date: "2025-04-15"
---
# Test Content`;

      mockReadFileSync.mockReturnValue(mockContent);

      const result = getBlogPostBySlug("test-post");
      expect(result).not.toBeNull();
      expect(result.slug).toBe("test-post");
    });

    it("should return null for invalid slug", () => {
      const mockFiles = ["test-post.md"];
      mockReaddirSync.mockReturnValue(mockFiles);

      const result = getBlogPostBySlug("invalid-slug");
      expect(result).toBeNull();
    });
  });

  describe("getRelatedBlogPosts", () => {
    it("should return related posts when slugs are provided", () => {
      const mockFiles = ["post1.md", "post2.md", "post3.md"];
      mockReaddirSync.mockReturnValue(mockFiles);

      // Mock content for all posts
      mockReadFileSync.mockReturnValueOnce(`---
title: "Post 1"
description: "Desc 1"
author: "Author 1"
date: "2025-04-10"
related: ["post2"]
---
# Content 1`).mockReturnValueOnce(`---
title: "Post 2"
description: "Desc 2"
author: "Author 2"
date: "2025-04-20"
---
# Content 2`).mockReturnValueOnce(`---
title: "Post 3"
description: "Desc 3"
author: "Author 3"
date: "2025-04-05"
---
# Content 3`);

      const result = getRelatedBlogPosts("post1", ["post2", "post3"], 2);
      expect(result).toHaveLength(2);
      expect(result[0].slug).toBe("post2");
      expect(result[1].slug).toBe("post3");
    });

    it("should fallback to recent posts when no related slugs provided", () => {
      const mockFiles = ["post1.md", "post2.md", "post3.md"];
      mockReaddirSync.mockReturnValue(mockFiles);

      const mockContent = `---
title: "Post 1"
description: "Desc 1"
author: "Author 1"
date: "2025-04-10"
---
# Content 1`;

      mockReadFileSync.mockReturnValue(mockContent);

      const result = getRelatedBlogPosts("post1", [], 2);
      expect(result).toHaveLength(2);
      expect(result[0].slug).toBe("post2"); // Should be the most recent after excluding 'post1'
      expect(result[1].slug).toBe("post3");
    });
  });

  describe("getAllTags", () => {
    it("should return unique tags from all posts", () => {
      const mockFiles = ["post1.md", "post2.md"];
      mockReaddirSync.mockReturnValue(mockFiles);

      const mockContent1 = `---
title: "Post 1"
description: "Desc 1"
author: "Author 1"
date: "2025-04-10"
tags: ["tagA", "tagB"]
---
# Content 1`;
      const mockContent2 = `---
title: "Post 2"
description: "Desc 2"
author: "Author 2"
date: "2025-04-20"
tags: ["tagB", "tagC"]
---
# Content 2`;

      mockReadFileSync
        .mockReturnValueOnce(mockContent1)
        .mockReturnValueOnce(mockContent2);

      const result = getAllTags();
      expect(result).toEqual(expect.arrayContaining(["tagA", "tagB", "tagC"]));
      expect(result).toHaveLength(3);
    });
  });

  describe("getBlogPostsByTag", () => {
    it("should return posts with matching tag", () => {
      const mockFiles = ["post1.md", "post2.md"];
      mockReaddirSync.mockReturnValue(mockFiles);

      const mockContent1 = `---
title: "Post 1"
description: "Desc 1"
author: "Author 1"
date: "2025-04-10"
tags: ["tagA", "tagB"]
---
# Content 1`;
      const mockContent2 = `---
title: "Post 2"
description: "Desc 2"
author: "Author 2"
date: "2025-04-20"
tags: ["tagB", "tagC"]
---
# Content 2`;

      mockReadFileSync
        .mockReturnValueOnce(mockContent1)
        .mockReturnValueOnce(mockContent2);

      const result = getBlogPostsByTag("tagA");
      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("post1");
    });
  });
});
