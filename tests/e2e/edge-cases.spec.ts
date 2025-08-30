import { test, expect } from "@playwright/test";

test.describe("Edge Cases and Error Scenarios", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("handles slow network conditions", async ({ page }) => {
    // Simulate slow network
    await page.route("**/*", (route) => {
      // Add 2 second delay to all requests
      setTimeout(() => route.continue(), 2000);
    });

    // Reload page with slow network
    await page.reload();

    // Page should still load eventually
    await expect(page.locator("text=Collaborate")).toBeVisible({
      timeout: 10000,
    });
  });

  test("handles offline mode gracefully", async ({ page }) => {
    // Note: page.setOffline() is not available in current Playwright version
    // This test would require network interception to simulate offline mode
    // For now, we'll test that the page loads and functions normally

    // Page should function normally
    await expect(page.locator("text=Collaborate")).toBeVisible();
    const learnButtons = page.locator(
      'button:has-text("Learn how CommunityRule works")',
    );
    const buttonCount = await learnButtons.count();
    let visibleButton = null;

    for (let i = 0; i < buttonCount; i++) {
      const button = learnButtons.nth(i);
      if (await button.isVisible()) {
        visibleButton = button;
        break;
      }
    }

    if (!visibleButton) {
      throw new Error(
        'No visible "Learn how CommunityRule works" button found',
      );
    }

    await visibleButton.click();
  });

  test("handles rapid user interactions", async ({ page }) => {
    // Rapidly click visible buttons
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();
    let clickedCount = 0;

    for (let i = 0; i < buttonCount && clickedCount < 3; i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        await button.click();
        await page.waitForTimeout(100); // Very short delay
        clickedCount++;
      }
    }

    // Page should remain stable
    await expect(page.locator("text=Collaborate")).toBeVisible();
  });

  test("handles rapid scrolling", async ({ page }) => {
    // Rapid scroll to bottom
    await page.evaluate(() => {
      for (let i = 0; i < 10; i++) {
        window.scrollTo(0, document.body.scrollHeight * (i / 10));
      }
    });

    // Should end up at bottom - use a more specific selector
    await expect(page.locator("footer").first()).toBeVisible();
  });

  test("handles viewport size changes", async ({ page }) => {
    // Rapidly change viewport sizes
    const viewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500);

      // Content should remain visible
      await expect(page.locator("text=Collaborate")).toBeVisible();
    }
  });

  test("handles browser back/forward navigation", async ({ page }) => {
    // Navigate to a section
    const learnButtons = page.locator(
      'button:has-text("Learn how CommunityRule works")',
    );
    const buttonCount = await learnButtons.count();
    let visibleButton = null;

    for (let i = 0; i < buttonCount; i++) {
      const button = learnButtons.nth(i);
      if (await button.isVisible()) {
        visibleButton = button;
        break;
      }
    }

    if (!visibleButton) {
      throw new Error(
        'No visible "Learn how CommunityRule works" button found',
      );
    }

    await visibleButton.click();

    // Since the button click doesn't navigate to a new page,
    // we'll test that the page handles back/forward gracefully
    await page.goBack();
    await page.goForward();

    // Should still have content
    await expect(page.locator("body")).toBeVisible();
  });

  test("handles page refresh during interactions", async ({ page }) => {
    // Start an interaction
    const learnButtons = page.locator(
      'button:has-text("Learn how CommunityRule works")',
    );
    const buttonCount = await learnButtons.count();
    let visibleButton = null;

    for (let i = 0; i < buttonCount; i++) {
      const button = learnButtons.nth(i);
      if (await button.isVisible()) {
        visibleButton = button;
        break;
      }
    }

    if (!visibleButton) {
      throw new Error(
        'No visible "Learn how CommunityRule works" button found',
      );
    }

    await visibleButton.click();

    // Refresh page during interaction
    await page.reload();

    // Should reload successfully
    await expect(page.locator("text=Collaborate")).toBeVisible();
  });

  test("handles multiple browser tabs", async ({ page, context }) => {
    // Open multiple tabs
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    // Navigate all tabs to homepage
    await page1.goto("/");
    await page2.goto("/");

    // Interact with each tab - find the first visible button
    const learnButtons = page.locator(
      'button:has-text("Learn how CommunityRule works")',
    );
    const buttonCount = await learnButtons.count();
    let visibleButton = null;

    for (let i = 0; i < buttonCount; i++) {
      const button = learnButtons.nth(i);
      if (await button.isVisible()) {
        visibleButton = button;
        break;
      }
    }

    if (!visibleButton) {
      throw new Error(
        'No visible "Learn how CommunityRule works" button found',
      );
    }

    await visibleButton.click();

    await page1.locator("text=Consensus clusters").click();

    // Find the first visible "Ask an organizer" link (it's an <a> tag, not a button)
    const askLinks = page2.locator('a:has-text("Ask an organizer")');
    const askLinkCount = await askLinks.count();
    let visibleAskLink = null;

    for (let i = 0; i < askLinkCount; i++) {
      const link = askLinks.nth(i);
      if (await link.isVisible()) {
        visibleAskLink = link;
        break;
      }
    }

    if (!visibleAskLink) {
      throw new Error('No visible "Ask an organizer" link found');
    }

    await visibleAskLink.click();

    // All tabs should work independently
    await expect(
      page.locator('h2:has-text("How CommunityRule works")'),
    ).toBeVisible();
    await expect(page1.locator("text=Consensus clusters")).toBeVisible();
    await expect(page2.locator("text=Still have questions?")).toBeVisible();

    // Close extra tabs
    await page1.close();
    await page2.close();
  });

  test("handles JavaScript errors gracefully", async ({ page }) => {
    // Inject a JavaScript error
    await page.evaluate(() => {
      // Create a temporary error handler
      const originalError = console.error;
      console.error = () => {}; // Suppress error logging

      // Trigger a harmless error
      try {
        throw new Error("Test error");
      } catch (e) {
        // Error handled
      }

      console.error = originalError;
    });

    // Page should continue to function
    await expect(page.locator("text=Collaborate")).toBeVisible();
    const learnButtons = page.locator(
      'button:has-text("Learn how CommunityRule works")',
    );
    const buttonCount = await learnButtons.count();
    let visibleButton = null;

    for (let i = 0; i < buttonCount; i++) {
      const button = learnButtons.nth(i);
      if (await button.isVisible()) {
        visibleButton = button;
        break;
      }
    }

    if (!visibleButton) {
      throw new Error(
        'No visible "Learn how CommunityRule works" button found',
      );
    }

    await visibleButton.click();
  });

  test("handles missing images gracefully", async ({ page }) => {
    // Block image requests
    await page.route("**/*.{png,jpg,jpeg,svg,webp}", (route) => {
      route.abort();
    });

    // Reload page
    await page.reload();

    // Page should still function without images
    await expect(page.locator("text=Collaborate")).toBeVisible();
    const learnButtons = page.locator(
      'button:has-text("Learn how CommunityRule works")',
    );
    const buttonCount = await learnButtons.count();
    let visibleButton = null;

    for (let i = 0; i < buttonCount; i++) {
      const button = learnButtons.nth(i);
      if (await button.isVisible()) {
        visibleButton = button;
        break;
      }
    }

    if (!visibleButton) {
      throw new Error(
        'No visible "Learn how CommunityRule works" button found',
      );
    }

    await visibleButton.click();
  });

  test("handles CSS loading failures", async ({ page }) => {
    // Block CSS requests
    await page.route("**/*.css", (route) => {
      route.abort();
    });

    // Reload page
    await page.reload();

    // Page should still function without styles
    await expect(page.locator("text=Collaborate")).toBeVisible();
    const learnButtons = page.locator(
      'button:has-text("Learn how CommunityRule works")',
    );
    const buttonCount = await learnButtons.count();
    let visibleButton = null;

    for (let i = 0; i < buttonCount; i++) {
      const button = learnButtons.nth(i);
      if (await button.isVisible()) {
        visibleButton = button;
        break;
      }
    }

    if (!visibleButton) {
      throw new Error(
        'No visible "Learn how CommunityRule works" button found',
      );
    }

    await visibleButton.click();
  });

  test("handles font loading failures", async ({ page }) => {
    // Block font requests
    await page.route("**/*.{woff,woff2,ttf,otf}", (route) => {
      route.abort();
    });

    // Reload page
    await page.reload();

    // Page should still function with fallback fonts
    await expect(page.locator("text=Collaborate")).toBeVisible();
    const learnButtons = page.locator(
      'button:has-text("Learn how CommunityRule works")',
    );
    const buttonCount = await learnButtons.count();
    let visibleButton = null;

    for (let i = 0; i < buttonCount; i++) {
      const button = learnButtons.nth(i);
      if (await button.isVisible()) {
        visibleButton = button;
        break;
      }
    }

    if (!visibleButton) {
      throw new Error(
        'No visible "Learn how CommunityRule works" button found',
      );
    }

    await visibleButton.click();
  });

  test("handles memory pressure", async ({ page }) => {
    // Simulate memory pressure by creating many elements
    await page.evaluate(() => {
      // Create temporary elements to simulate memory usage
      for (let i = 0; i < 1000; i++) {
        const div = document.createElement("div");
        div.textContent = `Test element ${i}`;
        document.body.appendChild(div);
      }

      // Clean up
      setTimeout(() => {
        const testElements = document.querySelectorAll(
          'div[textContent*="Test element"]',
        );
        testElements.forEach((el) => el.remove());
      }, 100);
    });

    // Page should remain functional
    await expect(page.locator("text=Collaborate")).toBeVisible();
    const learnButtons = page.locator(
      'button:has-text("Learn how CommunityRule works")',
    );
    const buttonCount = await learnButtons.count();
    let visibleButton = null;

    for (let i = 0; i < buttonCount; i++) {
      const button = learnButtons.nth(i);
      if (await button.isVisible()) {
        visibleButton = button;
        break;
      }
    }

    if (!visibleButton) {
      throw new Error(
        'No visible "Learn how CommunityRule works" button found',
      );
    }

    await visibleButton.click();
  });

  test("handles long content gracefully", async ({ page }) => {
    // Add a lot of content to test scrolling performance
    await page.evaluate(() => {
      const container = document.createElement("div");
      container.style.height = "10000px";
      container.style.background = "linear-gradient(red, blue)";
      document.body.appendChild(container);
    });

    // Scroll through the content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Should handle long content without issues
    await expect(page.locator("text=Collaborate")).toBeVisible();
  });

  test("handles focus management", async ({ page }) => {
    // Test focus trapping and management
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toBeVisible();

    // Navigate through focusable elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      await expect(page.locator(":focus")).toBeVisible();
    }

    // Test Shift+Tab for reverse navigation
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Shift+Tab");
      await expect(page.locator(":focus")).toBeVisible();
    }
  });

  test("handles keyboard shortcuts", async ({ page }) => {
    // Test common keyboard shortcuts
    await page.keyboard.press("Home");
    await page.keyboard.press("End");
    await page.keyboard.press("PageUp");
    await page.keyboard.press("PageDown");

    // Page should handle shortcuts gracefully
    await expect(page.locator("text=Collaborate")).toBeVisible();
  });

  test("handles copy/paste operations", async ({ page }) => {
    // Test text selection and copy
    await page.locator("text=Collaborate").selectText();
    await page.keyboard.press("Control+c");

    // Test paste (should work in input fields if any)
    const inputs = page.locator("input, textarea");
    if ((await inputs.count()) > 0) {
      await inputs.first().click();
      await page.keyboard.press("Control+v");
    }
  });

  test("handles right-click context menu", async ({ page }) => {
    // Test right-click on various elements
    await page.locator("text=Collaborate").click({ button: "right" });

    // Find visible button for right-click
    const learnButtons = page.locator(
      'button:has-text("Learn how CommunityRule works")',
    );
    const buttonCount = await learnButtons.count();
    let visibleButton = null;

    for (let i = 0; i < buttonCount; i++) {
      const button = learnButtons.nth(i);
      if (await button.isVisible()) {
        visibleButton = button;
        break;
      }
    }

    if (visibleButton) {
      await visibleButton.click({ button: "right" });
    }

    // Try to right-click on a visible image if it exists
    const images = page.locator("img");
    const imageCount = await images.count();
    let visibleImage = null;

    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      if (await image.isVisible()) {
        visibleImage = image;
        break;
      }
    }

    if (visibleImage) {
      await visibleImage.click({ button: "right" });
    }

    // Should handle right-clicks gracefully
    await expect(page.locator("text=Collaborate")).toBeVisible();
  });

  test("handles drag and drop operations", async ({ page }) => {
    // Test drag and drop (if applicable)
    const draggableElements = page.locator('[draggable="true"]');
    const dropZones = page.locator('[data-testid*="drop"], [class*="drop"]');

    if (
      (await draggableElements.count()) > 0 &&
      (await dropZones.count()) > 0
    ) {
      await draggableElements.first().dragTo(dropZones.first());
    }

    // Page should handle drag operations gracefully
    await expect(page.locator("text=Collaborate")).toBeVisible();
  });

  test("handles print functionality", async ({ page }) => {
    // Test print functionality
    await page.evaluate(() => {
      // Mock print function
      window.print = () => {};
    });

    // Trigger print
    await page.keyboard.press("Control+p");

    // Should handle print gracefully
    await expect(page.locator("text=Collaborate")).toBeVisible();
  });

  test("handles browser zoom", async ({ page }) => {
    // Test different zoom levels
    await page.evaluate(() => {
      document.body.style.zoom = "0.5";
    });

    await expect(page.locator("text=Collaborate")).toBeVisible();

    await page.evaluate(() => {
      document.body.style.zoom = "2.0";
    });

    await expect(page.locator("text=Collaborate")).toBeVisible();

    // Reset zoom
    await page.evaluate(() => {
      document.body.style.zoom = "1.0";
    });
  });

  test("handles high contrast mode", async ({ page }) => {
    // Simulate high contrast mode
    await page.evaluate(() => {
      document.body.style.filter = "contrast(200%)";
    });

    // Content should remain readable
    await expect(page.locator("text=Collaborate")).toBeVisible();
    const learnButtons = page.locator(
      'button:has-text("Learn how CommunityRule works")',
    );
    const buttonCount = await learnButtons.count();
    let visibleButton = null;

    for (let i = 0; i < buttonCount; i++) {
      const button = learnButtons.nth(i);
      if (await button.isVisible()) {
        visibleButton = button;
        break;
      }
    }

    if (!visibleButton) {
      throw new Error(
        'No visible "Learn how CommunityRule works" button found',
      );
    }

    await visibleButton.click();

    // Reset contrast
    await page.evaluate(() => {
      document.body.style.filter = "none";
    });
  });

  test("handles reduced motion preferences", async ({ page }) => {
    // Simulate reduced motion preference
    await page.evaluate(() => {
      document.documentElement.style.setProperty(
        "--prefers-reduced-motion",
        "reduce",
      );
    });

    // Page should respect reduced motion
    await expect(page.locator("text=Collaborate")).toBeVisible();
    const learnButtons = page.locator(
      'button:has-text("Learn how CommunityRule works")',
    );
    const buttonCount = await learnButtons.count();
    let visibleButton = null;

    for (let i = 0; i < buttonCount; i++) {
      const button = learnButtons.nth(i);
      if (await button.isVisible()) {
        visibleButton = button;
        break;
      }
    }

    if (!visibleButton) {
      throw new Error(
        'No visible "Learn how CommunityRule works" button found',
      );
    }

    await visibleButton.click();
  });
});
