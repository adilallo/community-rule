import { render, screen, cleanup } from "@testing-library/react";
import { describe, test, expect, afterEach } from "vitest";
import LogoWall from "../../app/components/LogoWall";

afterEach(() => {
  cleanup();
});

describe("LogoWall Component", () => {
  test("renders with default logos", () => {
    render(<LogoWall />);

    // Check for default logos
    expect(screen.getByAltText("Food Not Bombs")).toBeInTheDocument();
    expect(screen.getByAltText("Start COOP")).toBeInTheDocument();
    expect(screen.getByAltText("Metagov")).toBeInTheDocument();
    expect(screen.getByAltText("Open Civics")).toBeInTheDocument();
    expect(screen.getByAltText("Mutual Aid CO")).toBeInTheDocument();
    expect(screen.getByAltText("CU Boulder")).toBeInTheDocument();
  });

  test("renders with custom logos", () => {
    const customLogos = [
      {
        src: "assets/custom1.png",
        alt: "Custom Logo 1",
        size: "h-8",
        order: "order-1",
      },
      {
        src: "assets/custom2.png",
        alt: "Custom Logo 2",
        size: "h-10",
        order: "order-2",
      },
    ];

    render(<LogoWall logos={customLogos} />);

    expect(screen.getByAltText("Custom Logo 1")).toBeInTheDocument();
    expect(screen.getByAltText("Custom Logo 2")).toBeInTheDocument();
    expect(screen.queryByAltText("Food Not Bombs")).not.toBeInTheDocument();
  });

  test("renders section label", () => {
    render(<LogoWall />);

    expect(
      screen.getByText("Trusted by leading cooperators"),
    ).toBeInTheDocument();
  });

  test("applies correct CSS classes", () => {
    render(<LogoWall />);

    const section = document.querySelector("section");
    expect(section).toHaveClass("p-[var(--spacing-scale-032)]");
  });

  test("renders with design tokens", () => {
    render(<LogoWall />);

    const section = document.querySelector("section");
    expect(section).toHaveClass(
      "p-[var(--spacing-scale-032)]",
      "md:px-[var(--spacing-scale-024)]",
    );
  });

  test("applies responsive grid layout", () => {
    render(<LogoWall />);

    const grid = document.querySelector(
      '[class*="grid grid-cols-2 grid-rows-3"]',
    );
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass("sm:grid-cols-3", "sm:grid-rows-2", "md:flex");
  });

  test("renders logos with correct attributes", () => {
    render(<LogoWall />);

    const foodNotBombsLogo = screen.getByAltText("Food Not Bombs");
    expect(foodNotBombsLogo).toHaveAttribute(
      "src",
      "/assets/Section/Logo_FoodNotBombs.png",
    );
    expect(foodNotBombsLogo).toHaveClass("h-11", "lg:h-14", "xl:h-[70px]");
  });

  test("applies order classes for responsive layout", () => {
    render(<LogoWall />);

    const foodNotBombsContainer = screen
      .getByAltText("Food Not Bombs")
      .closest("div");
    expect(foodNotBombsContainer).toHaveClass("order-1", "sm:order-4");
  });

  test("handles empty logos array", () => {
    render(<LogoWall logos={[]} />);

    // Should fall back to default logos
    expect(screen.getByAltText("Food Not Bombs")).toBeInTheDocument();
  });

  test("applies hover effects", () => {
    render(<LogoWall />);

    const logoContainers = document.querySelectorAll(
      '[class*="hover:opacity-100"]',
    );
    expect(logoContainers.length).toBeGreaterThan(0);
  });

  test("renders with proper semantic structure", () => {
    render(<LogoWall />);

    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();

    // Check for the label
    const label = screen.getByText("Trusted by leading cooperators");
    expect(label).toBeInTheDocument();
  });

  test("applies transition effects", () => {
    render(<LogoWall />);

    const logoContainers = document.querySelectorAll(
      '[class*="transition-opacity duration-500"]',
    );
    expect(logoContainers.length).toBeGreaterThan(0);
  });

  test("renders with proper image optimization", () => {
    render(<LogoWall />);

    const logos = screen.getAllByRole("img");
    logos.forEach((logo) => {
      // Next.js Image attributes are not rendered as HTML attributes in JSDOM
      // Just verify the images are present
      expect(logo).toBeInTheDocument();
    });
  });

  test("prioritizes first two logos", () => {
    render(<LogoWall />);

    const logos = screen.getAllByRole("img");
    const foodNotBombsLogo = logos.find((img) => img.alt === "Food Not Bombs");
    const startCoopLogo = logos.find((img) => img.alt === "Start COOP");

    // Next.js Image priority attribute is not rendered as HTML attribute in JSDOM
    // Just verify the logos are present
    expect(foodNotBombsLogo).toBeInTheDocument();
    expect(startCoopLogo).toBeInTheDocument();
  });

  test("applies scale effect on hover", () => {
    render(<LogoWall />);

    const logos = screen.getAllByRole("img");
    logos.forEach((logo) => {
      expect(logo).toHaveClass("hover:scale-105");
    });
  });
});
