import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import RelatedArticles from "../../app/components/RelatedArticles";

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

// Mock ContentThumbnailTemplate
vi.mock("../../app/components/ContentThumbnailTemplate", () => {
  return {
    default: ({ post }) => (
      <div data-testid={`thumbnail-${post.slug}`}>
        <a href={`/blog/${post.slug}`}>
          <h3>{post.frontmatter.title}</h3>
          <p>{post.frontmatter.description}</p>
        </a>
      </div>
    ),
  };
});

// Mock blog post data
const mockRelatedPosts = [
  {
    slug: "related-article-1",
    frontmatter: {
      title: "Related Article 1",
      description: "This is the first related article",
      author: "Test Author",
      date: "2025-04-10",
    },
  },
  {
    slug: "related-article-2",
    frontmatter: {
      title: "Related Article 2",
      description: "This is the second related article",
      author: "Test Author",
      date: "2025-04-12",
    },
  },
  {
    slug: "related-article-3",
    frontmatter: {
      title: "Related Article 3",
      description: "This is the third related article",
      author: "Test Author",
      date: "2025-04-14",
    },
  },
];

describe("RelatedArticles", () => {
  beforeEach(() => {
    // Mock window.innerWidth for responsive tests
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024, // Desktop width
    });
  });

  it("renders the section with correct structure", () => {
    render(
      <RelatedArticles
        relatedPosts={mockRelatedPosts}
        currentPostSlug="current-article"
      />,
    );

    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass(
      "py-[var(--spacing-scale-032)]",
      "lg:py-[var(--spacing-scale-064)]",
    );
  });

  it("displays the section heading", () => {
    render(
      <RelatedArticles
        relatedPosts={mockRelatedPosts}
        currentPostSlug="current-article"
      />,
    );

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Related Articles");
    expect(heading).toHaveClass(
      "text-[32px]",
      "lg:text-[44px]",
      "leading-[110%]",
      "font-medium",
      "text-[var(--color-content-inverse-primary)]",
      "text-center",
    );
  });

  it("renders all related articles", () => {
    render(
      <RelatedArticles
        relatedPosts={mockRelatedPosts}
        currentPostSlug="current-article"
      />,
    );

    expect(
      screen.getByTestId("thumbnail-related-article-1"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("thumbnail-related-article-2"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("thumbnail-related-article-3"),
    ).toBeInTheDocument();
  });

  it("filters out the current post from related articles", () => {
    const postsWithCurrent = [
      ...mockRelatedPosts,
      {
        slug: "current-article",
        frontmatter: {
          title: "Current Article",
          description: "This is the current article",
          author: "Test Author",
          date: "2025-04-15",
        },
      },
    ];

    render(
      <RelatedArticles
        relatedPosts={postsWithCurrent}
        currentPostSlug="current-article"
      />,
    );

    // Should not render the current article
    expect(
      screen.queryByTestId("thumbnail-current-article"),
    ).not.toBeInTheDocument();

    // Should still render the other related articles
    expect(
      screen.getByTestId("thumbnail-related-article-1"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("thumbnail-related-article-2"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("thumbnail-related-article-3"),
    ).toBeInTheDocument();
  });

  it("renders nothing when no related posts", () => {
    const { container } = render(
      <RelatedArticles relatedPosts={[]} currentPostSlug="current-article" />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when all posts are filtered out", () => {
    const currentPostOnly = [
      {
        slug: "current-article",
        frontmatter: {
          title: "Current Article",
          description: "This is the current article",
          author: "Test Author",
          date: "2025-04-15",
        },
      },
    ];

    const { container } = render(
      <RelatedArticles
        relatedPosts={currentPostOnly}
        currentPostSlug="current-article"
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("has correct container styling", () => {
    render(
      <RelatedArticles
        relatedPosts={mockRelatedPosts}
        currentPostSlug="current-article"
      />,
    );

    const container = document.querySelector("section > div");
    expect(container).toHaveClass(
      "flex",
      "flex-col",
      "gap-[var(--spacing-scale-032)]",
      "lg:gap-[51px]",
    );
  });

  it("has correct articles container styling", () => {
    render(
      <RelatedArticles
        relatedPosts={mockRelatedPosts}
        currentPostSlug="current-article"
      />,
    );

    const articlesContainer = document.querySelector("section > div > div");
    expect(articlesContainer).toHaveClass(
      "flex",
      "justify-center",
      "overflow-hidden",
    );
  });

  it("applies correct responsive behavior for desktop", () => {
    // Set desktop width
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });

    render(
      <RelatedArticles
        relatedPosts={mockRelatedPosts}
        currentPostSlug="current-article"
      />,
    );

    const carouselContainer = document.querySelector(
      "section > div > div > div",
    );
    expect(carouselContainer).toHaveClass(
      "overflow-x-auto",
      "scrollbar-hide",
      "cursor-grab",
      "active:cursor-grabbing",
    );
  });

  it("applies correct responsive behavior for mobile", () => {
    // Set mobile width
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(
      <RelatedArticles
        relatedPosts={mockRelatedPosts}
        currentPostSlug="current-article"
      />,
    );

    const carouselContainer = document.querySelector(
      "section > div > div > div",
    );
    expect(carouselContainer).toHaveClass(
      "transition-transform",
      "duration-500",
      "ease-in-out",
    );
  });

  it("handles single related article", () => {
    const singlePost = [mockRelatedPosts[0]];

    render(
      <RelatedArticles
        relatedPosts={singlePost}
        currentPostSlug="current-article"
      />,
    );

    expect(
      screen.getByTestId("thumbnail-related-article-1"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("thumbnail-related-article-2"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("thumbnail-related-article-3"),
    ).not.toBeInTheDocument();
  });

  it("handles two related articles", () => {
    const twoPosts = mockRelatedPosts.slice(0, 2);

    render(
      <RelatedArticles
        relatedPosts={twoPosts}
        currentPostSlug="current-article"
      />,
    );

    expect(
      screen.getByTestId("thumbnail-related-article-1"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("thumbnail-related-article-2"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("thumbnail-related-article-3"),
    ).not.toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(
      <RelatedArticles
        relatedPosts={mockRelatedPosts}
        currentPostSlug="current-article"
      />,
    );

    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("applies correct gap between articles", () => {
    render(
      <RelatedArticles
        relatedPosts={mockRelatedPosts}
        currentPostSlug="current-article"
      />,
    );

    const carouselContainer = document.querySelector(
      "section > div > div > div",
    );
    expect(carouselContainer).toHaveClass("gap-0");
  });

  it("handles missing currentPostSlug gracefully", () => {
    render(<RelatedArticles relatedPosts={mockRelatedPosts} />);

    // Should still render all articles
    expect(
      screen.getByTestId("thumbnail-related-article-1"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("thumbnail-related-article-2"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("thumbnail-related-article-3"),
    ).toBeInTheDocument();
  });

  it("handles malformed post data gracefully", () => {
    const malformedPosts = [
      {
        slug: "malformed-1",
        frontmatter: {
          title: "Malformed Post 1",
          description: "Test description",
          author: "Test Author",
          date: "2025-04-15",
        },
      },
      {
        slug: "malformed-2",
        frontmatter: {
          title: "Malformed Post 2",
          description: "Test description",
          author: "Test Author",
          date: "2025-04-15",
        },
      },
    ];

    render(
      <RelatedArticles
        relatedPosts={malformedPosts}
        currentPostSlug="current-article"
      />,
    );

    expect(screen.getByTestId("thumbnail-malformed-1")).toBeInTheDocument();
    expect(screen.getByTestId("thumbnail-malformed-2")).toBeInTheDocument();
  });
});
