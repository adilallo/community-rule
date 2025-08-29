import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Footer from "../../app/components/Footer";

describe("Footer", () => {
  test("renders footer with correct structure", () => {
    render(<Footer />);

    const footers = screen.getAllByRole("contentinfo");
    expect(footers.length).toBeGreaterThan(0);
    const footer = footers[0];
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass("bg-[var(--color-surface-default-primary)]");
    expect(footer).toHaveClass("w-full");
  });

  test("renders schema markup for organization information", () => {
    render(<Footer />);

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const schemaData = JSON.parse(script.textContent);
    expect(schemaData["@type"]).toBe("Organization");
    expect(schemaData.name).toBe("Media Economies Design Lab");
    expect(schemaData.email).toBe("medlab@colorado.edu");
    expect(schemaData.url).toBe("https://communityrule.com");
    expect(schemaData.sameAs).toContain(
      "https://bsky.app/profile/medlabboulder"
    );
    expect(schemaData.sameAs).toContain("https://gitlab.com/medlabboulder");
  });

  test("renders organization name and contact information", () => {
    render(<Footer />);

    expect(
      screen.getAllByText("Media Economies Design Lab").length
    ).toBeGreaterThan(0);

    const emailLinks = screen.getAllByRole("link", {
      name: "medlab@colorado.edu",
    });
    expect(emailLinks.length).toBeGreaterThan(0);
    const emailLink = emailLinks[0];
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:medlab@colorado.edu");
  });

  test("renders social media links with correct accessibility", () => {
    render(<Footer />);

    // Check Bluesky link
    const blueskyLinks = screen.getAllByRole("link", {
      name: "Follow us on Bluesky",
    });
    expect(blueskyLinks.length).toBeGreaterThan(0);
    const blueskyLink = blueskyLinks[0];
    expect(blueskyLink).toBeInTheDocument();
    expect(screen.getAllByText("medlabboulder").length).toBeGreaterThan(0);

    // Check GitLab link
    const gitlabLinks = screen.getAllByRole("link", {
      name: "Follow us on GitLab",
    });
    expect(gitlabLinks.length).toBeGreaterThan(0);
    const gitlabLink = gitlabLinks[0];
    expect(gitlabLink).toBeInTheDocument();

    // Check social media images
    const blueskyImages = screen.getAllByAltText("Bluesky");
    expect(blueskyImages.length).toBeGreaterThan(0);
    const blueskyImage = blueskyImages[0];
    expect(blueskyImage).toBeInTheDocument();
    expect(blueskyImage).toHaveAttribute("src", "assets/Bluesky_Logo.svg");

    const gitlabImages = screen.getAllByAltText("GitLab");
    expect(gitlabImages.length).toBeGreaterThan(0);
    const gitlabImage = gitlabImages[0];
    expect(gitlabImage).toBeInTheDocument();
    expect(gitlabImage).toHaveAttribute("src", "assets/GitLab_Icon.png");
  });

  test("renders navigation links", () => {
    render(<Footer />);

    expect(
      screen.getAllByRole("link", { name: "Use cases" }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: "Learn" }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: "About" }).length
    ).toBeGreaterThan(0);
  });

  test("renders legal links", () => {
    render(<Footer />);

    expect(
      screen.getAllByRole("link", { name: "Privacy Policy" }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: "Terms of Service" }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: "Cookies Settings" }).length
    ).toBeGreaterThan(0);
  });

  test("renders copyright information", () => {
    render(<Footer />);

    expect(screen.getAllByText("© All right reserved").length).toBeGreaterThan(
      0
    );
  });

  test("renders responsive logo configurations", () => {
    render(<Footer />);

    // Check that logo containers exist for different breakpoints
    const logoContainers = document.querySelectorAll(
      '[class*="block sm:hidden"], [class*="hidden sm:block lg:hidden"], [class*="hidden lg:block"]'
    );
    expect(logoContainers.length).toBeGreaterThan(0);
  });

  test("has correct CSS classes for responsive design", () => {
    render(<Footer />);

    const footers = screen.getAllByRole("contentinfo");
    expect(footers.length).toBeGreaterThan(0);
    const footer = footers[0];
    const mainContainer = footer.querySelector("div");

    expect(mainContainer).toHaveClass("flex");
    expect(mainContainer).toHaveClass("flex-col");
    expect(mainContainer).toHaveClass("items-start");
    expect(mainContainer).toHaveClass("mx-auto");
  });

  test("renders separator component", () => {
    render(<Footer />);

    // The Separator component should be rendered (it uses a div with border, not hr)
    const separator = document.querySelector(
      ".bg-\\[var\\(--border-color-default-secondary\\)\\]"
    );
    expect(separator).toBeInTheDocument();
  });

  test("social media links have hover and focus states", () => {
    render(<Footer />);

    const blueskyLinks = screen.getAllByRole("link", {
      name: "Follow us on Bluesky",
    });
    expect(blueskyLinks.length).toBeGreaterThan(0);
    expect(blueskyLinks[0]).toHaveClass("hover:opacity-80");
    expect(blueskyLinks[0]).toHaveClass("active:opacity-60");
    expect(blueskyLinks[0]).toHaveClass("focus:opacity-80");
    expect(blueskyLinks[0]).toHaveClass("transition-opacity");

    const gitlabLinks = screen.getAllByRole("link", {
      name: "Follow us on GitLab",
    });
    expect(gitlabLinks.length).toBeGreaterThan(0);
    expect(gitlabLinks[0]).toHaveClass("hover:opacity-80");
    expect(gitlabLinks[0]).toHaveClass("active:opacity-60");
    expect(gitlabLinks[0]).toHaveClass("focus:opacity-80");
    expect(gitlabLinks[0]).toHaveClass("transition-opacity");
  });

  test("navigation links have hover and focus states", () => {
    render(<Footer />);

    const useCasesLinks = screen.getAllByRole("link", { name: "Use cases" });
    expect(useCasesLinks.length).toBeGreaterThan(0);
    expect(useCasesLinks[0]).toHaveClass("hover:opacity-80");
    expect(useCasesLinks[0]).toHaveClass("active:opacity-60");
    expect(useCasesLinks[0]).toHaveClass("focus:opacity-80");
    expect(useCasesLinks[0]).toHaveClass("transition-opacity");
  });

  test("legal links have hover and focus states", () => {
    render(<Footer />);

    const privacyLinks = screen.getAllByRole("link", {
      name: "Privacy Policy",
    });
    expect(privacyLinks.length).toBeGreaterThan(0);
    expect(privacyLinks[0]).toHaveClass("hover:opacity-80");
    expect(privacyLinks[0]).toHaveClass("active:opacity-60");
    expect(privacyLinks[0]).toHaveClass("focus:opacity-80");
    expect(privacyLinks[0]).toHaveClass("transition-opacity");
  });

  test("email link has hover and focus states", () => {
    render(<Footer />);

    const emailLinks = screen.getAllByRole("link", {
      name: "medlab@colorado.edu",
    });
    expect(emailLinks.length).toBeGreaterThan(0);
    expect(emailLinks[0]).toHaveClass("hover:opacity-80");
    expect(emailLinks[0]).toHaveClass("active:opacity-60");
    expect(emailLinks[0]).toHaveClass("focus:opacity-80");
    expect(emailLinks[0]).toHaveClass("transition-opacity");
  });

  test("social media images have hover effects", () => {
    render(<Footer />);

    const blueskyImages = screen.getAllByAltText("Bluesky");
    expect(blueskyImages.length).toBeGreaterThan(0);
    expect(blueskyImages[0]).toHaveClass("group-hover:scale-110");
    expect(blueskyImages[0]).toHaveClass("transition-transform");

    const gitlabImages = screen.getAllByAltText("GitLab");
    expect(gitlabImages.length).toBeGreaterThan(0);
    expect(gitlabImages[0]).toHaveClass("group-hover:scale-110");
    expect(gitlabImages[0]).toHaveClass("transition-transform");
    expect(gitlabImages[0]).toHaveClass("grayscale");
  });

  test("renders multiple instances of navigation links for responsive design", () => {
    render(<Footer />);

    // Should have navigation links in the footer
    const useCasesLinks = screen.getAllByText("Use cases");
    const learnLinks = screen.getAllByText("Learn");
    const aboutLinks = screen.getAllByText("About");

    expect(useCasesLinks.length).toBeGreaterThan(0);
    expect(learnLinks.length).toBeGreaterThan(0);
    expect(aboutLinks.length).toBeGreaterThan(0);
  });

  test("has proper focus management for accessibility", () => {
    render(<Footer />);

    // Get specific links that should have focus management
    const emailLink = screen.getByRole("link", { name: "medlab@colorado.edu" });
    const blueskyLink = screen.getByRole("link", {
      name: "Follow us on Bluesky",
    });
    const gitlabLink = screen.getByRole("link", {
      name: "Follow us on GitLab",
    });

    // Check email link
    expect(emailLink).toHaveClass("focus:outline-none");
    expect(emailLink).toHaveClass("focus:ring-2");
    expect(emailLink).toHaveClass("focus:ring-offset-2");
    expect(emailLink).toHaveClass(
      "focus:ring-[var(--color-content-default-primary)]"
    );
    expect(emailLink).toHaveClass(
      "focus:ring-offset-[var(--color-surface-default-primary)]"
    );

    // Check social media links
    [blueskyLink, gitlabLink].forEach((link) => {
      expect(link).toHaveClass("focus:outline-none");
      expect(link).toHaveClass("focus:ring-2");
      expect(link).toHaveClass("focus:ring-offset-2");
      expect(link).toHaveClass(
        "focus:ring-[var(--color-content-default-primary)]"
      );
      expect(link).toHaveClass(
        "focus:ring-offset-[var(--color-surface-default-primary)]"
      );
    });
  });
});
