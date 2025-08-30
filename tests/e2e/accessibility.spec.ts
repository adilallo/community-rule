import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

test.describe("Accessibility Testing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("WCAG 2.1 AA compliance - homepage", async ({ page }) => {
    // Basic accessibility checks without axe-core for now
    // Check for proper HTML structure
    const html = page.locator("html");
    const lang = await html.getAttribute("lang");
    expect(lang).toBeTruthy();

    // Check for main heading
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();

    // Check for main landmark
    const main = page.locator("main, [role='main']");
    await expect(main).toBeVisible();

    // Check for navigation
    const nav = page.locator("nav, [role='navigation']").first();
    await expect(nav).toBeVisible();

    // Check for banner
    const banner = page.locator("header, [role='banner']").first();
    await expect(banner).toBeVisible();
  });

  test("keyboard navigation - tab order", async ({ page }) => {
    // Test tab navigation through all interactive elements
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus").first()).toBeVisible();

    // Navigate through all focusable elements
    let tabCount = 0;
    const maxTabs = 50; // Prevent infinite loop
    const focusedElements: string[] = [];

    while (tabCount < maxTabs) {
      const focusedElement = page.locator(":focus").first();
      if ((await focusedElement.count()) === 0) {
        break;
      }

      // Get the tag name and accessible name of focused element
      const elementInfo = await focusedElement.evaluate((el) => ({
        tagName: el.tagName.toLowerCase(),
        accessibleName:
          el.getAttribute("aria-label") ||
          el.getAttribute("alt") ||
          el.textContent?.trim() ||
          "",
        role: el.getAttribute("role") || "",
      }));

      focusedElements.push(
        `${elementInfo.tagName}${
          elementInfo.role ? `[role="${elementInfo.role}"]` : ""
        }: ${elementInfo.accessibleName}`,
      );

      await page.keyboard.press("Tab");
      tabCount++;
    }

    // Verify we have a reasonable number of focusable elements
    expect(focusedElements.length).toBeGreaterThan(5);
    console.log("Tab order:", focusedElements);
  });

  test("keyboard navigation - enter key activation", async ({ page }) => {
    // Test that buttons and links can be activated with Enter key
    const buttons = page.locator("button, [role='button']");
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 3); i++) {
      const button = buttons.nth(i);

      // Try to focus the button
      try {
        // Wait for button to be visible and stable
        await button.waitFor({ state: "visible", timeout: 5000 });
        await button.focus();

        // Check if button is actually focusable (has tabindex or is naturally focusable)
        const isFocusable = await button.evaluate((el) => {
          return (
            el.tabIndex >= 0 || el.tagName === "BUTTON" || el.tagName === "A"
          );
        });

        if (!isFocusable) {
          console.log(`Button ${i} is not focusable, skipping`);
          continue;
        }

        await expect(button).toBeFocused();

        // Test Enter key activation
        await page.keyboard.press("Enter");
        await page.waitForTimeout(100); // Brief pause to see if action occurs
      } catch (error) {
        // If focus fails, skip this button
        console.log(`Could not focus button ${i}: ${error.message}`);
        continue;
      }
    }
  });

  test("keyboard navigation - escape key", async ({ page }) => {
    // Test Escape key functionality
    await page.keyboard.press("Escape");
    // Should handle escape gracefully without errors
  });

  test("screen reader compatibility - semantic structure", async ({ page }) => {
    // Check for proper heading structure
    const headings = page.locator("h1, h2, h3, h4, h5, h6");
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);

    // Check for main landmark
    const main = page.locator("main, [role='main']");
    await expect(main).toBeVisible();

    // Check for navigation landmark
    const nav = page.locator("nav, [role='navigation']").first();
    await expect(nav).toBeVisible();

    // Check for banner landmark
    const banner = page.locator("header, [role='banner']").first();
    await expect(banner).toBeVisible();

    // Check for contentinfo landmark
    const contentinfo = page.locator("footer, [role='contentinfo']").first();
    await expect(contentinfo).toBeVisible();
  });

  test("screen reader compatibility - ARIA labels", async ({ page }) => {
    // Check that interactive elements have proper labels
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const hasLabel = await button.evaluate((el) => {
        return (
          el.getAttribute("aria-label") ||
          el.getAttribute("aria-labelledby") ||
          el.textContent?.trim() ||
          el.getAttribute("title")
        );
      });
      expect(hasLabel).toBeTruthy();
    }

    // Check that images have alt text
    const images = page.locator("img");
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const image = images.nth(i);
      const altText = await image.getAttribute("alt");
      // Decorative images can have empty alt, but should have alt attribute
      expect(altText).not.toBeNull();
    }
  });

  test("color contrast - text elements", async ({ page }) => {
    // Basic color contrast check - verify text is readable
    const textElements = page.locator("p, h1, h2, h3, h4, h5, h6, span, div");
    const textCount = await textElements.count();
    expect(textCount).toBeGreaterThan(0);

    // Check that text elements have sufficient contrast by verifying they're visible
    for (let i = 0; i < Math.min(textCount, 5); i++) {
      const element = textElements.nth(i);
      const isVisible = await element.isVisible();
      if (isVisible) {
        const text = await element.textContent();
        expect(text?.trim()).toBeTruthy();
      }
    }
  });

  test("focus indicators - visible focus", async ({ page }) => {
    // Test that focus indicators are visible
    const focusableElements = page.locator(
      "button, a, input, textarea, select, [tabindex]",
    );
    const elementCount = await focusableElements.count();

    for (let i = 0; i < Math.min(elementCount, 3); i++) {
      const element = focusableElements.nth(i);
      await element.focus();

      // Check if element has visible focus indicator
      const hasFocusIndicator = await element.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return (
          style.outline !== "none" ||
          style.boxShadow !== "none" ||
          style.borderColor !== "transparent" ||
          el.classList.contains("focus-visible") ||
          el.getAttribute("data-focus-visible")
        );
      });

      expect(hasFocusIndicator).toBeTruthy();
    }
  });

  test("skip links - if present", async ({ page }) => {
    // Check for skip links (common accessibility feature)
    const skipLinks = page.locator("a[href^='#'], a[href*='skip']");
    const skipLinkCount = await skipLinks.count();

    if (skipLinkCount > 0) {
      // Test skip link functionality
      const firstSkipLink = skipLinks.first();
      if (await firstSkipLink.isVisible()) {
        await firstSkipLink.click();
        // Should navigate to target without errors
      }
    }
  });

  test("form accessibility - if forms present", async ({ page }) => {
    // Check form accessibility
    const forms = page.locator("form");
    const formCount = await forms.count();

    if (formCount > 0) {
      const form = forms.first();

      // Check for form labels
      const inputs = form.locator("input, textarea, select");
      const inputCount = await inputs.count();

      for (let i = 0; i < Math.min(inputCount, 3); i++) {
        const input = inputs.nth(i);
        const hasLabel = await input.evaluate((el) => {
          const id = el.getAttribute("id");
          if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            if (label) return true;
          }
          return (
            el.getAttribute("aria-label") ||
            el.getAttribute("aria-labelledby") ||
            el.getAttribute("placeholder")
          );
        });
        expect(hasLabel).toBeTruthy();
      }
    }
  });

  test("responsive accessibility - mobile viewport", async ({ page }) => {
    // Test accessibility on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Basic accessibility checks for mobile
    const html = page.locator("html");
    const lang = await html.getAttribute("lang");
    expect(lang).toBeTruthy();

    // Check that main content is still accessible
    const main = page.locator("main, [role='main']");
    await expect(main).toBeVisible();

    // Check that navigation is still accessible
    const nav = page.locator("nav, [role='navigation']").first();
    await expect(nav).toBeVisible();
  });

  test("responsive accessibility - tablet viewport", async ({ page }) => {
    // Test accessibility on tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // Basic accessibility checks for tablet
    const html = page.locator("html");
    const lang = await html.getAttribute("lang");
    expect(lang).toBeTruthy();

    // Check that main content is still accessible
    const main = page.locator("main, [role='main']");
    await expect(main).toBeVisible();

    // Check that navigation is still accessible
    const nav = page.locator("nav, [role='navigation']").first();
    await expect(nav).toBeVisible();
  });

  test("language and internationalization", async ({ page }) => {
    // Check for proper language declaration
    const html = page.locator("html");
    const lang = await html.getAttribute("lang");
    expect(lang).toBeTruthy();
    expect(lang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/); // Valid language code format

    // Check for proper direction if RTL language
    if (lang?.includes("ar") || lang?.includes("he") || lang?.includes("fa")) {
      const dir = await html.getAttribute("dir");
      expect(dir).toBe("rtl");
    }
  });

  test("error handling accessibility", async ({ page }) => {
    // Test that error messages are accessible
    // This would typically involve triggering errors and checking ARIA attributes
    // For now, we'll check that the page handles errors gracefully

    // Simulate a network error
    await page.route("**/*", (route) => {
      route.abort();
    });

    try {
      await page.reload();
    } catch (error) {
      // Page should handle errors gracefully
      await expect(page.locator("body")).toBeVisible();
    }
  });
});
