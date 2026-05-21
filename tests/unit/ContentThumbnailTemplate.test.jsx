import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ContentThumbnailTemplate from "../../app/components/content/ContentThumbnailTemplate";

vi.mock("next/link", () => {
  return {
    default: ({ children, href, ...props }) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  };
});

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
    it("should render vertical variant with fluid Figma aspect ratio", () => {
      render(<ContentThumbnailTemplate post={mockPost} />);

      const container = screen.getByRole("link");
      const thumbnailDiv = container.querySelector("div.relative");
      expect(thumbnailDiv).toHaveClass("aspect-[260/390]", "w-full");
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
    it("should render horizontal variant with fluid Figma aspect ratio", () => {
      render(<ContentThumbnailTemplate post={mockPost} variant="horizontal" />);

      const container = screen.getByRole("link");
      const thumbnailDiv = container.querySelector("div.relative");
      expect(thumbnailDiv).toHaveClass("aspect-[320/225.5]", "w-full");
    });

    it("should render fixed vertical dimensions when sizing is fixed", () => {
      render(<ContentThumbnailTemplate post={mockPost} sizing="fixed" />);

      const container = screen.getByRole("link");
      const thumbnailDiv = container.querySelector("div.relative");
      expect(thumbnailDiv).toHaveClass("h-[390px]", "w-[260px]");
    });
  });

  describe("Props and Customization", () => {
    it("should apply custom className", () => {
      render(
        <ContentThumbnailTemplate post={mockPost} className="custom-class" />,
      );

      expect(screen.getByRole("link")).toHaveClass("custom-class");
    });

    it("should generate correct link href", () => {
      render(<ContentThumbnailTemplate post={mockPost} />);

      expect(screen.getByRole("link")).toHaveAttribute(
        "href",
        "/blog/test-post",
      );
    });

    it("should use article-specific thumbnail images when provided", () => {
      render(<ContentThumbnailTemplate post={mockPost} />);

      const backgroundImg = document.querySelector('img[src*="test-post-vertical"]');
      expect(backgroundImg).toBeInTheDocument();
    });

    it("should use horizontal thumbnail for horizontal variant", () => {
      render(<ContentThumbnailTemplate post={mockPost} variant="horizontal" />);

      const backgroundImg = document.querySelector(
        'img[src*="test-post-horizontal"]',
      );
      expect(backgroundImg).toBeInTheDocument();
    });
  });
});
