import {
  renderWithProviders as render,
  screen,
  cleanup,
} from "../utils/test-utils";
import { describe, test, expect, afterEach } from "vitest";
import NumberedCards from "../../app/components/sections/NumberedCards";

afterEach(() => {
  cleanup();
});

describe("NumberedCards Component", () => {
  const mockCards = [
    {
      text: "Define your community values",
      iconShape: "circle",
      iconColor: "blue",
    },
    {
      text: "Create decision-making processes",
      iconShape: "square",
      iconColor: "green",
    },
    {
      text: "Establish communication channels",
      iconShape: "triangle",
      iconColor: "red",
    },
  ];

  test("renders with title, subtitle, and cards", () => {
    render(
      <NumberedCards
        title="How CommunityRule helps"
        subtitle="Build better communities step by step"
        cards={mockCards}
      />,
    );

    // Check for the heading (it contains both mobile and desktop versions)
    expect(screen.getByRole("heading")).toBeInTheDocument();
    // Check for the subtitle text
    expect(
      screen.getByText("Build better communities step by step"),
    ).toBeInTheDocument();

    // Check for card content
    expect(
      screen.getByText("Define your community values"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Create decision-making processes"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Establish communication channels"),
    ).toBeInTheDocument();
  });

  test("renders SectionHeader component", () => {
    render(
      <NumberedCards
        title="Test Title"
        subtitle="Test Subtitle"
        cards={mockCards}
      />,
    );

    // Check for the heading (it contains both mobile and desktop versions)
    expect(screen.getByRole("heading")).toBeInTheDocument();
    // Check for the subtitle text
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
  });

  test("renders NumberCard components with correct props", () => {
    render(<NumberedCards title="Test" subtitle="Test" cards={mockCards} />);

    // Check that NumberCard components receive correct props
    expect(screen.getByText("1")).toBeInTheDocument(); // First card number
    expect(screen.getByText("2")).toBeInTheDocument(); // Second card number
    expect(screen.getByText("3")).toBeInTheDocument(); // Third card number
  });

  test("renders call-to-action buttons", () => {
    render(<NumberedCards title="Test" subtitle="Test" cards={mockCards} />);

    expect(
      screen.getByRole("button", { name: "Create CommunityRule" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "See how it works" }),
    ).toBeInTheDocument();
  });

  test("applies responsive button visibility", () => {
    render(<NumberedCards title="Test" subtitle="Test" cards={mockCards} />);

    const createButton = screen.getByRole("button", {
      name: "Create CommunityRule",
    });
    const seeHowButton = screen.getByRole("button", {
      name: "See how it works",
    });

    expect(createButton.closest("div")).toHaveClass("block", "lg:hidden");
    expect(seeHowButton.closest("div")).toHaveClass("hidden", "lg:block");
  });

  test("renders with design tokens", () => {
    render(<NumberedCards title="Test" subtitle="Test" cards={mockCards} />);

    const section = document.querySelector("section");
    expect(section).toHaveClass(
      "bg-transparent",
      "py-[var(--spacing-scale-032)]",
    );
  });

  test("applies responsive grid layout", () => {
    render(<NumberedCards title="Test" subtitle="Test" cards={mockCards} />);

    const cardsContainer = document.querySelector(
      '[class*="grid grid-cols-1"]',
    );
    expect(cardsContainer).toBeInTheDocument();
  });

  test("renders schema markup", () => {
    render(
      <NumberedCards
        title="Test Title"
        subtitle="Test Description"
        cards={mockCards}
      />,
    );

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const schemaData = JSON.parse(script.textContent);
    expect(schemaData["@type"]).toBe("HowTo");
    expect(schemaData.name).toBe("Test Title");
    expect(schemaData.description).toBe("Test Description");
    expect(schemaData.step).toHaveLength(3);
  });

  test("has proper semantic structure", () => {
    render(<NumberedCards title="Test" subtitle="Test" cards={mockCards} />);

    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();

    // Check for proper heading structure
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
  });

  test("handles empty cards array", () => {
    render(<NumberedCards title="Test" subtitle="Test" cards={[]} />);

    // Should still render the structure
    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();

    // Should render buttons even without cards
    expect(
      screen.getByRole("button", { name: "Create CommunityRule" }),
    ).toBeInTheDocument();
  });

  test("applies responsive text alignment", () => {
    render(<NumberedCards title="Test" subtitle="Test" cards={mockCards} />);

    const buttonContainer = screen
      .getByRole("button", { name: "Create CommunityRule" })
      .closest("div");
    expect(buttonContainer).toHaveClass("block", "lg:hidden");
  });

  test("renders with proper spacing", () => {
    render(<NumberedCards title="Test" subtitle="Test" cards={mockCards} />);

    const section = document.querySelector("section");
    expect(section).toHaveClass(
      "py-[var(--spacing-scale-032)]",
      "sm:py-[var(--spacing-scale-048)]",
    );
  });

  test("applies max-width constraint", () => {
    render(<NumberedCards title="Test" subtitle="Test" cards={mockCards} />);

    const container = document.querySelector(
      '[class*="max-w-[var(--spacing-measures-max-width-lg)]"]',
    );
    expect(container).toBeInTheDocument();
  });
});
