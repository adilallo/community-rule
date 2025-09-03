import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Logo from "../../app/components/Logo";

describe("Logo Component", () => {
  it("renders the logo with default props", () => {
    render(<Logo />);

    const logo = screen.getByRole("link", { name: /communityrule logo/i });
    expect(logo).toBeInTheDocument();
    expect(screen.getByText("CommunityRule")).toBeInTheDocument();
    expect(screen.getByAltText("CommunityRule Logo Icon")).toBeInTheDocument();
  });

  it("renders with custom size variant", () => {
    const { rerender } = render(<Logo size="header" />);
    let logo = screen.getByRole("link");
    expect(logo).toHaveClass("h-[20.85px]");

    rerender(<Logo size="headerLg" />);
    logo = screen.getByRole("link");
    expect(logo).toHaveClass("h-[28px]");

    rerender(<Logo size="footer" />);
    logo = screen.getByRole("link");
    expect(logo).toHaveClass("h-[calc(40px*1.37)]");
  });

  it("renders without text when showText is false", () => {
    render(<Logo showText={false} />);

    expect(screen.queryByText("CommunityRule")).not.toBeInTheDocument();
    expect(screen.getByAltText("CommunityRule Logo Icon")).toBeInTheDocument();
  });

  it("applies proper hover effects", () => {
    render(<Logo />);

    const logo = screen.getByRole("link");
    expect(logo).toHaveClass("hover:scale-[1.02]", "transition-all");
  });

  it("applies proper accessibility attributes", () => {
    render(<Logo />);

    const logo = screen.getByRole("link");
    expect(logo).toHaveAttribute("aria-label", "CommunityRule Logo");
    expect(logo).toHaveAttribute("role", "link");
  });

  it("applies proper text styling for different sizes", () => {
    const { rerender } = render(<Logo size="homeHeaderMd" />);
    let textElement = screen.getByText("CommunityRule");
    expect(textElement).toHaveClass(
      "text-[var(--color-content-inverse-primary)]"
    );

    rerender(<Logo size="header" />);
    textElement = screen.getByText("CommunityRule");
    expect(textElement).toHaveClass(
      "text-[var(--color-content-default-primary)]"
    );
  });

  it("applies proper icon sizing for different variants", () => {
    const { rerender } = render(<Logo size="homeHeaderSm" />);
    let icon = screen.getByAltText("CommunityRule Logo Icon");
    expect(icon).toHaveClass("w-[14.39px]", "h-[14.39px]");

    rerender(<Logo size="headerXl" />);
    icon = screen.getByAltText("CommunityRule Logo Icon");
    expect(icon).toHaveClass("w-[33.81px]", "h-[33.81px]");
  });

  it("applies brightness filter for home header variants", () => {
    render(<Logo size="homeHeaderMd" />);

    const icon = screen.getByAltText("CommunityRule Logo Icon");
    expect(icon).toHaveClass("filter", "brightness-0");
  });

  it("maintains proper spacing when text is hidden", () => {
    render(<Logo showText={false} />);

    const logo = screen.getByRole("link");
    // Should not have gap class when text is hidden
    expect(logo.className).not.toContain("gap-[8.28px]");
  });

  it("applies proper font classes to text", () => {
    render(<Logo />);

    const textElement = screen.getByText("CommunityRule");
    expect(textElement).toHaveClass("font-bricolage-grotesque", "font-normal");
  });

  it("applies proper icon attributes", () => {
    render(<Logo />);

    const icon = screen.getByAltText("CommunityRule Logo Icon");
    expect(icon).toHaveAttribute("src", "assets/Logo.svg");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("handles all size variants correctly", () => {
    const sizes = [
      "default",
      "homeHeaderXsmall",
      "homeHeaderSm",
      "homeHeaderMd",
      "homeHeaderLg",
      "homeHeaderXl",
      "header",
      "headerMd",
      "headerLg",
      "headerXl",
      "footer",
      "footerLg",
    ];

    sizes.forEach((size) => {
      const { unmount } = render(<Logo size={size} />);
      const logo = screen.getByRole("link");
      expect(logo).toBeInTheDocument();
      unmount();
    });
  });
});
