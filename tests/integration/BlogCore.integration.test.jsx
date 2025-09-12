import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import RelatedArticles from "../../app/components/RelatedArticles";

// Mock ContentThumbnailTemplate with a simple implementation
vi.mock("../../app/components/ContentThumbnailTemplate", () => ({
  default: ({ post, variant }) => (
    <div data-testid={`thumbnail-${post.slug}`} data-variant={variant}>
      <a href={`/blog/${post.slug}`}>
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
];

describe("Blog Core Integration", () => {
  beforeEach(() => {
    // Mock window.innerWidth for responsive tests
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024, // Desktop width
    });
  });

  it("should render RelatedArticles component with correct structure", () => {
    render(
      <RelatedArticles
        relatedPosts={mockRelatedPosts}
        currentPostSlug="resolving-active-conflicts"
      />
    );

    // Verify the section exists
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Related Articles"
    );

    // Verify thumbnails are rendered
    expect(
      screen.getByTestId("thumbnail-operational-security-mutual-aid")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("thumbnail-making-decisions-without-hierarchy")
    ).toBeInTheDocument();

    // Current post should not be displayed
    expect(
      screen.queryByTestId("thumbnail-resolving-active-conflicts")
    ).not.toBeInTheDocument();
  });

  it("should filter out current post from related articles", () => {
    render(
      <RelatedArticles
        relatedPosts={mockRelatedPosts}
        currentPostSlug="resolving-active-conflicts"
      />
    );

    // Current post should not be displayed
    expect(
      screen.queryByTestId("thumbnail-resolving-active-conflicts")
    ).not.toBeInTheDocument();

    // Other posts should be displayed
    expect(
      screen.getByTestId("thumbnail-operational-security-mutual-aid")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("thumbnail-making-decisions-without-hierarchy")
    ).toBeInTheDocument();
  });

  it("should display all posts when no current post is specified", () => {
    render(<RelatedArticles relatedPosts={mockRelatedPosts} />);

    // All posts should be displayed
    expect(
      screen.getByTestId("thumbnail-resolving-active-conflicts")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("thumbnail-operational-security-mutual-aid")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("thumbnail-making-decisions-without-hierarchy")
    ).toBeInTheDocument();
  });

  it("should handle empty related posts array", () => {
    const { container } = render(
      <RelatedArticles relatedPosts={[]} currentPostSlug="test-post" />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should create correct links for each thumbnail", () => {
    render(
      <RelatedArticles
        relatedPosts={mockRelatedPosts}
        currentPostSlug="resolving-active-conflicts"
      />
    );

    // Verify links are created correctly
    const operationalLink = screen
      .getByTestId("thumbnail-operational-security-mutual-aid")
      .querySelector("a");
    const hierarchyLink = screen
      .getByTestId("thumbnail-making-decisions-without-hierarchy")
      .querySelector("a");

    expect(operationalLink).toHaveAttribute(
      "href",
      "/blog/operational-security-mutual-aid"
    );
    expect(hierarchyLink).toHaveAttribute(
      "href",
      "/blog/making-decisions-without-hierarchy"
    );
  });

  it("should display section heading", () => {
    render(
      <RelatedArticles
        relatedPosts={mockRelatedPosts}
        currentPostSlug="resolving-active-conflicts"
      />
    );

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Related Articles"
    );
  });
});
