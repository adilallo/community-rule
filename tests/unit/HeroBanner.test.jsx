import { render, screen, cleanup } from "@testing-library/react";
import { describe, test, expect, afterEach } from "vitest";
import HeroBanner from "../../app/components/HeroBanner";

afterEach(() => {
  cleanup();
});

describe("HeroBanner Component", () => {
  test("renders with all props", () => {
    render(
      <HeroBanner
        title="Welcome to CommunityRule"
        subtitle="Build better communities"
        description="Create and manage community rules with ease"
        ctaText="Get Started"
        ctaHref="/signup"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Welcome to CommunityRule" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Build better communities" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Create and manage community rules with ease"),
    ).toBeInTheDocument();
    // Button component renders multiple versions for different screen sizes
    // Use getAllByRole to handle multiple buttons with same text
    const buttons = screen.getAllByRole("button", { name: "Get Started" });
    expect(buttons.length).toBeGreaterThan(0);
  });

  test("renders with minimal props", () => {
    render(<HeroBanner title="Minimal" />);

    expect(
      screen.getByRole("heading", { name: "Minimal" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Hero illustration" }),
    ).toBeInTheDocument();
  });

  test("renders hero image", () => {
    render(<HeroBanner title="Test" />);

    const heroImage = screen.getByRole("img", { name: "Hero illustration" });
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute("src", "/assets/HeroImage.png");
  });

  test("applies correct CSS classes", () => {
    render(<HeroBanner title="Test" />);

    const section = document.querySelector("section");
    expect(section).toHaveClass("bg-transparent");

    // Find the div with md:flex-1 class
    const contentLockup = document.querySelector('[class*="md:flex-1"]');
    expect(contentLockup).toBeInTheDocument();
  });

  test("renders ContentLockup with correct props", () => {
    render(
      <HeroBanner
        title="Test Title"
        subtitle="Test Subtitle"
        description="Test Description"
        ctaText="Test CTA"
        ctaHref="/test"
      />,
    );

    // Check that ContentLockup receives the props correctly
    expect(
      screen.getByRole("heading", { name: "Test Title" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Test Subtitle" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    // Button component renders multiple versions for different screen sizes
    const buttons = screen.getAllByRole("button", { name: "Test CTA" });
    expect(buttons.length).toBeGreaterThan(0);
  });

  test("renders HeroDecor component", () => {
    render(<HeroBanner title="Test" />);

    // HeroDecor should be present (it's a decorative component)
    const heroDecor = document.querySelector(
      '[class*="pointer-events-none absolute z-0"]',
    );
    expect(heroDecor).toBeInTheDocument();
  });

  test("has proper semantic structure", () => {
    render(<HeroBanner title="Test" />);

    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();

    // Should have proper heading structure
    const heading = screen.getByRole("heading", { name: "Test" });
    expect(heading).toBeInTheDocument();
  });

  test("handles empty title gracefully", () => {
    render(<HeroBanner title="" />);

    // Should still render the structure even with empty title
    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  test("applies responsive design classes", () => {
    render(<HeroBanner title="Test" />);

    const section = document.querySelector("section");
    expect(section).toHaveClass(
      "px-[var(--spacing-scale-008)]",
      "sm:px-[var(--spacing-scale-010)]",
    );
  });

  test("renders with design tokens", () => {
    render(<HeroBanner title="Test" />);

    const section = document.querySelector("section");
    expect(section).toHaveClass("bg-transparent");

    // Check for design token usage in the component structure
    const container = section.querySelector(
      '[class*="bg-[var(--color-surface-inverse-brand-primary)]"]',
    );
    expect(container).toBeInTheDocument();
  });
});
