import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header, {
  navigationItems,
  avatarImages,
  logoConfig,
} from "../../app/components/Header.js";

describe("Header", () => {
  beforeEach(() => {
    // Clear any existing rendered content
    document.body.innerHTML = "";
  });

  describe("Accessibility and Landmarks", () => {
    test("renders header with correct structure and accessibility attributes", () => {
      const { container } = render(<Header />);

      // Check main header structure - use container to scope the search
      const header = container.querySelector(
        '[role="banner"][aria-label="Main navigation header"]'
      );
      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute("aria-label", "Main navigation header");

      // Check navigation - use container to scope the search
      const nav = container.querySelector(
        '[role="navigation"][aria-label="Main navigation"]'
      );
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute("aria-label", "Main navigation");
    });

    test("renders all navigation items with proper accessibility", () => {
      render(<Header />);

      // Check all navigation items have proper aria-labels - use menuitem role since they're in a menubar
      expect(
        screen.getAllByRole("menuitem", { name: "Navigate to Use cases page" })
          .length
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByRole("menuitem", { name: "Navigate to Learn page" })
          .length
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByRole("menuitem", { name: "Navigate to About page" })
          .length
      ).toBeGreaterThan(0);
    });
  });

  describe("Schema Markup", () => {
    test("renders schema markup for site navigation", () => {
      render(<Header />);

      const script = document.querySelector(
        'script[type="application/ld+json"]'
      );
      expect(script).toBeInTheDocument();

      const schemaData = JSON.parse(script.textContent);
      expect(schemaData["@type"]).toBe("WebSite");
      expect(schemaData.name).toBe("CommunityRule");
      expect(schemaData.url).toBe("https://communityrule.com");
      expect(schemaData.potentialAction["@type"]).toBe("SearchAction");
    });
  });

  describe("Configuration Data", () => {
    test("navigationItems has correct structure and count", () => {
      expect(navigationItems).toHaveLength(3);
      expect(navigationItems[0]).toEqual({
        href: "#",
        text: "Use cases",
        extraPadding: true,
      });
      expect(navigationItems[1]).toEqual({
        href: "/learn",
        text: "Learn",
      });
      expect(navigationItems[2]).toEqual({
        href: "#",
        text: "About",
      });
    });

    test("avatarImages has correct structure and count", () => {
      expect(avatarImages).toHaveLength(3);
      expect(avatarImages[0]).toEqual({
        src: "/assets/Avatar_1.png",
        alt: "Avatar 1",
      });
      expect(avatarImages[1]).toEqual({
        src: "/assets/Avatar_2.png",
        alt: "Avatar 2",
      });
      expect(avatarImages[2]).toEqual({
        src: "/assets/Avatar_3.png",
        alt: "Avatar 3",
      });
    });

    test("logoConfig has correct structure and count", () => {
      expect(logoConfig).toHaveLength(5);

      // Check first config (xs)
      expect(logoConfig[0]).toEqual({
        breakpoint: "block sm:hidden",
        size: "header",
        showText: false,
      });

      // Check last config (xl+)
      expect(logoConfig[4]).toEqual({
        breakpoint: "hidden xl:block",
        size: "headerXl",
        showText: true,
      });
    });
  });

  describe("Logo Configuration", () => {
    test("renders correct number of logo variants", () => {
      render(<Header />);

      const logoWrappers = screen.getAllByTestId("logo-wrapper");
      expect(logoWrappers).toHaveLength(logoConfig.length);
    });

    test("logo wrappers include expected breakpoint classes", () => {
      render(<Header />);

      const logoWrappers = screen.getAllByTestId("logo-wrapper");

      // Check first logo variant (xs only)
      expect(logoWrappers[0]).toHaveClass("block", "sm:hidden");

      // Check second logo variant (sm only)
      expect(logoWrappers[1]).toHaveClass("hidden", "sm:block", "md:hidden");

      // Check third logo variant (md only)
      expect(logoWrappers[2]).toHaveClass("hidden", "md:block", "lg:hidden");

      // Check fourth logo variant (lg only)
      expect(logoWrappers[3]).toHaveClass("hidden", "lg:block", "xl:hidden");

      // Check fifth logo variant (xl+)
      expect(logoWrappers[4]).toHaveClass("hidden", "xl:block");
    });
  });

  describe("Navigation Structure", () => {
    test("renders all breakpoint-specific navigation containers", () => {
      render(<Header />);

      expect(screen.getByTestId("nav-xs")).toBeInTheDocument();
      expect(screen.getByTestId("nav-sm")).toBeInTheDocument();
      expect(screen.getByTestId("nav-md")).toBeInTheDocument();
      expect(screen.getByTestId("nav-lg")).toBeInTheDocument();
      expect(screen.getByTestId("nav-xl")).toBeInTheDocument();
    });

    test("navigation containers use expected breakpoint classes", () => {
      render(<Header />);

      // XSmall navigation
      const navXs = screen.getByTestId("nav-xs");
      expect(navXs).toHaveClass("block", "sm:hidden");

      // Small navigation
      const navSm = screen.getByTestId("nav-sm");
      expect(navSm).toHaveClass("hidden", "sm:block", "md:hidden");

      // Medium navigation
      const navMd = screen.getByTestId("nav-md");
      expect(navMd).toHaveClass("hidden", "md:block", "lg:hidden");

      // Large navigation
      const navLg = screen.getByTestId("nav-lg");
      expect(navLg).toHaveClass("hidden", "lg:block", "xl:hidden");

      // XLarge navigation
      const navXl = screen.getByTestId("nav-xl");
      expect(navXl).toHaveClass("hidden", "xl:block");
    });

    test("renders navigation items with correct text and links", () => {
      render(<Header />);

      // Check navigation items
      expect(screen.getAllByText("Use cases").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Learn").length).toBeGreaterThan(0);
      expect(screen.getAllByText("About").length).toBeGreaterThan(0);
    });

    test("renders multiple instances of navigation items for responsive design", () => {
      render(<Header />);

      // Should have multiple instances of navigation items for different breakpoints
      const useCasesLinks = screen.getAllByText("Use cases");
      const learnLinks = screen.getAllByText("Learn");
      const aboutLinks = screen.getAllByText("About");

      expect(useCasesLinks.length).toBeGreaterThan(1);
      expect(learnLinks.length).toBeGreaterThan(1);
      expect(aboutLinks.length).toBeGreaterThan(1);
    });
  });

  describe("Authentication Structure", () => {
    test("renders all breakpoint-specific auth containers", () => {
      render(<Header />);

      expect(screen.getByTestId("auth-xs")).toBeInTheDocument();
      expect(screen.getByTestId("auth-sm")).toBeInTheDocument();
      expect(screen.getByTestId("auth-md")).toBeInTheDocument();
      expect(screen.getByTestId("auth-lg")).toBeInTheDocument();
      expect(screen.getByTestId("auth-xl")).toBeInTheDocument();
    });

    test("auth containers use expected breakpoint classes", () => {
      render(<Header />);

      // XSmall auth
      const authXs = screen.getByTestId("auth-xs");
      expect(authXs).toHaveClass("block", "sm:hidden");

      // Small auth
      const authSm = screen.getByTestId("auth-sm");
      expect(authSm).toHaveClass("hidden", "sm:block", "md:hidden");

      // Medium auth
      const authMd = screen.getByTestId("auth-md");
      expect(authMd).toHaveClass("hidden", "md:block", "lg:hidden");

      // Large auth
      const authLg = screen.getByTestId("auth-lg");
      expect(authLg).toHaveClass("hidden", "lg:block", "xl:hidden");

      // XLarge auth
      const authXl = screen.getByTestId("auth-xl");
      expect(authXl).toHaveClass("hidden", "xl:block");
    });

    test("renders login button with correct accessibility", () => {
      render(<Header />);

      const loginLinks = screen.getAllByRole("menuitem", {
        name: "Log in to your account",
      });
      expect(loginLinks.length).toBeGreaterThan(0);
      expect(screen.getAllByText("Log in").length).toBeGreaterThan(0);
    });

    test("renders multiple login buttons for responsive design", () => {
      render(<Header />);

      // Should have multiple login buttons for different breakpoints
      const loginButtons = screen.getAllByText("Log in");
      expect(loginButtons.length).toBeGreaterThan(1);
    });

    test("renders create rule button with avatar decoration", () => {
      render(<Header />);

      const createRuleButtons = screen.getAllByRole("button", {
        name: "Create a new rule with avatar decoration",
      });
      expect(createRuleButtons.length).toBeGreaterThan(0);
      expect(screen.getAllByText("Create rule").length).toBeGreaterThan(0);
    });

    test("renders multiple create rule buttons for responsive design", () => {
      render(<Header />);

      // Should have multiple create rule buttons for different breakpoints
      const createRuleButtons = screen.getAllByText("Create rule");
      expect(createRuleButtons.length).toBeGreaterThan(1);
    });
  });

  describe("Avatar Images", () => {
    test("renders avatar images with correct attributes", () => {
      render(<Header />);

      const avatars = screen.getAllByRole("img");
      expect(avatars.length).toBeGreaterThan(0);

      // Check for avatar images
      const avatarImages = avatars.filter(
        (img) =>
          img.alt === "Avatar 1" ||
          img.alt === "Avatar 2" ||
          img.alt === "Avatar 3"
      );
      expect(avatarImages.length).toBeGreaterThan(0);
    });
  });

  describe("Sticky Header Behavior", () => {
    test("applies sticky positioning classes", () => {
      const { container } = render(<Header />);

      const header = container.querySelector(
        '[role="banner"][aria-label="Main navigation header"]'
      );
      expect(header).toHaveClass("sticky", "top-0", "z-50");
    });
  });

  describe("CSS Classes and Styling", () => {
    test("has correct CSS classes for styling", () => {
      const { container } = render(<Header />);

      const header = container.querySelector(
        '[role="banner"][aria-label="Main navigation header"]'
      );
      expect(header).toHaveClass("bg-[var(--color-surface-default-primary)]");
      expect(header).toHaveClass("w-full");
      expect(header).toHaveClass("border-b");
      expect(header).toHaveClass(
        "border-[var(--border-color-default-tertiary)]"
      );

      const nav = container.querySelector(
        '[role="navigation"][aria-label="Main navigation"]'
      );
      expect(nav).toHaveClass("flex");
      expect(nav).toHaveClass("items-center");
      expect(nav).toHaveClass("justify-between");
    });
  });
});
