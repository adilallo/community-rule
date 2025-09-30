import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ContentBanner from "../../app/components/ContentBanner";

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

// Mock asset utils
vi.mock("../../lib/assetUtils", () => ({
  getAssetPath: vi.fn((asset) => `/assets/${asset}`),
  ASSETS: {
    CONTENT_BANNER_1: "Content_Banner_1.svg",
    CONTENT_BANNER_2: "Content_Banner_2.svg",
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
    thumbnail: {
      horizontal: "test-article-horizontal.svg",
    },
    banner: {
      horizontal: "test-article-banner.svg",
    },
  },
};

describe("ContentBanner", () => {
  it("renders the banner with correct structure", () => {
    render(<ContentBanner post={mockPost} />);

    // Check that the banner container exists - it's the first div with the specific classes
    const banner = document.querySelector(
      "div[class*='pt-[var(--measures-spacing-016)]']"
    );
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveClass(
      "pt-[var(--measures-spacing-016)]",
      "md:pt-[var(--measures-spacing-008)]",
      "lg:pt-[50px]",
      "xl:pt-[112px]",
      "h-[275px]",
      "sm:h-[326px]",
      "md:h-[224px]",
      "lg:h-[358.4px]",
      "xl:h-[504px]",
      "relative",
      "w-full",
      "sm:overflow-hidden"
    );
  });

  it("displays the background image correctly", () => {
    render(<ContentBanner post={mockPost} />);

    // Check for background div with correct styling
    const backgroundDiv = document.querySelector(
      "div[style*='background-image']"
    );
    expect(backgroundDiv).toBeInTheDocument();
    expect(backgroundDiv).toHaveClass(
      "absolute",
      "inset-0",
      "w-full",
      "h-full",
      "bg-cover",
      "bg-no-repeat",
      "aspect-[320/225.5]"
    );
  });

  it("shows banner image at md breakpoint and above", () => {
    render(<ContentBanner post={mockPost} />);

    // Check for the md+ background div with banner image
    const mdBackgroundDiv = document.querySelector(
      "div[style*='test-article-banner.svg']"
    );
    expect(mdBackgroundDiv).toBeInTheDocument();
    expect(mdBackgroundDiv).toHaveClass("hidden", "md:block");
  });

  it("displays the article title", () => {
    render(<ContentBanner post={mockPost} />);

    expect(screen.getByText("Test Article Title")).toBeInTheDocument();
  });

  it("displays the article description", () => {
    render(<ContentBanner post={mockPost} />);

    expect(
      screen.getByText("This is a test article description")
    ).toBeInTheDocument();
  });

  it("displays the author and date metadata", () => {
    render(<ContentBanner post={mockPost} />);

    expect(screen.getByText("Test Author")).toBeInTheDocument();
    expect(screen.getByText("April 2025")).toBeInTheDocument();
  });

  it("applies correct styling classes", () => {
    render(<ContentBanner post={mockPost} />);

    // Check the content container div
    const contentContainer = document.querySelector(
      "div[class*='relative z-10']"
    );
    expect(contentContainer).toBeInTheDocument();
    expect(contentContainer).toHaveClass(
      "relative",
      "z-10",
      "h-full",
      "flex",
      "flex-col"
    );
  });

  it("applies correct text styling", () => {
    render(<ContentBanner post={mockPost} />);

    const title = screen.getByText("Test Article Title");
    expect(title).toHaveClass(
      "font-bricolage",
      "font-medium",
      "text-[18px]",
      "leading-[120%]",
      "text-[var(--color-content-inverse-brand-royal)]"
    );

    const description = screen.getByText("This is a test article description");
    expect(description).toHaveClass(
      "font-inter",
      "font-normal",
      "text-[12px]",
      "leading-[16px]",
      "text-[var(--color-content-inverse-brand-royal)]"
    );
  });

  it("applies correct metadata styling", () => {
    render(<ContentBanner post={mockPost} />);

    const author = screen.getByText("Test Author");
    expect(author).toHaveClass(
      "font-inter",
      "font-normal",
      "text-[10px]",
      "leading-[14px]",
      "text-[var(--color-content-inverse-brand-royal)]"
    );

    const date = screen.getByText("April 2025");
    expect(date).toHaveClass(
      "font-inter",
      "font-normal",
      "text-[10px]",
      "leading-[14px]",
      "text-[var(--color-content-inverse-brand-royal)]"
    );
  });

  it("has proper spacing between elements", () => {
    render(<ContentBanner post={mockPost} />);

    // Check the ContentContainer spacing
    const contentContainer = document.querySelector(
      "div[class*='relative z-20']"
    );
    expect(contentContainer).toHaveClass("gap-[var(--measures-spacing-012)]");
  });

  it("has proper outer container padding", () => {
    render(<ContentBanner post={mockPost} />);

    const outerContainer = document.querySelector(
      "div[class*='pt-[var(--measures-spacing-016)]']"
    );
    expect(outerContainer).toHaveClass(
      "pt-[var(--measures-spacing-016)]",
      "md:pt-[var(--measures-spacing-008)]",
      "lg:pt-[50px]",
      "xl:pt-[112px]"
    );
  });

  it("handles missing post data gracefully", () => {
    const incompletePost = {
      slug: "incomplete",
      frontmatter: {
        title: "Incomplete Post",
        // Missing other fields
      },
    };

    render(<ContentBanner post={incompletePost} />);

    expect(screen.getByText("Incomplete Post")).toBeInTheDocument();
  });

  it("falls back to thumbnail.horizontal when banner.horizontal is missing", () => {
    const postWithoutBanner = {
      ...mockPost,
      frontmatter: {
        ...mockPost.frontmatter,
        banner: undefined,
      },
    };

    render(<ContentBanner post={postWithoutBanner} />);

    // Should use thumbnail.horizontal for md+ breakpoint
    const mdBackgroundDiv = document.querySelector(
      "div[style*='test-article-horizontal.svg']"
    );
    expect(mdBackgroundDiv).toBeInTheDocument();
    expect(mdBackgroundDiv).toHaveClass("hidden", "md:block");
  });

  it("falls back to default banner when no images are provided", () => {
    const postWithoutImages = {
      ...mockPost,
      frontmatter: {
        ...mockPost.frontmatter,
        thumbnail: undefined,
        banner: undefined,
      },
    };

    render(<ContentBanner post={postWithoutImages} />);

    // Should use default banner for md+ breakpoint
    const mdBackgroundDiv = document.querySelector(
      "div[style*='Content_Banner_2.svg']"
    );
    expect(mdBackgroundDiv).toBeInTheDocument();
    expect(mdBackgroundDiv).toHaveClass("hidden", "md:block");
  });

  it("applies responsive text sizing", () => {
    render(<ContentBanner post={mockPost} />);

    const title = screen.getByText("Test Article Title");
    expect(title).toHaveClass(
      "sm:text-[24px]",
      "md:text-[32px]",
      "lg:text-[44px]",
      "xl:text-[64px]"
    );

    const description = screen.getByText("This is a test article description");
    expect(description).toHaveClass(
      "sm:text-[14px]",
      "md:text-[14px]",
      "lg:text-[18px]",
      "xl:text-[24px]"
    );
  });

  it("has proper accessibility attributes", () => {
    render(<ContentBanner post={mockPost} />);

    // Check that the component renders without accessibility errors
    const banner = document.querySelector("div");
    expect(banner).toBeInTheDocument();

    // Check that the icon has proper alt text
    const icon = screen.getByAltText("Icon for Test Article Title");
    expect(icon).toBeInTheDocument();
  });
});
