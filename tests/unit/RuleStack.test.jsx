import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, expect, afterEach } from "vitest";
import { logger } from "../../lib/logger";
import RuleStack from "../../app/components/RuleStack";

afterEach(() => {
  cleanup();
});

describe("RuleStack Component", () => {
  test("renders all four rule cards", () => {
    render(<RuleStack />);

    expect(screen.getByText("Consensus clusters")).toBeInTheDocument();
    expect(screen.getByText("Consensus")).toBeInTheDocument();
    expect(screen.getByText("Elected Board")).toBeInTheDocument();
    expect(screen.getByText("Petition")).toBeInTheDocument();
  });

  test("renders with custom className", () => {
    render(<RuleStack className="custom-class" />);

    const section = document.querySelector("section");
    expect(section).toHaveClass("custom-class");
  });

  test("renders rule card descriptions", () => {
    render(<RuleStack />);

    expect(
      screen.getByText(/Units called Circles have the ability to decide/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Decisions that affect the group collectively/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/An elected board determines policies/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/All participants can propose and vote/),
    ).toBeInTheDocument();
  });

  test("renders rule card icons", () => {
    render(<RuleStack />);

    expect(screen.getByAltText("Sociocracy")).toBeInTheDocument();
    expect(screen.getByAltText("Consensus")).toBeInTheDocument();
    expect(screen.getByAltText("Elected Board")).toBeInTheDocument();
    expect(screen.getByAltText("Petition")).toBeInTheDocument();
  });

  test("renders call-to-action button", () => {
    render(<RuleStack />);

    expect(
      screen.getByRole("button", { name: "See all templates" }),
    ).toBeInTheDocument();
  });

  test("applies correct CSS classes", () => {
    render(<RuleStack />);

    const section = document.querySelector("section");
    expect(section).toHaveClass("w-full", "bg-transparent");
  });

  test("renders with design tokens", () => {
    render(<RuleStack />);

    const section = document.querySelector("section");
    expect(section).toHaveClass(
      "py-[var(--spacing-scale-032)]",
      "px-[var(--spacing-scale-020)]",
    );
  });

  test("applies responsive grid layout", () => {
    render(<RuleStack />);

    const grid = document.querySelector('[class*="flex flex-col gap-[18px]"]');
    expect(grid).toHaveClass("xmd:grid", "xmd:grid-cols-2");
  });

  test("renders RuleCard components with correct props", () => {
    render(<RuleStack />);

    // Check that RuleCard components receive correct props
    const consensusClustersCard = screen
      .getByText("Consensus clusters")
      .closest('[class*="bg-[var(--color-surface-default-brand-lime)]"]');
    expect(consensusClustersCard).toBeInTheDocument();

    const consensusCard = screen
      .getByText("Consensus")
      .closest('[class*="bg-[var(--color-surface-default-brand-rust)]"]');
    expect(consensusCard).toBeInTheDocument();
  });

  test("handles template click events", async () => {
    const user = userEvent.setup();
    const debugSpy = vi
      .spyOn(logger, "debug")
      .mockImplementation(() => undefined);

    render(<RuleStack />);

    const consensusCard = screen.getByText("Consensus").closest("div");
    await user.click(consensusCard);

    expect(debugSpy).toHaveBeenCalledWith("Consensus template clicked");

    debugSpy.mockRestore();
  });

  test("renders with proper semantic structure", () => {
    render(<RuleStack />);

    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();

    // Check for proper heading structure in cards
    const headings = screen.getAllByRole("heading");
    expect(headings).toHaveLength(4); // Four rule cards
  });

  test("applies responsive spacing", () => {
    render(<RuleStack />);

    const section = document.querySelector("section");
    expect(section).toHaveClass(
      "md:py-[var(--spacing-scale-048)]",
      "lg:py-[var(--spacing-scale-064)]",
    );
  });

  test("renders icons with correct attributes", () => {
    render(<RuleStack />);

    const sociocracyIcon = screen.getByAltText("Sociocracy");
    expect(sociocracyIcon).toHaveAttribute(
      "src",
      "/assets/Icon_Sociocracy.svg",
    );
    expect(sociocracyIcon).toHaveClass(
      "md:w-[56px]",
      "md:h-[56px]",
      "lg:w-[90px]",
      "lg:h-[90px]",
    );
  });

  test("applies different background colors to cards", () => {
    render(<RuleStack />);

    // Look for RuleCard elements with background color classes
    const cards = document.querySelectorAll('[role="button"]');
    expect(cards.length).toBeGreaterThan(0);

    // Verify that cards have background color classes
    cards.forEach((card) => {
      expect(card.className).toMatch(
        /bg-\[var\(--color-surface-default-brand-/,
      );
    });
  });

  test("renders with proper button styling", () => {
    render(<RuleStack />);

    const button = screen.getByRole("button", { name: "See all templates" });
    expect(button).toHaveClass("bg-transparent", "border-[1.5px]");
  });

  test("applies flex layout for button container", () => {
    render(<RuleStack />);

    const buttonContainer = screen
      .getByRole("button", { name: "See all templates" })
      .closest("div");
    expect(buttonContainer).toHaveClass("flex", "justify-center");
  });

  test("handles analytics tracking", async () => {
    const user = userEvent.setup();
    const gtagSpy = vi.fn();
    const analyticsSpy = vi.fn();

    // Mock window.gtag and window.analytics
    Object.defineProperty(window, "gtag", {
      value: gtagSpy,
      writable: true,
    });
    Object.defineProperty(window, "analytics", {
      value: { track: analyticsSpy },
      writable: true,
    });

    render(<RuleStack />);

    const electedBoardCard = screen.getByText("Elected Board").closest("div");
    await user.click(electedBoardCard);

    expect(gtagSpy).toHaveBeenCalledWith("event", "template_click", {
      template_name: "Elected Board",
    });
    expect(analyticsSpy).toHaveBeenCalledWith("Template Clicked", {
      templateName: "Elected Board",
    });
  });
});
