import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../../app/page";

describe("Page", () => {
  test("renders all main sections", () => {
    render(<Page />);

    // Check that all main sections are rendered (using getAllByText since there are multiple instances)
    expect(screen.getAllByText("Collaborate").length).toBeGreaterThan(0);
    expect(screen.getAllByText("with clarity").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        "Help your community make important decisions in a way that reflects its unique values."
      ).length
    ).toBeGreaterThan(0);

    // Check numbered cards section (using getAllByText since there are multiple instances)
    expect(
      screen.getAllByText("How CommunityRule works").length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        "Here's a quick overview of the process, from start to finish."
      ).length
    ).toBeGreaterThan(0);

    // Check feature grid section (using getAllByText since there are multiple instances)
    expect(
      screen.getAllByText("We've got your back, every step of the way").length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        "Use our toolkit to improve, document, and evolve your organization."
      ).length
    ).toBeGreaterThan(0);

    // Check ask organizer section (using getAllByText since there are multiple instances)
    expect(screen.getAllByText("Still have questions?").length).toBeGreaterThan(
      0
    );
    expect(
      screen.getAllByText("Get answers from an experienced organizer").length
    ).toBeGreaterThan(0);
  });

  test("renders hero banner with correct data", () => {
    render(<Page />);

    // Check hero banner content (using getAllByText since there are multiple instances)
    expect(screen.getAllByText("Collaborate").length).toBeGreaterThan(0);
    expect(screen.getAllByText("with clarity").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        "Help your community make important decisions in a way that reflects its unique values."
      ).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText("Learn how CommunityRule works").length
    ).toBeGreaterThan(0);
  });

  test("renders numbered cards with correct data", () => {
    render(<Page />);

    // Check numbered cards content (using getAllByText since there are multiple instances)
    expect(
      screen.getAllByText("How CommunityRule works").length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        "Here's a quick overview of the process, from start to finish."
      ).length
    ).toBeGreaterThan(0);

    // Check individual card content (using getAllByText since there are multiple instances)
    expect(
      screen.getAllByText("Document how your community makes decisions").length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        "Build an operating manual for a successful community"
      ).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        "Get a link to your manual for your group to review and evolve"
      ).length
    ).toBeGreaterThan(0);
  });

  test("renders feature grid with correct data", () => {
    render(<Page />);

    // Check feature grid content (using getAllByText since there are multiple instances)
    expect(
      screen.getAllByText("We've got your back, every step of the way").length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        "Use our toolkit to improve, document, and evolve your organization."
      ).length
    ).toBeGreaterThan(0);
  });

  test("renders ask organizer section with correct data", () => {
    render(<Page />);

    // Check ask organizer content (using getAllByText since there are multiple instances)
    expect(screen.getAllByText("Still have questions?").length).toBeGreaterThan(
      0
    );
    expect(
      screen.getAllByText("Get answers from an experienced organizer").length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Ask an organizer").length).toBeGreaterThan(0);
  });

  test("renders all component sections", () => {
    render(<Page />);

    // Check that all major components are present by looking for their content
    // HeroBanner
    expect(screen.getAllByText("Collaborate").length).toBeGreaterThan(0);

    // LogoWall - should be present (even if just the component structure)
    // NumberedCards
    expect(
      screen.getAllByText("How CommunityRule works").length
    ).toBeGreaterThan(0);

    // RuleStack - should be present
    // FeatureGrid
    expect(
      screen.getAllByText("We've got your back, every step of the way").length
    ).toBeGreaterThan(0);

    // QuoteBlock - should be present
    // AskOrganizer
    expect(screen.getAllByText("Still have questions?").length).toBeGreaterThan(
      0
    );
  });

  test("has correct page structure", () => {
    render(<Page />);

    const mainContainer = screen.getAllByText("Collaborate")[0].closest("div");
    expect(mainContainer).toBeInTheDocument();
  });

  test("renders call-to-action elements", () => {
    render(<Page />);

    // Check CTA button in hero banner
    expect(
      screen.getAllByText("Learn how CommunityRule works").length
    ).toBeGreaterThan(0);

    // Check CTA button in ask organizer section
    expect(screen.getAllByText("Ask an organizer").length).toBeGreaterThan(0);
  });

  test("renders descriptive text content", () => {
    render(<Page />);

    // Check main description (using getAllByText since there are multiple instances)
    expect(
      screen.getAllByText(
        "Help your community make important decisions in a way that reflects its unique values."
      ).length
    ).toBeGreaterThan(0);

    // Check numbered cards description (using getAllByText since there are multiple instances)
    expect(
      screen.getAllByText(
        "Here's a quick overview of the process, from start to finish."
      ).length
    ).toBeGreaterThan(0);

    // Check feature grid description (using getAllByText since there are multiple instances)
    expect(
      screen.getAllByText(
        "Use our toolkit to improve, document, and evolve your organization."
      ).length
    ).toBeGreaterThan(0);

    // Check ask organizer description (using getAllByText since there are multiple instances)
    expect(
      screen.getAllByText("Get answers from an experienced organizer").length
    ).toBeGreaterThan(0);
  });

  test("renders section titles correctly", () => {
    render(<Page />);

    // Check all section titles (using getAllByText since there are multiple instances)
    expect(screen.getAllByText("Collaborate").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText("How CommunityRule works").length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText("We've got your back, every step of the way").length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Still have questions?").length).toBeGreaterThan(
      0
    );
  });

  test("renders numbered card items with correct content", () => {
    render(<Page />);

    // Check all three numbered card items (using getAllByText since there are multiple instances)
    expect(
      screen.getAllByText("Document how your community makes decisions").length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        "Build an operating manual for a successful community"
      ).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        "Get a link to your manual for your group to review and evolve"
      ).length
    ).toBeGreaterThan(0);
  });

  test("renders subtitle content correctly", () => {
    render(<Page />);

    // Check subtitles (using getAllByText since there are multiple instances)
    expect(screen.getAllByText("with clarity").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        "Here's a quick overview of the process, from start to finish."
      ).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        "Use our toolkit to improve, document, and evolve your organization."
      ).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText("Get answers from an experienced organizer").length
    ).toBeGreaterThan(0);
  });
});
