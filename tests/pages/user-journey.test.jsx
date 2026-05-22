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
import Footer from "../../app/components/navigation/Footer";

vi.mock("next/dynamic", async () => {
  const { default: syncDynamic } = await import("../utils/mockNextDynamicSync.js");
  return { default: syncDynamic };
});

function renderPageWithFooter() {
  return render(
    <>
      <Page />
      <Footer />
    </>,
  );
}

function renderPage() {
  return render(<Page />);
}

afterEach(() => {
  cleanup();
});

describe("User Journey Integration", () => {
  test("new user discovers the application through hero section", async () => {
    const user = userEvent.setup();
    renderPageWithFooter();

    expect(
      screen.getByText(/Help your community make important decisions/),
    ).toBeInTheDocument();

    const learnLinks = screen.getAllByRole("link", {
      name: "Learn how CommunityRule works",
    });
    await user.click(learnLinks[0]);

    await waitFor(() => {
      expect(screen.getByText("How CommunityRule works")).toBeInTheDocument();
    });
  });

  test("user explores different governance types", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Circles")).toBeInTheDocument();
    });
    expect(screen.getByText("Elected Board")).toBeInTheDocument();
    expect(screen.getByText("Consensus")).toBeInTheDocument();
    expect(screen.getByText("Petition")).toBeInTheDocument();

    const seeHowLinks = screen.getAllByRole("link", {
      name: "See how it works",
    });
    expect(seeHowLinks.length).toBeGreaterThan(0);

    await user.click(seeHowLinks[0]);
    expect(seeHowLinks[0]).toBeInTheDocument();
  });

  test("user navigates through the application using header navigation", async () => {
    renderPageWithFooter();

    const navigationLinks = screen.getAllByRole("link");
    const headerNavLinks = navigationLinks.filter(
      (link) =>
        link.textContent?.includes("Use Cases") ||
        link.textContent?.includes("Learn") ||
        link.textContent?.includes("About"),
    );

    for (const link of headerNavLinks) {
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href");
    }
  });

  test("user seeks help through ask organizer section", async () => {
    const user = userEvent.setup();
    renderPage();

    expect(screen.getByText("Still have questions?")).toBeInTheDocument();
    expect(
      screen.getByText("Get answers from an experienced organizer"),
    ).toBeInTheDocument();

    const askCta = screen.getByTestId("ask-organizer-cta");
    await user.click(askCta);
    expect(
      await screen.findByRole("dialog", { name: /ask an organizer/i }),
    ).toBeInTheDocument();
  });

  test("user explores the process through CardSteps", async () => {
    renderPage();

    await waitFor(() => {
      expect(
        screen.getByText("Document how your community makes decisions"),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText("Build an operating manual for a successful community"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Get a link to your manual for your group to review and evolve",
      ),
    ).toBeInTheDocument();

    const stepNumbers = screen.getAllByText(/1|2|3/);
    expect(stepNumbers.length).toBeGreaterThan(0);
  });

  test("user accesses contact information through footer", async () => {
    renderPageWithFooter();

    const emailLink = screen.getByRole("link", { name: "medlab@colorado.edu" });
    expect(emailLink).toHaveAttribute("href", "mailto:medlab@colorado.edu");

    const blueskyLink = screen.getByRole("link", {
      name: "Follow us on Bluesky",
    });
    const gitlabLink = screen.getByRole("link", {
      name: "Follow us on GitLab",
    });

    expect(blueskyLink).toBeInTheDocument();
    expect(gitlabLink).toBeInTheDocument();
  });

  test("user explores features and benefits", async () => {
    renderPage();

    await waitFor(() => {
      expect(
        screen.getByText("We've got your back, every step of the way"),
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
  });

  test("user interacts with logo wall and social proof", async () => {
    renderPageWithFooter();

    await waitFor(() => {
      const logoImages = screen.getAllByRole("img");
      const partnerLogos = logoImages.filter(
        (img) =>
          img.alt?.includes("Food Not Bombs") ||
          img.alt?.includes("Start COOP") ||
          img.alt?.includes("Metagov") ||
          img.alt?.includes("Open Civics") ||
          img.alt?.includes("Mutual Aid CO") ||
          img.alt?.includes("CU Boulder"),
      );
      expect(partnerLogos.length).toBeGreaterThan(0);
    });

    const blueskyLink = screen.getByRole("link", { name: /Bluesky/i });
    const gitlabLink = screen.getByRole("link", { name: /GitLab/i });
    expect(blueskyLink).toBeInTheDocument();
    expect(gitlabLink).toBeInTheDocument();
  });

  test("user completes the full journey from discovery to action", async () => {
    renderPageWithFooter();

    expect(screen.getByText("Collaborate")).toBeInTheDocument();
    expect(screen.getByText("with clarity")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("How CommunityRule works")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByText(/Circles/i).length).toBeGreaterThan(0);
    });

    await waitFor(() => {
      expect(
        screen.getByText("We've got your back, every step of the way"),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(/The rules of decision-making must be open/),
    ).toBeInTheDocument();

    const seeHowLinks = screen.getAllByRole("link", {
      name: "See how it works",
    });
    expect(seeHowLinks.length).toBeGreaterThan(0);

    expect(screen.getByText("Still have questions?")).toBeInTheDocument();
  });

  test("user can access all navigation options consistently", async () => {
    renderPageWithFooter();

    const footerLinks = screen.getAllByRole("link");
    const navigationLinks = footerLinks.filter(
      (link) =>
        link.textContent?.includes("Use cases") ||
        link.textContent?.includes("Learn") ||
        link.textContent?.includes("About"),
    );
    expect(navigationLinks.length).toBeGreaterThan(0);

    navigationLinks.forEach((link) => {
      expect(link).not.toHaveAttribute("tabindex", "-1");
    });
  });

  test("user can complete actions without errors", async () => {
    const user = userEvent.setup();
    renderPageWithFooter();

    const buttons = screen.getAllByRole("button");
    const links = screen.getAllByRole("link");

    for (const button of buttons) {
      await user.click(button);
      expect(button).toBeInTheDocument();
    }

    for (const link of links) {
      expect(link).toBeInTheDocument();
      expect(link).not.toHaveAttribute("tabindex", "-1");
    }
  });
});
