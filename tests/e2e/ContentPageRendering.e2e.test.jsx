import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ContentBanner from "../../app/components/ContentBanner";
import AskOrganizer from "../../app/components/AskOrganizer";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  notFound: vi.fn(),
  usePathname: vi.fn(() => "/blog/test-post"),
}));

// Mock asset utils
vi.mock("../../lib/assetUtils", () => ({
  getAssetPath: vi.fn((asset) => `/assets/${asset}`),
  ASSETS: {
    CONTENT_BANNER_1: "Content_Banner_1.svg",
    CONTENT_BANNER_2: "Content_Banner_2.svg",
    CONTENT_SHAPE_1: "Content_Shape_1.svg",
    CONTENT_SHAPE_2: "Content_Shape_2.svg",
  },
}));

const mockBlogPost = {
  slug: "test-article",
  frontmatter: {
    title: "Test Article Title",
    description: "This is a test article description",
    author: "Test Author",
    date: "2025-04-15",
  },
  htmlContent:
    "<p>This is the main content of the test article.</p><p>It has multiple paragraphs.</p>",
};

describe("Content Page Rendering E2E", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ContentBanner Component", () => {
    it("should render blog post banner with correct information", () => {
      render(<ContentBanner post={mockBlogPost} />);

      // Verify banner content
      expect(screen.getByText("Test Article Title")).toBeInTheDocument();
      expect(
        screen.getByText("This is a test article description"),
      ).toBeInTheDocument();
      expect(screen.getByText("Test Author")).toBeInTheDocument();
      expect(screen.getByText("April 2025")).toBeInTheDocument();
    });

    it("should render with proper semantic structure", () => {
      render(<ContentBanner post={mockBlogPost} />);

      // Verify semantic HTML structure - ContentBanner doesn't have role="banner"
      const container = screen.getByText("Test Article Title").closest("div");
      expect(container).toBeInTheDocument();

      // Verify headings hierarchy
      const h3 = screen.getByRole("heading", { level: 3 });
      expect(h3).toHaveTextContent("Test Article Title");
    });

    it("should handle different blog posts with different content", () => {
      const differentPost = {
        ...mockBlogPost,
        frontmatter: {
          ...mockBlogPost.frontmatter,
          title: "Different Article Title",
          description: "Different description",
        },
      };

      render(<ContentBanner post={differentPost} />);

      // Verify different content is rendered
      expect(screen.getByText("Different Article Title")).toBeInTheDocument();
      expect(screen.getByText("Different description")).toBeInTheDocument();

      // Verify old content is not present
      expect(screen.queryByText("Test Article Title")).not.toBeInTheDocument();
    });
  });

  describe("AskOrganizer Component", () => {
    it("should render ask organizer with correct content", () => {
      render(
        <AskOrganizer
          title="Still have questions?"
          subtitle="Get help from our community organizers"
          description="We're here to help you with any questions or concerns."
        />,
      );

      // Verify ask organizer content
      expect(screen.getByText("Still have questions?")).toBeInTheDocument();
      expect(
        screen.getByText("Get help from our community organizers"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /ask an organizer/i }),
      ).toBeInTheDocument();
    });

    it("should render with inverse variant", () => {
      render(
        <AskOrganizer
          variant="inverse"
          title="Still have questions?"
          subtitle="Get help from our community organizers"
        />,
      );

      // Verify ask organizer content is still present
      expect(screen.getByText("Still have questions?")).toBeInTheDocument();
      expect(
        screen.getByText("Get help from our community organizers"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /ask an organizer/i }),
      ).toBeInTheDocument();
    });

    it("should have proper accessibility attributes", () => {
      render(<AskOrganizer />);

      // Verify link is accessible (Button component renders as a link)
      const link = screen.getByRole("link", { name: /ask an organizer/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "#");
    });
  });

  describe("Component Integration", () => {
    it("should render multiple components together", () => {
      render(
        <div>
          <ContentBanner post={mockBlogPost} />
          <AskOrganizer
            title="Still have questions?"
            subtitle="Get help from our community organizers"
          />
        </div>,
      );

      // Verify both components are rendered
      expect(screen.getByText("Test Article Title")).toBeInTheDocument();
      expect(screen.getByText("Still have questions?")).toBeInTheDocument();
    });

    it("should maintain proper semantic structure when combined", () => {
      render(
        <main>
          <ContentBanner post={mockBlogPost} />
          <AskOrganizer
            title="Still have questions?"
            subtitle="Get help from our community organizers"
          />
        </main>,
      );

      // Verify semantic structure
      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByRole("region")).toBeInTheDocument(); // AskOrganizer has role="region"

      // Verify headings hierarchy
      const h3 = screen.getByRole("heading", { level: 3 });
      expect(h3).toHaveTextContent("Test Article Title");
    });
  });
});
