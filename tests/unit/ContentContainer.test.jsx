import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ContentContainer from "../../app/components/ContentContainer";

// Mock asset utils
vi.mock("../../lib/assetUtils", () => ({
  getAssetPath: vi.fn((asset) => `/assets/${asset}`),
  ASSETS: {
    ICON_1: "Icon_1.svg",
    ICON_2: "Icon_2.svg",
    ICON_3: "Icon_3.svg",
  },
}));

// Mock blog post data
const mockPost = {
  slug: "test-article",
  frontmatter: {
    title: "Test Article Title",
    description:
      "This is a test article description that should be long enough to test truncation and wrapping behavior.",
    author: "Test Author",
    date: "2025-04-15",
  },
};

describe("ContentContainer", () => {
  it("renders with default props", () => {
    render(<ContentContainer post={mockPost} />);

    // Check that the container exists
    const container = document.querySelector("div[class*='relative z-20']");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass(
      "relative",
      "z-20",
      "h-full",
      "flex",
      "flex-col"
    );
  });

  it("displays the icon correctly", () => {
    render(<ContentContainer post={mockPost} />);

    const icon = screen.getByAltText("Icon for Test Article Title");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("src", "/assets/Icon_1.svg");
    expect(icon).toHaveClass("w-[60px]", "h-[30px]", "object-contain");
  });

  it("displays the article title", () => {
    render(<ContentContainer post={mockPost} />);

    const title = screen.getByText("Test Article Title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass(
      "font-bricolage",
      "font-medium",
      "text-[18px]",
      "leading-[120%]",
      "text-[var(--color-content-inverse-brand-royal)]"
    );
  });

  it("displays the article description", () => {
    render(<ContentContainer post={mockPost} />);

    const description = screen.getByText(/This is a test article description/);
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass(
      "font-inter",
      "font-normal",
      "text-[12px]",
      "leading-[16px]",
      "text-[var(--color-content-inverse-brand-royal)]"
    );
  });

  it("displays the author and date metadata", () => {
    render(<ContentContainer post={mockPost} />);

    expect(screen.getByText("Test Author")).toBeInTheDocument();
    expect(screen.getByText("April 2025")).toBeInTheDocument();
  });

  it("applies correct width when specified", () => {
    render(<ContentContainer post={mockPost} width="300px" size="sm" />);

    const container = document.querySelector("div[class*='relative z-20']");
    expect(container).toHaveStyle("width: 300px");
  });

  it("applies default width when not specified", () => {
    render(<ContentContainer post={mockPost} size="sm" />);

    const container = document.querySelector("div[class*='relative z-20']");
    expect(container).toHaveStyle("width: 200px");
  });

  it("has proper spacing between icon and text", () => {
    render(<ContentContainer post={mockPost} />);

    const iconContainer = screen
      .getByAltText("Icon for Test Article Title")
      .closest("div");
    const textContainer = screen.getByText("Test Article Title").closest("div");

    // Check the content container (parent of icon)
    expect(iconContainer.parentElement).toHaveClass(
      "gap-[var(--measures-spacing-008)]"
    );
    // Check the text container (parent of title) - it has responsive gap classes
    expect(textContainer.parentElement).toHaveClass("flex", "flex-col");
  });

  it("has proper metadata container styling", () => {
    render(<ContentContainer post={mockPost} />);

    const metadataContainer = screen.getByText("Test Author").closest("div");
    expect(metadataContainer).toHaveClass(
      "flex",
      "items-center",
      "gap-[var(--measures-spacing-008)]"
    );
  });

  it("applies correct metadata text styling", () => {
    render(<ContentContainer post={mockPost} />);

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

  it("cycles through different icons based on slug", () => {
    const { rerender } = render(<ContentContainer post={mockPost} />);

    // First render should use Icon_1
    let icon = screen.getByAltText("Icon for Test Article Title");
    expect(icon).toHaveAttribute("src", "/assets/Icon_1.svg");

    // Test with different slug
    const post2 = { ...mockPost, slug: "operational-security-mutual-aid" };
    rerender(<ContentContainer post={post2} />);

    icon = screen.getByAltText("Icon for Test Article Title");
    expect(icon).toHaveAttribute("src", "/assets/Icon_2.svg");

    // Test with another slug
    const post3 = { ...mockPost, slug: "making-decisions-without-hierarchy" };
    rerender(<ContentContainer post={post3} />);

    icon = screen.getByAltText("Icon for Test Article Title");
    expect(icon).toHaveAttribute("src", "/assets/Icon_3.svg");
  });

  it("handles missing post data gracefully", () => {
    const incompletePost = {
      slug: "incomplete",
      frontmatter: {
        title: "Incomplete Post",
        // Missing other fields
      },
    };

    render(<ContentContainer post={incompletePost} />);

    expect(screen.getByText("Incomplete Post")).toBeInTheDocument();
  });

  it("applies correct responsive sizing for sm breakpoint", () => {
    render(<ContentContainer post={mockPost} size="sm" />);

    const icon = screen.getByAltText("Icon for Test Article Title");
    expect(icon).toHaveClass("w-[60px]", "h-[30px]");

    const title = screen.getByText("Test Article Title");
    expect(title).toHaveClass("text-[18px]", "leading-[120%]");

    const description = screen.getByText(/This is a test article description/);
    expect(description).toHaveClass("text-[12px]", "leading-[16px]");
  });

  it("applies correct responsive sizing for md breakpoint", () => {
    render(<ContentContainer post={mockPost} size="md" />);

    const icon = screen.getByAltText("Icon for Test Article Title");
    expect(icon).toHaveClass("w-[60px]", "h-[30px]");

    const title = screen.getByText("Test Article Title");
    expect(title).toHaveClass("text-[18px]", "leading-[120%]");

    const description = screen.getByText(/This is a test article description/);
    expect(description).toHaveClass("text-[12px]", "leading-[16px]");
  });

  it("has proper accessibility attributes", () => {
    render(<ContentContainer post={mockPost} />);

    const icon = screen.getByAltText("Icon for Test Article Title");
    expect(icon).toHaveAttribute("alt", "Icon for Test Article Title");
  });

  it("handles long titles gracefully", () => {
    const longTitlePost = {
      ...mockPost,
      frontmatter: {
        ...mockPost.frontmatter,
        title:
          "This is a very long article title that should test how the component handles lengthy text content",
      },
    };

    render(<ContentContainer post={longTitlePost} />);

    expect(
      screen.getByText(/This is a very long article title/)
    ).toBeInTheDocument();
  });

  it("handles long descriptions gracefully", () => {
    const longDescPost = {
      ...mockPost,
      frontmatter: {
        ...mockPost.frontmatter,
        description:
          "This is a very long article description that should test how the component handles lengthy text content and ensures proper wrapping and truncation behavior.",
      },
    };

    render(<ContentContainer post={longDescPost} />);

    expect(
      screen.getByText(/This is a very long article description/)
    ).toBeInTheDocument();
  });
});
