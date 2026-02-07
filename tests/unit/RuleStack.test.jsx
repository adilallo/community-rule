import {
  renderWithProviders as render,
  screen,
  cleanup,
} from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, expect, afterEach } from "vitest";
import { logger } from "../../lib/logger";
import RuleStack from "../../app/components/sections/RuleStack";

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
    // Check for responsive padding classes
    expect(section).toHaveClass("px-[20px]", "py-[32px]");
    expect(section?.className).toMatch(/min-\[640px\]:px-\[32px\]/);
    expect(section?.className).toMatch(/min-\[640px\]:py-\[48px\]/);
  });

  test("applies responsive grid layout", () => {
    render(<RuleStack />);

    const grid = document.querySelector('[class*="flex flex-col gap-[18px]"]');
    expect(grid).toHaveClass("min-[768px]:grid", "min-[768px]:grid-cols-2");
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

    // Check for proper heading structure: 1 from SectionHeader + 4 from RuleCards
    const headings = screen.getAllByRole("heading");
    expect(headings).toHaveLength(5); // One section header + four rule cards
  });

  test("applies responsive spacing", () => {
    render(<RuleStack />);

    const section = document.querySelector("section");
    // Check for responsive padding classes
    expect(section?.className).toMatch(/min-\[640px\]:py-\[48px\]/);
    expect(section?.className).toMatch(/min-\[1024px\]:py-\[64px\]/);
  });

  test("renders icons with correct attributes", () => {
    render(<RuleStack />);

    const sociocracyIcon = screen.getByAltText("Sociocracy");
    expect(sociocracyIcon).toHaveAttribute(
      "src",
      "/assets/Icon_Sociocracy.svg",
    );
    // Check for responsive icon size classes
    expect(sociocracyIcon?.className).toMatch(/min-\[640px\]:max-\[1023px\]:w-\[56px\]/);
    expect(sociocracyIcon?.className).toMatch(/min-\[640px\]:max-\[1023px\]:h-\[56px\]/);
    expect(sociocracyIcon?.className).toMatch(/min-\[1440px\]:w-\[90px\]/);
    expect(sociocracyIcon?.className).toMatch(/min-\[1440px\]:h-\[90px\]/);
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
    // Button component uses outline variant which has bg-transparent and border
    expect(button?.className).toMatch(/bg-transparent/);
    expect(button?.className).toMatch(/border/);
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
