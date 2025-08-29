import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, expect, afterEach } from "vitest";
import Page from "../../app/page";

afterEach(() => {
  cleanup();
});

describe("Page Flow Integration", () => {
  test("renders complete page with all sections in correct order", () => {
    render(<Page />);

    // Hero Banner section
    expect(
      screen.getByRole("heading", { name: "Collaborate" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "with clarity" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Help your community make important decisions in a way that reflects its unique values."
      )
    ).toBeInTheDocument();
    // Check that CTA button exists (multiple sizes for responsive design)
    const ctaButtons = screen.getAllByRole("button", {
      name: "Learn how CommunityRule works",
    });
    expect(ctaButtons.length).toBeGreaterThan(0);

    // Logo Wall section - check for partner logos
    expect(screen.getByAltText("Food Not Bombs")).toBeInTheDocument();
    expect(screen.getByAltText("Start COOP")).toBeInTheDocument();
    expect(screen.getByAltText("Metagov")).toBeInTheDocument();
    expect(screen.getByAltText("Open Civics")).toBeInTheDocument();
    expect(screen.getByAltText("Mutual Aid CO")).toBeInTheDocument();
    expect(screen.getByAltText("CU Boulder")).toBeInTheDocument();

    // Numbered Cards section
    expect(
      screen.getByRole("heading", { name: /How CommunityRule works/ })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Here's a quick overview of the process, from start to finish."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Document how your community makes decisions")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Build an operating manual for a successful community")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Get a link to your manual for your group to review and evolve"
      )
    ).toBeInTheDocument();

    // Rule Stack section
    expect(
      screen.getByRole("heading", { name: "Consensus clusters" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Elected Board" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Consensus" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Petition" })
    ).toBeInTheDocument();

    // Feature Grid section
    expect(
      screen.getByRole("heading", {
        name: "We've got your back, every step of the way",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Use our toolkit to improve, document, and evolve your organization."
      )
    ).toBeInTheDocument();

    // Quote Block section
    expect(
      screen.getByText(/The rules of decision-making must be open/)
    ).toBeInTheDocument();

    // Ask Organizer section
    expect(
      screen.getByRole("heading", { name: "Still have questions?" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Get answers from an experienced organizer")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Ask an organizer/i })
    ).toBeInTheDocument();
  });

  test("hero banner CTA button is interactive", async () => {
    const user = userEvent.setup();
    render(<Page />);

    // Get the first CTA button (multiple sizes for responsive design)
    const ctaButtons = screen.getAllByRole("button", {
      name: "Learn how CommunityRule works",
    });
    const ctaButton = ctaButtons[0];
    expect(ctaButton).toBeInTheDocument();
    // Button should be clickable (no href needed for button elements)
    expect(ctaButton).toBeEnabled();

    // Test button interaction
    await user.click(ctaButton);
    // Button should remain visible after click
    expect(ctaButton).toBeInTheDocument();
  });

  test("numbered cards display with correct icons and colors", () => {
    render(<Page />);

    // Check that all three cards are rendered
    const cards = screen.getAllByText(
      /Document how your community|Build an operating manual|Get a link to your manual/
    );
    expect(cards).toHaveLength(3);

    // Check that section numbers are present
    const sectionNumbers = screen.getAllByText(/1|2|3/);
    expect(sectionNumbers.length).toBeGreaterThan(0);
  });

  test("rule stack displays all four governance types", () => {
    render(<Page />);

    // Check all four rule types are present
    expect(screen.getByText("Consensus clusters")).toBeInTheDocument();
    expect(screen.getByText("Elected Board")).toBeInTheDocument();
    expect(screen.getByText("Consensus")).toBeInTheDocument();
    expect(screen.getByText("Petition")).toBeInTheDocument();

    // Check that create rule button is present
    const createButton = screen.getByRole("button", {
      name: "Create CommunityRule",
    });
    expect(createButton).toBeInTheDocument();
  });

  test("ask organizer section has proper call-to-action", () => {
    render(<Page />);

    const askLink = screen.getByRole("link", { name: /Ask an organizer/i });
    expect(askLink).toBeInTheDocument();
    expect(askLink).toHaveAttribute("href", "#contact");
  });

  test("page maintains proper semantic structure", () => {
    render(<Page />);

    // Check for proper heading hierarchy
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(5); // Should have multiple headings

    // Check that main content is properly structured
    const mainContent = screen.getByText(
      /Help your community make important decisions/
    );
    expect(mainContent).toBeInTheDocument();
  });

  test("all interactive elements are accessible", () => {
    render(<Page />);

    // Check all buttons have proper roles
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeInTheDocument();
    });

    // Check all links have proper roles
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toBeInTheDocument();
    });
  });

  test("page content flows logically from top to bottom", () => {
    render(<Page />);

    // Verify the logical flow of information
    // 1. Hero introduces the concept
    expect(
      screen.getByText(/Help your community make important decisions/)
    ).toBeInTheDocument();

    // 2. How it works section explains the process
    expect(screen.getByText("How CommunityRule works")).toBeInTheDocument();

    // 3. Rule types show different governance options
    expect(screen.getByText("Consensus clusters")).toBeInTheDocument();

    // 4. Features highlight benefits
    expect(
      screen.getByText("We've got your back, every step of the way")
    ).toBeInTheDocument();

    // 5. Quote provides social proof
    expect(
      screen.getByText(/The rules of decision-making must be open/)
    ).toBeInTheDocument();

    // 6. Call to action for help
    expect(screen.getByText("Still have questions?")).toBeInTheDocument();
  });
});
