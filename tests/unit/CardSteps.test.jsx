import {
  renderWithProviders as render,
  screen,
  cleanup,
} from "../utils/test-utils";
import { describe, test, expect, afterEach } from "vitest";
import CardSteps from "../../app/components/sections/CardSteps";

afterEach(() => {
  cleanup();
});

describe("CardSteps Component", () => {
  const mockSteps = [
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

  test("renders with title, subtitle, and step cards", () => {
    render(
      <CardSteps
        title="How CommunityRule helps"
        subtitle="Build better communities step by step"
        steps={mockSteps}
      />,
    );

    expect(screen.getByRole("heading")).toBeInTheDocument();
    expect(
      screen.getByText("Build better communities step by step"),
    ).toBeInTheDocument();

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
      <CardSteps
        title="Test Title"
        subtitle="Test Subtitle"
        steps={mockSteps}
      />,
    );

    expect(screen.getByRole("heading")).toBeInTheDocument();
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
  });

  test("renders Step tiles with correct props", () => {
    render(<CardSteps title="Test" subtitle="Test" steps={mockSteps} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("renders call-to-action button", () => {
    render(<CardSteps title="Test" subtitle="Test" steps={mockSteps} />);

    expect(
      screen.getByRole("button", { name: "See how it works" }),
    ).toBeInTheDocument();
  });

  test("renders stacked desktop heading lines when provided", () => {
    const { container } = render(
      <CardSteps
        title="Mobile line"
        subtitle="Test"
        steps={mockSteps}
        headingDesktopLines={["How", "CommunityRule", "helps"]}
      />,
    );

    const h2 = container.querySelector("h2");
    expect(h2?.textContent).toContain("Mobile line");
    expect(h2?.textContent).toContain("CommunityRule");
    expect(h2?.textContent).toContain("helps");
  });

  test("renders with design tokens", () => {
    render(<CardSteps title="Test" subtitle="Test" steps={mockSteps} />);

    const section = document.querySelector("section");
    expect(section).toHaveClass(
      "bg-transparent",
      "py-[var(--spacing-scale-032)]",
    );
  });

  test("applies responsive grid layout", () => {
    render(<CardSteps title="Test" subtitle="Test" steps={mockSteps} />);

    const cardsContainer = document.querySelector(
      '[class*="grid grid-cols-1"]',
    );
    expect(cardsContainer).toBeInTheDocument();
  });

  test("renders schema markup", () => {
    render(
      <CardSteps
        title="Test Title"
        subtitle="Test Description"
        steps={mockSteps}
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
    render(<CardSteps title="Test" subtitle="Test" steps={mockSteps} />);

    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();

    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
  });

  test("handles empty steps array", () => {
    render(<CardSteps title="Test" subtitle="Test" steps={[]} />);

    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "See how it works" }),
    ).toBeInTheDocument();
  });

  test("centers call-to-action region", () => {
    render(<CardSteps title="Test" subtitle="Test" steps={mockSteps} />);

    const buttonRegion = screen
      .getByRole("button", { name: "See how it works" })
      .closest("div");
    expect(buttonRegion).toHaveClass("text-center");
  });

  test("renders with proper spacing", () => {
    render(<CardSteps title="Test" subtitle="Test" steps={mockSteps} />);

    const section = document.querySelector("section");
    expect(section).toHaveClass(
      "py-[var(--spacing-scale-032)]",
      "sm:py-[var(--spacing-scale-048)]",
    );
  });

  test("applies max-width constraint", () => {
    render(<CardSteps title="Test" subtitle="Test" steps={mockSteps} />);

    const container = document.querySelector(
      '[class*="max-w-[var(--spacing-measures-max-width-lg)]"]',
    );
    expect(container).toBeInTheDocument();
  });
});
