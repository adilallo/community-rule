import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RelatedArticles from "../../app/components/sections/RelatedArticles";
import type { BlogPost } from "../../lib/content";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("../../app/components/content/ContentThumbnailTemplate", () => ({
  default: ({ post }: { post: BlogPost }) => (
    <div data-testid={`thumbnail-${post.slug}`}>
      <a href={`/blog/${post.slug}`}>
        <h3>{post.frontmatter.title}</h3>
      </a>
    </div>
  ),
}));

vi.mock("../../app/hooks", () => ({
  useIsMobile: () => false,
}));

const mockPosts: BlogPost[] = [
  {
    slug: "article-1",
    frontmatter: {
      title: "Article 1",
      description: "Description 1",
      author: "Author",
      date: "2025-04-10",
    },
  },
  {
    slug: "article-2",
    frontmatter: {
      title: "Article 2",
      description: "Description 2",
      author: "Author",
      date: "2025-04-11",
    },
  },
];

describe("RelatedArticles", () => {
  it("renders without crashing", () => {
    render(
      <RelatedArticles relatedPosts={mockPosts} currentPostSlug="current" />,
    );
  });

  it("renders related articles", () => {
    render(
      <RelatedArticles relatedPosts={mockPosts} currentPostSlug="current" />,
    );
    expect(screen.getByTestId("thumbnail-article-1")).toBeInTheDocument();
    expect(screen.getByTestId("thumbnail-article-2")).toBeInTheDocument();
  });

  it("filters out current post", () => {
    render(
      <RelatedArticles relatedPosts={mockPosts} currentPostSlug="article-1" />,
    );
    expect(screen.queryByTestId("thumbnail-article-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("thumbnail-article-2")).toBeInTheDocument();
  });
});
