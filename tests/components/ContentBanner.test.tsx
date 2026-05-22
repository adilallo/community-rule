import React from "react";
import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders as render } from "../utils/test-utils";
import ContentBanner from "../../app/components/sections/ContentBanner";
import type { BlogPost } from "../../lib/content";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children?: React.ReactNode;
    href?: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("../../lib/assetUtils", async (importOriginal) => {
  const actual =
    (await importOriginal()) as typeof import("../../lib/assetUtils");
  return {
    ...actual,
    getAssetPath: vi.fn((asset: string) =>
      asset.startsWith("/") ? asset : `/${asset}`,
    ),
  };
});

const mockPost: BlogPost = {
  slug: "test-article",
  frontmatter: {
    title: "Test Article",
    description: "Test description",
    author: "Test Author",
    date: "2025-04-15",
  },
  content: "",
  htmlContent: "",
  filePath: "test-article.md",
  lastModified: new Date("2025-04-15"),
};

// Pure presentational; no provider context needed.
describe("ContentBanner", () => {
  it("renders without crashing", () => {
    render(<ContentBanner post={mockPost} />);
  });

  it("renders article title", () => {
    render(<ContentBanner post={mockPost} />);
    expect(
      screen.getByRole("heading", { name: "Test Article" }),
    ).toBeInTheDocument();
  });

  it("renders article description", () => {
    render(<ContentBanner post={mockPost} />);
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("renders article banner with horizontal thumbnail below md and section SVG at md+", () => {
    const { container } = render(
      <ContentBanner
        post={{
          ...mockPost,
          slug: "resolving-active-conflicts",
          frontmatter: {
            ...mockPost.frontmatter,
            thumbnail: {
              vertical: "resolving-active-conflicts-vertical.svg",
              horizontal: "resolving-active-conflicts-horizontal.svg",
            },
          },
        }}
      />,
    );

    const banner = container.querySelector('[data-node-id="19189:9053"]');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveClass("min-h-[275px]", "md:min-h-[224px]", "xl:min-h-[504px]");

    const horizontalBackground = container.querySelector(
      '[data-name="ContentBannerBackgroundHorizontal"]',
    );
    expect(horizontalBackground).toHaveClass(
      "absolute",
      "inset-x-0",
      "top-0",
      "md:hidden",
    );
    expect(horizontalBackground?.querySelector("img")).toHaveAttribute(
      "src",
      "/content/blog/resolving-active-conflicts-horizontal.svg",
    );

    const sectionBackground = container.querySelector(
      '[data-name="ContentBannerBackgroundSection"]',
    );
    expect(sectionBackground).toHaveClass(
      "absolute",
      "inset-x-0",
      "top-0",
      "hidden",
      "md:block",
    );
    expect(sectionBackground?.querySelector("img")).toHaveAttribute(
      "src",
      "/content/blog/resolving-active-conflicts-section.svg",
    );

    const copyColumn = container.querySelector('[data-node-id="19189:9010"]');
    expect(copyColumn).toHaveClass("md:max-w-[280px]", "lg:max-w-[365px]", "xl:max-w-[623px]");
    expect(copyColumn).not.toHaveClass("h-[160px]");
  });

  it("renders useCase variant rule preview as link when href is set", () => {
    const { container } = render(
      <ContentBanner
        post={mockPost}
        variant="useCase"
        rulePreview={{
          title: "Sample Operating Manual",
          description: "Governance preview for the case study.",
          backgroundColor: "bg-[var(--color-surface-invert-brand-lavender)]",
          iconPath: "assets/case-study/case-study-mutual-aid.svg",
          href: "/use-cases/mutual-aid-colorado/rule",
        }}
      />,
    );

    const link = screen.getByRole("link", {
      name: /view sample operating manual community rule/i,
    });
    expect(link).toHaveAttribute("href", "/use-cases/mutual-aid-colorado/rule");
    expect(container.querySelector(".pointer-events-none")).toBeNull();
  });

  it("renders useCase variant with ContentContainer copy and rule preview", () => {
    const { container } = render(
      <ContentBanner
        post={mockPost}
        variant="useCase"
        rulePreview={{
          title: "Sample Operating Manual",
          description: "Governance preview for the case study.",
          backgroundColor: "bg-[var(--color-surface-invert-brand-lavender)]",
          iconPath: "assets/case-study/case-study-mutual-aid.svg",
        }}
      />,
    );

    const title = screen.getByRole("heading", { name: "Test Article" });
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("sm:text-[24px]", "md:text-[32px]");
    expect(screen.getByText("Sample Operating Manual")).toBeInTheDocument();
    const copyColumn = container.querySelector('[data-node-id="19189:9171"]');
    expect(copyColumn).toHaveClass("lg:max-w-[365px]");
    expect(copyColumn).not.toHaveClass("max-w-[365px]");
    const bannerRow = container.querySelector(
      '[data-figma-node="22015:42621"]',
    );
    expect(bannerRow).toBeInTheDocument();
    expect(bannerRow).toHaveClass("lg:grid-cols-2");
  });

  it("renders guide variant with left-aligned copy and logo mark", () => {
    const { container } = render(
      <ContentBanner post={mockPost} variant="guide" />,
    );
    expect(
      screen.getByRole("heading", { name: "Test Article" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.queryByText("Test Author")).not.toBeInTheDocument();

    const bannerRow = container.querySelector('[data-node-id="19189:9358"]');
    expect(bannerRow).toHaveClass("md:flex-row");

    const logoMark = container.querySelector(
      '[data-node-id="22078:806960"] img',
    );
    expect(logoMark).toHaveAttribute(
      "src",
      expect.stringContaining("guide-banner-logo-arrow.svg"),
    );
  });
});
