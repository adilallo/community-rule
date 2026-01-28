import { render, screen, cleanup } from "@testing-library/react";
import { describe, test, expect, afterEach } from "vitest";
import FeatureGrid from "../../app/components/FeatureGrid";

afterEach(() => {
  cleanup();
});

describe("FeatureGrid Component", () => {
  test("renders with title and subtitle", () => {
    render(
      <FeatureGrid
        title="Feature Tools"
        subtitle="Everything you need to build better communities"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Feature Tools" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Everything you need to build better communities",
      }),
    ).toBeInTheDocument();
  });

  test("renders with custom className", () => {
    render(
      <FeatureGrid title="Test" subtitle="Test" className="custom-class" />,
    );

    const section = document.querySelector("section");
    expect(section).toHaveClass("custom-class");
  });

  test("renders all four MiniCard components", () => {
    render(<FeatureGrid title="Test" subtitle="Test" />);

    // Check for all four MiniCard components
    expect(
      screen.getByRole("link", { name: "Decision-making support tools" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Values alignment exercises" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Membership guidance resources" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Conflict resolution tools" }),
    ).toBeInTheDocument();
  });

  test("renders ContentLockup with feature variant", () => {
    render(<FeatureGrid title="Feature Title" subtitle="Feature Subtitle" />);

    expect(
      screen.getByRole("heading", { name: "Feature Title" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Feature Subtitle" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Learn more" }),
    ).toBeInTheDocument();
  });

  test("has proper accessibility attributes", () => {
    render(<FeatureGrid title="Test" subtitle="Test" />);

    const section = document.querySelector("section");
    expect(section).toHaveAttribute("aria-labelledby", "feature-grid-headline");
    expect(section).toHaveAttribute("tabIndex", "-1");

    const grid = screen.getByRole("grid");
    expect(grid).toHaveAttribute("aria-label", "Feature tools and services");
  });

  test("renders with design tokens", () => {
    render(<FeatureGrid title="Test" subtitle="Test" />);

    const section = document.querySelector("section");
    expect(section).toHaveClass("p-0", "lg:p-[var(--spacing-scale-064)]");

    const container = section.querySelector('[class*="bg-[#171717]"]');
    expect(container).toBeInTheDocument();
  });

  test("applies responsive grid layout", () => {
    render(<FeatureGrid title="Test" subtitle="Test" />);

    const grid = screen.getByRole("grid");
    expect(grid).toHaveClass("grid", "grid-cols-2", "md:grid-cols-4");
  });

  test("renders MiniCard with correct props", () => {
    render(<FeatureGrid title="Test" subtitle="Test" />);

    // Check first MiniCard (Decision-making support)
    const firstCard = screen.getByRole("link", {
      name: "Decision-making support tools",
    });
    expect(firstCard).toHaveAttribute("href", "#decision-making");

    // Check second MiniCard (Values alignment)
    const secondCard = screen.getByRole("link", {
      name: "Values alignment exercises",
    });
    expect(secondCard).toHaveAttribute("href", "#values-alignment");
  });

  test("renders with proper semantic structure", () => {
    render(<FeatureGrid title="Test" subtitle="Test" />);

    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();

    const grid = screen.getByRole("grid");
    expect(grid).toBeInTheDocument();
  });

  test("handles missing optional props gracefully", () => {
    render(<FeatureGrid />);

    // Should still render the structure
    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();

    // Should render default MiniCards
    expect(
      screen.getByRole("link", { name: "Decision-making support tools" }),
    ).toBeInTheDocument();
  });

  test("applies focus-within styles", () => {
    render(<FeatureGrid title="Test" subtitle="Test" />);

    const container = document
      .querySelector("section")
      .querySelector('[class*="focus-within:ring-2"]');
    expect(container).toBeInTheDocument();
  });
});
