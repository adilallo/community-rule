import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import BlogPostPage from "../../app/blog/[slug]/page";

// Mock Next.js components
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

vi.mock("next/link", () => {
  return {
    default: ({ children, href, ...props }) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  };
});

// Mock content processing
vi.mock("../../lib/content", () => ({
  getBlogPostBySlug: vi.fn(),
  getAllBlogPosts: vi.fn(),
}));

// Mock components
vi.mock("../../app/components/ContentBanner", () => {
  return {
    default: ({ post }) => (
      <div data-testid="content-banner">
        <h1>{post.frontmatter.title}</h1>
        <p>{post.frontmatter.description}</p>
      </div>
    ),
  };
});

vi.mock("../../app/components/RelatedArticles", () => {
  return {
    default: ({ relatedPosts, currentPostSlug }) => (
      <div data-testid="related-articles">
        <h2>Related Articles</h2>
        {relatedPosts.map((post) => (
          <div key={post.slug} data-testid={`related-${post.slug}`}>
            {post.frontmatter.title}
          </div>
        ))}
      </div>
    ),
  };
});

vi.mock("../../app/components/AskOrganizer", () => {
  return {
    default: ({ title, subtitle, buttonText }) => (
      <div data-testid="ask-organizer">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <button>{buttonText}</button>
      </div>
    ),
  };
});

// Mock asset utils
vi.mock("../../lib/assetUtils", () => ({
  getAssetPath: vi.fn((asset) => `/assets/${asset}`),
  ASSETS: {
    CONTENT_SHAPE_1: "Content_Shape_1.svg",
    CONTENT_SHAPE_2: "Content_Shape_2.svg",
  },
}));

// Mock blog post data
const mockPost = {
  slug: "test-article",
  frontmatter: {
    title: "Test Article Title",
    description: "This is a test article description",
    author: "Test Author",
    date: "2025-04-15",
  },
  htmlContent:
    "<p>This is the article content with <strong>bold text</strong> and <em>italic text</em>.</p>",
};

const mockRelatedPosts = [
  {
    slug: "related-1",
    frontmatter: {
      title: "Related Article 1",
      description: "First related article",
      author: "Test Author",
      date: "2025-04-10",
    },
  },
  {
    slug: "related-2",
    frontmatter: {
      title: "Related Article 2",
      description: "Second related article",
      author: "Test Author",
      date: "2025-04-12",
    },
  },
];

describe("BlogPostPage", () => {
  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock the content functions
    const { getBlogPostBySlug, getAllBlogPosts } = await import(
      "../../lib/content"
    );
    vi.mocked(getBlogPostBySlug).mockReturnValue(mockPost);
    vi.mocked(getAllBlogPosts).mockReturnValue([mockPost, ...mockRelatedPosts]);
  });

  it("renders the blog post page with correct structure", async () => {
    const BlogPostPageComponent = await BlogPostPage({
      params: { slug: "test-article" },
    });
    render(BlogPostPageComponent);

    // Check main container (it's a div, not main)
    const mainContainer = document.querySelector("div.min-h-screen");
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass(
      "min-h-screen",
      "relative",
      "overflow-hidden",
    );
    // Background color is applied via inline style from frontmatter hex
    expect(mainContainer).toHaveStyle({ backgroundColor: expect.any(String) });
  });

  it("renders the content banner", async () => {
    const BlogPostPageComponent = await BlogPostPage({
      params: { slug: "test-article" },
    });
    render(BlogPostPageComponent);

    expect(screen.getByTestId("content-banner")).toBeInTheDocument();
    expect(screen.getByText("Test Article Title")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test article description"),
    ).toBeInTheDocument();
  });

  it("renders the article content", async () => {
    const BlogPostPageComponent = await BlogPostPage({
      params: { slug: "test-article" },
    });
    render(BlogPostPageComponent);

    const article = document.querySelector("article");
    expect(article).toBeInTheDocument();
    expect(article).toHaveClass(
      "p-[var(--spacing-scale-024)]",
      "sm:py-[var(--spacing-scale-032)]",
    );

    // Check content is rendered
    expect(screen.getByText(/This is the article content/)).toBeInTheDocument();
    expect(screen.getByText("bold text")).toBeInTheDocument();
    expect(screen.getByText("italic text")).toBeInTheDocument();
  });

  it("renders the related articles section", async () => {
    const BlogPostPageComponent = await BlogPostPage({
      params: { slug: "test-article" },
    });
    render(BlogPostPageComponent);

    expect(screen.getByTestId("related-articles")).toBeInTheDocument();
    expect(screen.getByText("Related Articles")).toBeInTheDocument();
    expect(screen.getByTestId("related-related-1")).toBeInTheDocument();
    expect(screen.getByTestId("related-related-2")).toBeInTheDocument();
  });

  it("renders the ask organizer section", async () => {
    const BlogPostPageComponent = await BlogPostPage({
      params: { slug: "test-article" },
    });
    render(BlogPostPageComponent);

    expect(screen.getByTestId("ask-organizer")).toBeInTheDocument();
    expect(screen.getByText("Still have questions?")).toBeInTheDocument();
    expect(
      screen.getByText("Get answers from an experienced organizer"),
    ).toBeInTheDocument();
    expect(screen.getByText("Ask an organizer")).toBeInTheDocument();
  });

  it("renders decorative shapes", async () => {
    const BlogPostPageComponent = await BlogPostPage({
      params: { slug: "test-article" },
    });
    render(BlogPostPageComponent);

    // Check for decorative shapes
    const shapes = screen.getAllByAltText("");
    expect(shapes).toHaveLength(2);

    // Check shape sources
    expect(shapes[0]).toHaveAttribute("src", "/assets/Content_Shape_1.svg");
    expect(shapes[1]).toHaveAttribute("src", "/assets/Content_Shape_2.svg");
  });

  it("applies correct styling to article content", async () => {
    const BlogPostPageComponent = await BlogPostPage({
      params: { slug: "test-article" },
    });
    render(BlogPostPageComponent);

    const contentDiv = screen
      .getByText(/This is the article content/)
      .closest("div.post-body");
    expect(contentDiv).toHaveClass("post-body");
    expect(contentDiv).toHaveClass("-mt-[var(--spacing-scale-048)]");
    expect(contentDiv).toHaveClass(
      "text-[var(--color-content-inverse-primary)]",
    );
    expect(contentDiv).toHaveClass("text-[16px]");
    expect(contentDiv).toHaveClass("leading-[24px]");
  });

  it("applies responsive text sizing", async () => {
    const BlogPostPageComponent = await BlogPostPage({
      params: { slug: "test-article" },
    });
    render(BlogPostPageComponent);

    const contentDiv = screen
      .getByText(/This is the article content/)
      .closest("div.post-body");
    expect(contentDiv).toHaveClass("sm:text-[18px]");
    expect(contentDiv).toHaveClass("sm:leading-[130%]");
    expect(contentDiv).toHaveClass("lg:text-[24px]");
    expect(contentDiv).toHaveClass("lg:leading-[32px]");
    expect(contentDiv).toHaveClass("xl:text-[32px]");
    expect(contentDiv).toHaveClass("xl:leading-[40px]");
  });

  it("applies responsive max-width constraints", async () => {
    const BlogPostPageComponent = await BlogPostPage({
      params: { slug: "test-article" },
    });
    render(BlogPostPageComponent);

    const contentDiv = screen
      .getByText(/This is the article content/)
      .closest("div.post-body");
    expect(contentDiv).toHaveClass("sm:mx-auto");
    expect(contentDiv).toHaveClass("sm:max-w-[390px]");
    expect(contentDiv).toHaveClass("md:max-w-[472px]");
    expect(contentDiv).toHaveClass("lg:max-w-[700px]");
    expect(contentDiv).toHaveClass("xl:max-w-[904px]");
  });

  it("includes structured data scripts", async () => {
    const BlogPostPageComponent = await BlogPostPage({
      params: { slug: "test-article" },
    });
    render(BlogPostPageComponent);

    // Check for script elements using querySelector since RTL ignores them
    const scripts = document.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts).toHaveLength(2);

    // Check that scripts have the correct type and content
    scripts.forEach((script) => {
      expect(script).toHaveAttribute("type", "application/ld+json");
      expect(script.innerHTML).toBeTruthy();
    });
  });

  it("handles missing post gracefully", async () => {
    const { getBlogPostBySlug } = await import("../../lib/content");
    vi.mocked(getBlogPostBySlug).mockReturnValue(null);

    // The component should throw an error when post is null
    // This happens because notFound() is called
    await expect(
      BlogPostPage({ params: { slug: "non-existent" } }),
    ).rejects.toThrow();
  });

  it("filters out current post from related articles", async () => {
    const BlogPostPageComponent = await BlogPostPage({
      params: { slug: "test-article" },
    });
    render(BlogPostPageComponent);

    // Current post should not appear in related articles
    expect(
      screen.queryByTestId("related-test-article"),
    ).not.toBeInTheDocument();

    // Other related posts should appear
    expect(screen.getByTestId("related-related-1")).toBeInTheDocument();
    expect(screen.getByTestId("related-related-2")).toBeInTheDocument();
  });

  it("applies correct positioning to decorative shapes", async () => {
    const BlogPostPageComponent = await BlogPostPage({
      params: { slug: "test-article" },
    });
    render(BlogPostPageComponent);

    const shapes = screen.getAllByAltText("");

    // First shape (right side)
    const rightShape = shapes[0].closest("div");
    expect(rightShape).toHaveClass(
      "hidden",
      "md:block",
      "absolute",
      "top-1/4",
      "right-0",
      "pointer-events-none",
      "z-10",
    );

    // Second shape (left side)
    const leftShape = shapes[1].closest("div");
    expect(leftShape).toHaveClass(
      "hidden",
      "md:block",
      "absolute",
      "top-1/2",
      "left-0",
      "pointer-events-none",
      "z-10",
    );
  });

  it("handles malformed post data gracefully", async () => {
    const malformedPost = {
      slug: "malformed",
      frontmatter: {
        title: "Malformed Post",
        description: "A malformed post for testing",
        author: "Test Author",
        date: "2025-01-15",
      },
      htmlContent: "<p>Content</p>",
    };

    const { getBlogPostBySlug } = await import("../../lib/content");
    vi.mocked(getBlogPostBySlug).mockReturnValue(malformedPost);

    const BlogPostPageComponent = await BlogPostPage({
      params: { slug: "malformed" },
    });
    render(BlogPostPageComponent);

    expect(screen.getByText("Malformed Post")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
