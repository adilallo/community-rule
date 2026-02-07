import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ContentThumbnailTemplate from "../../app/components/content/ContentThumbnailTemplate";

// Mock Next.js components
vi.mock("next/link", () => {
  return {
    default: ({ children, href, ...props }) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  };
});

vi.mock("next/image", () => {
  return {
    default: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />,
  };
});

// Mock blog post data
const mockPost = {
  slug: "test-post",
  frontmatter: {
    title: "Test Blog Post Title",
    description:
      "This is a test description for the blog post that should be long enough to test truncation.",
    author: "Test Author",
    date: "2025-04-15",
    thumbnail: {
      vertical: "test-post-vertical.svg",
      horizontal: "test-post-horizontal.svg",
    },
  },
};

describe("ContentThumbnailTemplate", () => {
  describe("Vertical Variant", () => {
    it("should render vertical variant with responsive dimensions", () => {
      render(<ContentThumbnailTemplate post={mockPost} />);

      const container = screen.getByRole("link");
      expect(container).toBeInTheDocument();

      // Check that the component has the correct classes for responsive dimensions
      const thumbnailDiv = container.querySelector("div");
      expect(thumbnailDiv).toHaveClass("w-full", "aspect-[2/3]");
    });

    it("should display post title and description", () => {
      render(<ContentThumbnailTemplate post={mockPost} />);

      expect(screen.getByText("Test Blog Post Title")).toBeInTheDocument();
      expect(
        screen.getByText(/This is a test description/),
      ).toBeInTheDocument();
    });

    it("should display author and date metadata", () => {
      render(<ContentThumbnailTemplate post={mockPost} />);

      expect(screen.getByText("Test Author")).toBeInTheDocument();
      expect(screen.getByText("April 2025")).toBeInTheDocument();
    });
  });

  describe("Horizontal Variant", () => {
    it("should render horizontal variant with responsive sizing", () => {
      render(<ContentThumbnailTemplate post={mockPost} variant="horizontal" />);

      const container = screen.getByRole("link");
      expect(container).toBeInTheDocument();

      // Check that the component has the correct classes for horizontal layout
      const thumbnailDiv = container.querySelector("div");
      expect(thumbnailDiv).toHaveClass(
        "min-w-[320px]",
        "max-w-[800px]",
        "h-[225.5px]",
      );
    });

    it("should display post information in horizontal layout", () => {
      render(<ContentThumbnailTemplate post={mockPost} />);

      expect(screen.getByText("Test Blog Post Title")).toBeInTheDocument();
      expect(
        screen.getByText(/This is a test description/),
      ).toBeInTheDocument();
      expect(screen.getByText("Test Author")).toBeInTheDocument();
    });
  });

  describe("Props and Customization", () => {
    it("should apply custom className", () => {
      render(
        <ContentThumbnailTemplate post={mockPost} className="custom-class" />,
      );

      const container = screen.getByRole("link");
      expect(container).toHaveClass("custom-class");
    });

    it("should generate correct link href", () => {
      render(<ContentThumbnailTemplate post={mockPost} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/blog/test-post");
    });

    it("should handle posts without tags gracefully", () => {
      const postWithoutTags = {
        ...mockPost,
        frontmatter: {
          ...mockPost.frontmatter,
          tags: [],
        },
      };

      render(<ContentThumbnailTemplate post={postWithoutTags} />);

      // Should still render without errors
      expect(screen.getByText("Test Blog Post Title")).toBeInTheDocument();
    });

    it("should handle posts without thumbnail images", () => {
      const postWithoutImages = {
        ...mockPost,
        frontmatter: {
          ...mockPost.frontmatter,
          thumbnail: undefined,
        },
      };

      render(<ContentThumbnailTemplate post={postWithoutImages} />);

      // Should still render without errors
      expect(screen.getByText("Test Blog Post Title")).toBeInTheDocument();
    });

    it("should use article-specific thumbnail images when provided", () => {
      render(<ContentThumbnailTemplate post={mockPost} />);

      // Check that the background image uses the article-specific thumbnail
      const backgroundImg = document.querySelector(
        "img[alt*='Background for']",
      );
      expect(backgroundImg).toBeInTheDocument();
      expect(backgroundImg.src).toContain("test-post-vertical.svg");
    });

    it("should use article-specific horizontal images for horizontal variant", () => {
      render(<ContentThumbnailTemplate post={mockPost} variant="horizontal" />);

      // Check that the background image uses the article-specific horizontal thumbnail
      const backgroundImg = document.querySelector(
        "img[alt*='Background for']",
      );
      expect(backgroundImg).toBeInTheDocument();
      expect(backgroundImg.src).toContain("test-post-horizontal.svg");
    });
  });

  describe("Default Behavior", () => {
    it("should default to vertical variant when no variant specified", () => {
      render(<ContentThumbnailTemplate post={mockPost} />);

      const thumbnailDiv = screen.getByRole("link").querySelector("div");
      expect(thumbnailDiv).toHaveClass("w-full", "aspect-[2/3]");
    });

    it("should show metadata by default", () => {
      render(<ContentThumbnailTemplate post={mockPost} />);

      expect(screen.getByText("Test Author")).toBeInTheDocument();
      expect(screen.getByText("April 2025")).toBeInTheDocument();
    });
  });
});
