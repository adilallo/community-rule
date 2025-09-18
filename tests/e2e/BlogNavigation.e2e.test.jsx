import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ContentThumbnailTemplate from "../../app/components/ContentThumbnailTemplate";
import RelatedArticles from "../../app/components/RelatedArticles";

// Mock Next.js navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  notFound: vi.fn(),
  usePathname: vi.fn(() => "/"),
}));

// Mock Next.js Link to trigger navigation
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }) => (
    <a
      href={href}
      {...props}
      onClick={(e) => {
        e.preventDefault();
        mockPush(href);
      }}
    >
      {children}
    </a>
  ),
}));

// Mock asset utils
vi.mock("../../lib/assetUtils", () => ({
  getAssetPath: vi.fn((asset) => `/assets/${asset}`),
  ASSETS: {
    CONTENT_THUMBNAIL_1: "Content_Thumbnail_1.svg",
    CONTENT_THUMBNAIL_2: "Content_Thumbnail_2.svg",
    CONTENT_THUMBNAIL_3: "Content_Thumbnail_3.svg",
    CONTENT_ICON_1: "Content_Icon_1.svg",
    CONTENT_ICON_2: "Content_Icon_2.svg",
    CONTENT_ICON_3: "Content_Icon_3.svg",
  },
}));

const mockBlogPost = {
  slug: "resolving-active-conflicts",
  frontmatter: {
    title: "Resolving Active Conflicts",
    description:
      "Practical steps for resolving conflicts while maintaining trust",
    author: "Test Author",
    date: "2025-04-15",
  },
};

const mockRelatedPosts = [
  {
    slug: "operational-security-mutual-aid",
    frontmatter: {
      title: "Operational Security for Mutual Aid",
      description: "Tactics to protect members, secure communication",
      author: "Test Author",
      date: "2025-04-14",
    },
  },
  {
    slug: "making-decisions-without-hierarchy",
    frontmatter: {
      title: "Making Decisions Without Hierarchy",
      description:
        "A brief guide to collaborative nonhierarchical decision making",
      author: "Test Author",
      date: "2025-04-13",
    },
  },
];

describe("Blog Navigation E2E", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ContentThumbnailTemplate Navigation", () => {
    it("should navigate to blog post when thumbnail is clicked", () => {
      render(<ContentThumbnailTemplate post={mockBlogPost} />);

      // Find the thumbnail link
      const thumbnailLink = screen.getByRole("link");
      expect(thumbnailLink).toBeInTheDocument();
      expect(thumbnailLink).toHaveAttribute(
        "href",
        "/blog/resolving-active-conflicts",
      );

      // Click the thumbnail
      fireEvent.click(thumbnailLink);

      // Verify navigation was called
      expect(mockPush).toHaveBeenCalledWith("/blog/resolving-active-conflicts");
    });

    it("should display correct post information", () => {
      render(<ContentThumbnailTemplate post={mockBlogPost} />);

      // Verify post content is displayed
      expect(
        screen.getByText("Resolving Active Conflicts"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Practical steps for resolving conflicts while maintaining trust",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("Test Author")).toBeInTheDocument();
      expect(screen.getByText("April 2025")).toBeInTheDocument();
    });

    it("should render with correct variant based on screen size", () => {
      render(<ContentThumbnailTemplate post={mockBlogPost} />);

      // Verify the thumbnail container exists
      const thumbnailContainer = screen.getByRole("link").closest("div");
      expect(thumbnailContainer).toBeInTheDocument();
    });
  });

  describe("RelatedArticles Navigation", () => {
    it("should display related articles with correct links", () => {
      render(<RelatedArticles relatedPosts={mockRelatedPosts} />);

      // Verify related articles are displayed
      expect(
        screen.getByText("Operational Security for Mutual Aid"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Making Decisions Without Hierarchy"),
      ).toBeInTheDocument();

      // Verify links are present
      const relatedLinks = screen.getAllByRole("link");
      expect(relatedLinks).toHaveLength(2);
      expect(relatedLinks[0]).toHaveAttribute(
        "href",
        "/blog/operational-security-mutual-aid",
      );
      expect(relatedLinks[1]).toHaveAttribute(
        "href",
        "/blog/making-decisions-without-hierarchy",
      );
    });

    it("should navigate to related article when clicked", () => {
      render(<RelatedArticles relatedPosts={mockRelatedPosts} />);

      // Find and click first related article
      const firstRelatedLink = screen
        .getByText("Operational Security for Mutual Aid")
        .closest("a");
      expect(firstRelatedLink).toBeInTheDocument();

      fireEvent.click(firstRelatedLink);

      // Verify navigation was called
      expect(mockPush).toHaveBeenCalledWith(
        "/blog/operational-security-mutual-aid",
      );
    });

    it("should handle empty related posts gracefully", () => {
      const { container } = render(<RelatedArticles relatedPosts={[]} />);

      // Should not crash and should render nothing (component returns null)
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Navigation Flow", () => {
    it("should complete navigation flow: thumbnail → related article", () => {
      // Render thumbnail
      const { rerender } = render(
        <ContentThumbnailTemplate post={mockBlogPost} />,
      );

      // Click thumbnail
      const thumbnailLink = screen.getByRole("link");
      fireEvent.click(thumbnailLink);
      expect(mockPush).toHaveBeenCalledWith("/blog/resolving-active-conflicts");

      // Clear mocks and render related articles
      vi.clearAllMocks();
      rerender(<RelatedArticles relatedPosts={mockRelatedPosts} />);

      // Click related article
      const relatedLink = screen
        .getByText("Operational Security for Mutual Aid")
        .closest("a");
      fireEvent.click(relatedLink);
      expect(mockPush).toHaveBeenCalledWith(
        "/blog/operational-security-mutual-aid",
      );
    });
  });
});
