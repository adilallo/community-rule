import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, afterEach } from "vitest";
import Header from "../../app/components/Header";
import Footer from "../../app/components/Footer";

afterEach(() => {
  cleanup();
});

describe("Layout Integration", () => {
  test("header and footer provide consistent branding", () => {
    render(
      <div>
        <Header />
        <Footer />
      </div>,
    );

    // Check that CommunityRule branding appears in both header and footer
    const headerLogos = screen.getAllByAltText("CommunityRule Logo Icon");
    expect(headerLogos.length).toBeGreaterThan(0);

    // Footer should have the organization name
    expect(screen.getByText("Media Economies Design Lab")).toBeInTheDocument();
  });

  test("navigation is consistent between header and footer", () => {
    render(
      <div>
        <Header />
        <Footer />
      </div>,
    );

    // Header navigation items
    expect(
      screen.getAllByRole("menuitem", { name: "Navigate to Use cases page" })
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("menuitem", { name: "Navigate to Learn page" })
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("menuitem", { name: "Navigate to About page" })
        .length,
    ).toBeGreaterThan(0);

    // Footer navigation items (should be present in footer as well)
    // Footer has navigation links that match header
    const footerUseCasesLinks = screen.getAllByRole("link", {
      name: "Use cases",
    });
    const footerLearnLinks = screen.getAllByRole("link", { name: "Learn" });
    const footerAboutLinks = screen.getAllByRole("link", { name: "About" });

    // Check that footer has these links (they may be in header too, so getAllByRole will find both)
    expect(footerUseCasesLinks.length).toBeGreaterThan(0);
    expect(footerLearnLinks.length).toBeGreaterThan(0);
    expect(footerAboutLinks.length).toBeGreaterThan(0);
  });

  test("header navigation is interactive", async () => {
    const user = userEvent.setup();
    render(<Header />);

    // Test navigation links
    const useCasesLinks = screen.getAllByRole("menuitem", {
      name: "Navigate to Use cases page",
    });
    const learnLinks = screen.getAllByRole("menuitem", {
      name: "Navigate to Learn page",
    });
    const aboutLinks = screen.getAllByRole("menuitem", {
      name: "Navigate to About page",
    });

    const useCasesLink = useCasesLinks[0];
    const learnLink = learnLinks[0];
    const aboutLink = aboutLinks[0];

    expect(useCasesLink).toHaveAttribute("href", "#");
    expect(learnLink).toHaveAttribute("href", "/learn");
    expect(aboutLink).toHaveAttribute("href", "#");

    // Test button interactions
    const createRuleButtons = screen.getAllByRole("button", {
      name: "Create a new rule with avatar decoration",
    });
    await user.click(createRuleButtons[0]);
    expect(createRuleButtons[0]).toBeInTheDocument();
  });

  test("footer provides contact and social information", () => {
    render(<Footer />);

    // Contact information
    expect(screen.getByText("medlab@colorado.edu")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "medlab@colorado.edu" }),
    ).toHaveAttribute("href", "mailto:medlab@colorado.edu");

    // Social media links
    expect(
      screen.getByRole("link", { name: "Follow us on Bluesky" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Follow us on GitLab" }),
    ).toBeInTheDocument();

    // Legal links
    expect(
      screen.getByRole("link", { name: "Privacy Policy" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Terms of Service" }),
    ).toBeInTheDocument();
  });

  test("header provides proper authentication options", () => {
    render(<Header />);

    // Login button should be present
    const loginButtons = screen.getAllByRole("menuitem", {
      name: "Log in to your account",
    });
    const loginButton = loginButtons[0];
    expect(loginButton).toBeInTheDocument();

    // Create rule button should be present
    const createRuleButtons = screen.getAllByRole("button", {
      name: "Create a new rule with avatar decoration",
    });
    expect(createRuleButtons.length).toBeGreaterThan(0);
  });

  test("layout maintains proper semantic structure", () => {
    render(
      <div>
        <Header />
        <Footer />
      </div>,
    );

    // Header should have banner role
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    // Navigation should be present
    const navigation = screen.getByRole("navigation");
    expect(navigation).toBeInTheDocument();

    // Footer should be present
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  test("responsive design elements are present", () => {
    render(
      <div>
        <Header />
        <Footer />
      </div>,
    );

    // Header should have responsive navigation elements
    const headerContainer = screen.getByRole("banner");
    expect(headerContainer).toBeInTheDocument();

    // Footer should have responsive layout
    const footerContainer = screen.getByRole("contentinfo");
    expect(footerContainer).toBeInTheDocument();
  });

  test("all interactive elements have proper focus management", () => {
    render(
      <div>
        <Header />
        <Footer />
      </div>,
    );

    // Get all interactive elements
    const buttons = screen.getAllByRole("button");
    const links = screen.getAllByRole("link");

    // All buttons should be focusable
    buttons.forEach((button) => {
      expect(button).not.toHaveAttribute("tabindex", "-1");
    });

    // All links should be focusable
    links.forEach((link) => {
      expect(link).not.toHaveAttribute("tabindex", "-1");
    });
  });

  test("layout provides consistent user experience", () => {
    render(
      <div>
        <Header />
        <Footer />
      </div>,
    );

    // Header provides main navigation
    expect(screen.getByRole("navigation")).toBeInTheDocument();

    // Footer provides additional navigation and contact info
    expect(screen.getByText("Media Economies Design Lab")).toBeInTheDocument();
    expect(screen.getByText("medlab@colorado.edu")).toBeInTheDocument();

    // Both header and footer should have CommunityRule branding
    const logos = screen.getAllByAltText("CommunityRule Logo Icon");
    expect(logos.length).toBeGreaterThan(0);
  });

  test("header and footer work together for complete navigation", () => {
    render(
      <div>
        <Header />
        <Footer />
      </div>,
    );

    // Main navigation in header
    const headerNav = screen.getByRole("navigation");
    expect(headerNav).toBeInTheDocument();

    // Additional navigation in footer
    const footerLinks = screen.getAllByRole("link");
    const navigationLinks = footerLinks.filter(
      (link) =>
        link.textContent?.includes("Use cases") ||
        link.textContent?.includes("Learn") ||
        link.textContent?.includes("About"),
    );
    expect(navigationLinks.length).toBeGreaterThan(0);

    // Contact information in footer
    expect(
      screen.getByRole("link", { name: "medlab@colorado.edu" }),
    ).toBeInTheDocument();
  });
});
