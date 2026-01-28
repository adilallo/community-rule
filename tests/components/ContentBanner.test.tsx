import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ContentBanner from "../../app/components/ContentBanner";
import type { BlogPost } from "../../lib/content";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("../../lib/assetUtils", async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import("../../lib/assetUtils");
  return {
    ...actual,
    getAssetPath: vi.fn((asset: string) => `/assets/${asset}`),
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
};

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
});
