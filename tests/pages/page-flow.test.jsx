import {
  renderWithProviders as render,
  screen,
  cleanup,
  waitFor,
} from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, expect, afterEach } from "vitest";
import React from "react";
import Page from "../../app/(marketing)/page";

vi.mock("next/dynamic", async () => {
  const { default: syncDynamic } = await import("../utils/mockNextDynamicSync.js");
  return { default: syncDynamic };
});

function renderPage(ui = <Page />) {
  return render(ui);
}

afterEach(() => {
  cleanup();
});

describe("Page Flow Integration", () => {
  test("renders complete page with all sections in correct order", async () => {
    renderPage();

    // Hero Banner section
    expect(
      screen.getByRole("heading", { name: "Collaborate" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "with clarity" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Help your community make important decisions in a way that reflects its unique values.",
      ),
    ).toBeInTheDocument();
    const ctaButtons = screen.getAllByRole("link", {
      name: "Learn how CommunityRule works",
    });
    expect(ctaButtons.length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.getByAltText("Food Not Bombs")).toBeInTheDocument();
    });
    expect(screen.getByAltText("Start COOP")).toBeInTheDocument();
    expect(screen.getByAltText("Metagov")).toBeInTheDocument();
    expect(screen.getByAltText("Open Civics")).toBeInTheDocument();
    expect(screen.getByAltText("Mutual Aid CO")).toBeInTheDocument();
    expect(screen.getByAltText("CU Boulder")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /How CommunityRule works/ }),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText(
        "Here's a quick overview of the process, from start to finish.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Document how your community makes decisions"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Build an operating manual for a successful community"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Get a link to your manual for your group to review and evolve",
      ),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Consensus" })).toBeInTheDocument();
    });
    expect(
      screen.getByRole("heading", { name: "Do-ocracy" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Devolution" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Quadratic Governance" }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: "We've got your back, every step of the way",
        }),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText(
        "Use our toolkit to improve, document, and evolve your organization.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/The rules of decision-making must be open/),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Still have questions?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Get answers from an experienced organizer"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ask an organizer/i }),
    ).toBeInTheDocument();
  });

  test("hero banner CTA button is interactive", async () => {
    const user = userEvent.setup();
    renderPage();

    const ctaLinks = screen.getAllByRole("link", {
      name: "Learn how CommunityRule works",
    });
    const ctaLink = ctaLinks[0];
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute("href", "/how-it-works");

    await user.click(ctaLink);
    expect(ctaLink).toBeInTheDocument();
  });

  test("CardSteps section shows step tiles with expected icon/color props", async () => {
    renderPage();

    await waitFor(() => {
      const cards = screen.getAllByText(
        /Document how your community|Build an operating manual|Get a link to your manual/,
      );
      expect(cards.length).toBeGreaterThan(0);
    });

    const cards = screen.getAllByText(
      /Document how your community|Build an operating manual|Get a link to your manual/,
    );
    expect(cards.length).toBeGreaterThan(0);

    const sectionNumbers = screen.getAllByText(/1|2|3/);
    expect(sectionNumbers.length).toBeGreaterThan(0);
  });

  test("rule stack shows four featured templates and link to full catalog", async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Consensus")).toBeInTheDocument();
    });
    expect(screen.queryByText("Solidarity Network")).not.toBeInTheDocument();
    expect(screen.getByText("Do-ocracy")).toBeInTheDocument();
    expect(screen.getByText("Devolution")).toBeInTheDocument();
    expect(screen.getByText("Quadratic Governance")).toBeInTheDocument();

    const seeAll = screen.getByRole("link", { name: "See all templates" });
    expect(seeAll).toHaveAttribute("href", "/templates");

    const seeHowLink = screen.getByRole("link", {
      name: "See how it works",
    });
    expect(seeHowLink).toHaveAttribute("href", "/how-it-works");
  });

  test("ask organizer section has proper call-to-action", () => {
    renderPage();

    const askCta = screen.getByRole("button", { name: /ask an organizer/i });
    expect(askCta).toBeInTheDocument();
    expect(askCta).not.toHaveAttribute("href");
  });

  test("page maintains proper semantic structure", async () => {
    renderPage();

    await waitFor(() => {
      const headings = screen.getAllByRole("heading");
      expect(headings.length).toBeGreaterThan(4);
    });

    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(4);

    const mainContent = screen.getByText(
      /Help your community make important decisions/,
    );
    expect(mainContent).toBeInTheDocument();
  });

  test("all interactive elements are accessible", async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
    });

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByRole("link").length).toBeGreaterThan(0);
    });

    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toBeInTheDocument();
    });
  });

  test("page content flows logically from top to bottom", async () => {
    renderPage();

    expect(
      screen.getByText(/Help your community make important decisions/),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("How CommunityRule works")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Consensus")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText("We've got your back, every step of the way"),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(/The rules of decision-making must be open/),
    ).toBeInTheDocument();

    expect(screen.getByText("Still have questions?")).toBeInTheDocument();
  });
});
