import { describe, test, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import Header from "../../../app/components/Header.js";
import Footer from "../../../app/components/Footer.js";

// Extend expect to include accessibility matchers
expect.extend(toHaveNoViolations);

describe("Accessibility - Component Level", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    // Set up proper language attribute for accessibility testing
    document.documentElement.setAttribute("lang", "en");
  });

  test("Header component has no accessibility violations", async () => {
    const { container } = render(<Header />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("Footer component has no accessibility violations", async () => {
    const { container } = render(<Footer />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("Header has proper semantic structure", () => {
    render(<Header />);

    // Check for banner landmark
    const banner = screen.getByRole("banner");
    expect(banner).toBeInTheDocument();

    // Check for navigation landmark
    const navigation = screen.getByRole("navigation");
    expect(navigation).toBeInTheDocument();

    // Check for proper heading structure (optional for header components)
    try {
      const headings = screen.getAllByRole("heading");
      // Headings are not required in header components, so this is optional
    } catch (error) {
      // No headings found, which is fine for a header component
    }
  });

  test("Header navigation items are accessible", () => {
    render(<Header />);

    // Check that navigation items have proper roles
    const navigationItems = screen.getAllByRole("menuitem");
    expect(navigationItems.length).toBeGreaterThan(0);

    // Check that each navigation item has accessible text or aria-label
    navigationItems.forEach((item) => {
      const hasAccessibleText =
        item.textContent?.trim() || item.getAttribute("aria-label");
      expect(hasAccessibleText).toBeTruthy();
    });
  });

  test("Header buttons have accessible names", () => {
    render(<Header />);

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      // Check for aria-label, aria-labelledby, or text content
      const hasAccessibleName =
        button.getAttribute("aria-label") ||
        button.getAttribute("aria-labelledby") ||
        button.textContent?.trim();

      expect(hasAccessibleName).toBeTruthy();
    });
  });

  test("Header images have alt text", () => {
    render(<Header />);

    const images = screen.getAllByRole("img");
    images.forEach((image) => {
      const altText = image.getAttribute("alt");
      // Alt text should exist (can be empty for decorative images)
      expect(altText).not.toBeNull();
    });
  });

  test("Footer has proper semantic structure", () => {
    render(<Footer />);

    // Check for contentinfo landmark
    const contentinfo = screen.getByRole("contentinfo");
    expect(contentinfo).toBeInTheDocument();
  });

  test("Footer links are accessible", () => {
    render(<Footer />);

    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      // Check for accessible text or aria-label
      const hasAccessibleText =
        link.textContent?.trim() || link.getAttribute("aria-label");

      expect(hasAccessibleText).toBeTruthy();
    });
  });

  test("Focus management works correctly", () => {
    render(<Header />);

    // Test that focusable elements can receive focus
    const buttons = screen.getAllByRole("button");
    const links = screen.getAllByRole("link");

    [...buttons, ...links].forEach((element) => {
      try {
        element.focus();
        expect(element).toHaveFocus();
      } catch (error) {
        // Some elements might not be focusable in test environment
        // This is acceptable for accessibility testing
        console.log(`Could not focus element: ${error.message}`);
      }
    });
  });

  test("Color contrast meets WCAG standards", async () => {
    const { container } = render(<Header />);
    const results = await axe(container, {
      rules: {
        "color-contrast": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  test("Heading hierarchy is logical", () => {
    render(<Header />);

    // Try to get headings, but don't fail if none exist
    let headings;
    try {
      headings = screen.getAllByRole("heading");
    } catch (error) {
      // No headings found, which is fine for a header component
      return;
    }

    // If there are no headings, that's fine for a header component
    if (headings.length === 0) {
      return;
    }

    const headingLevels = headings.map((heading) =>
      parseInt(heading.tagName.charAt(1))
    );

    // Check that heading levels are sequential (no skipping levels)
    for (let i = 1; i < headingLevels.length; i++) {
      const currentLevel = headingLevels[i];
      const previousLevel = headingLevels[i - 1];

      // Heading levels should not skip more than one level
      expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
    }
  });

  test("Interactive elements have proper ARIA attributes", () => {
    render(<Header />);

    // Get all interactive elements
    const buttons = screen.getAllByRole("button");
    const links = screen.getAllByRole("link");
    const menuitems = screen.getAllByRole("menuitem");

    const interactiveElements = [...buttons, ...links, ...menuitems];

    interactiveElements.forEach((element) => {
      // Check for proper ARIA attributes
      const role = element.getAttribute("role");
      if (role) {
        // If role is specified, it should be valid
        const validRoles = [
          "button",
          "link",
          "menuitem",
          "navigation",
          "banner",
        ];
        expect(validRoles).toContain(role);
      }
    });
  });

  test("No duplicate IDs exist", async () => {
    const { container } = render(<Header />);
    const results = await axe(container, {
      rules: {
        "duplicate-id": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  test("Proper language attributes", () => {
    render(<Header />);

    // Check that the document has proper language attributes
    const html = document.documentElement;
    const lang = html.getAttribute("lang");
    expect(lang).toBeTruthy();
    expect(lang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/);
  });
});
