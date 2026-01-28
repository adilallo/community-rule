import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Logo from "../../app/components/Logo";

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock asset utils
vi.mock("../../lib/assetUtils", () => ({
  getAssetPath: vi.fn((asset) => `/assets/${asset}`),
  ASSETS: {
    LOGO: "CommunityRule_Logo.svg",
  },
}));

describe("Logo Navigation E2E", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should navigate to homepage when logo is clicked", () => {
    render(<Logo />);

    // Find the logo link
    const logoLink = screen.getByRole("link", { name: /communityrule logo/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");

    // Verify the link is clickable (Next.js Link renders as <a> tag)
    expect(logoLink.tagName).toBe("A");
  });

  it("should have proper accessibility attributes", () => {
    render(<Logo />);

    const logoLink = screen.getByRole("link", { name: /communityrule logo/i });
    expect(logoLink).toHaveAttribute("aria-label", "CommunityRule Logo");
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("should render logo image correctly", () => {
    render(<Logo />);

    // The image has aria-hidden="true" so we need to find it by alt text
    const logoImage = screen.getByAltText("CommunityRule Logo Icon");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", "/assets/CommunityRule_Logo.svg");
    expect(logoImage).toHaveAttribute("alt", "CommunityRule Logo Icon");
    expect(logoImage).toHaveAttribute("aria-hidden", "true");
  });
});
