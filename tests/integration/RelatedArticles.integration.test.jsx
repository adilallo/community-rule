import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RelatedArticles from "../../app/components/RelatedArticles";

// Mock ContentThumbnailTemplate
vi.mock("../../app/components/ContentThumbnailTemplate", () => ({
  default: ({ post, variant }) => (
    <div data-testid={`thumbnail-${post.slug}`} data-variant={variant}>
      <a
        href={`/blog/${post.slug}`}
        data-testid={`thumbnail-link-${post.slug}`}
      >
        <h3>{post.frontmatter?.title || "Untitled"}</h3>
        <p>{post.frontmatter?.description || "No description"}</p>
      </a>
    </div>
  ),
}));

// Mock blog post data
const mockRelatedPosts = [
  {
    slug: "resolving-active-conflicts",
    frontmatter: {
      title: "Resolving Active Conflicts",
      description:
        "Practical steps for resolving conflicts while maintaining trust",
      author: "Test Author",
      date: "2025-04-15",
    },
  },
  {
    slug: "operational-security-mutual-aid",
    frontmatter: {
      title: "Operational Security for Mutual Aid",
      description:
        "Tactics to protect members, secure communication, and prevent infiltration",
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
  {
    slug: "building-community-trust",
    frontmatter: {
      title: "Building Community Trust",
      description: "Strategies for fostering trust in community organizations",
      author: "Test Author",
      date: "2025-04-12",
    },
  },
];

describe("Related Articles Integration", () => {
  beforeEach(() => {
    // Mock window.innerWidth for responsive tests
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024, // Desktop width
    });
  });

  it("should filter out current post from related articles", () => {
    render(
      <RelatedArticles
        relatedPosts={mockRelatedPosts}
        currentPostSlug="resolving-active-conflicts"
      />,
    );

    // Current post should not be displayed
    expect(
      screen.queryByTestId("thumbnail-resolving-active-conflicts"),
    ).not.toBeInTheDocument();

    // Other posts should be displayed
    expect(
      screen.getByTestId("thumbnail-operational-security-mutual-aid"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("thumbnail-making-decisions-without-hierarchy"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("thumbnail-building-community-trust"),
    ).toBeInTheDocument();
  });

  it("should display all posts when no current post is specified", () => {
    render(<RelatedArticles relatedPosts={mockRelatedPosts} />);

    // All posts should be displayed
    expect(
      screen.getByTestId("thumbnail-resolving-active-conflicts"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("thumbnail-operational-security-mutual-aid"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("thumbnail-making-decisions-without-hierarchy"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("thumbnail-building-community-trust"),
    ).toBeInTheDocument();
  });

  it("should create correct links for each thumbnail", () => {
    render(
      <RelatedArticles
        relatedPosts={mockRelatedPosts}
        currentPostSlug="resolving-active-conflicts"
      />,
    );

    // Verify links are created correctly
    expect(
      screen.getByTestId("thumbnail-link-operational-security-mutual-aid"),
    ).toHaveAttribute("href", "/blog/operational-security-mutual-aid");
    expect(
      screen.getByTestId("thumbnail-link-making-decisions-without-hierarchy"),
    ).toHaveAttribute("href", "/blog/making-decisions-without-hierarchy");
    expect(
      screen.getByTestId("thumbnail-link-building-community-trust"),
    ).toHaveAttribute("href", "/blog/building-community-trust");
  });

  it("should handle empty related posts array", () => {
    const { container } = render(
      <RelatedArticles relatedPosts={[]} currentPostSlug="test-post" />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("should handle single related post", () => {
    const singlePost = [mockRelatedPosts[0]];

    render(
      <RelatedArticles
        relatedPosts={singlePost}
        currentPostSlug="different-post"
      />,
    );

    expect(
      screen.getByTestId("thumbnail-resolving-active-conflicts"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("thumbnail-operational-security-mutual-aid"),
    ).not.toBeInTheDocument();
  });

  it("should handle all posts being filtered out", () => {
    const currentPostOnly = [mockRelatedPosts[0]];

    const { container } = render(
      <RelatedArticles
        relatedPosts={currentPostOnly}
        currentPostSlug="resolving-active-conflicts"
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("should display section heading", () => {
    render(
      <RelatedArticles
        relatedPosts={mockRelatedPosts}
        currentPostSlug="resolving-active-conflicts"
      />,
    );

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Related Articles",
    );
  });

  it("should maintain consistent structure across different current posts", () => {
    const slugs = [
      "resolving-active-conflicts",
      "operational-security-mutual-aid",
      "making-decisions-without-hierarchy",
    ];

    slugs.forEach((slug) => {
      const { unmount } = render(
        <RelatedArticles
          relatedPosts={mockRelatedPosts}
          currentPostSlug={slug}
        />,
      );

      // Verify consistent structure
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Related Articles",
      );
      // Check that we have some thumbnails (the exact ones depend on the current post)
      const thumbnails = screen.getAllByTestId(/thumbnail-/);
      expect(thumbnails.length).toBeGreaterThan(0);

      unmount();
    });
  });
});
