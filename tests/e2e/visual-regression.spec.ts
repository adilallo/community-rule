import { test, expect } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for all content to load
    await page.waitForLoadState("networkidle");
  });

  test("homepage full page screenshot", async ({ page }) => {
    // Take full page screenshot
    await expect(page).toHaveScreenshot("homepage-full.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("homepage viewport screenshot", async ({ page }) => {
    // Take viewport screenshot
    await expect(page).toHaveScreenshot("homepage-viewport.png", {
      animations: "disabled",
    });
  });

  test("hero banner section screenshot", async ({ page }) => {
    // Scroll to hero section and take screenshot
    await page.locator("text=Collaborate").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // Wait for animations

    const heroSection = page.locator("section").first();
    await expect(heroSection).toHaveScreenshot("hero-banner.png", {
      animations: "disabled",
    });
  });

  test("logo wall section screenshot", async ({ page }) => {
    // Scroll to logo wall section
    await page
      .locator("text=Trusted by leading cooperators")
      .scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const logoSection = page.locator("section").nth(1);
    await expect(logoSection).toHaveScreenshot("logo-wall.png", {
      animations: "disabled",
    });
  });

  test("numbered cards section screenshot", async ({ page }) => {
    // Scroll to numbered cards section
    await page
      .locator('h2:has-text("How CommunityRule works")')
      .scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const cardsSection = page.locator("section").nth(2);
    await expect(cardsSection).toHaveScreenshot("numbered-cards.png", {
      animations: "disabled",
    });
  });

  test("rule stack section screenshot", async ({ page }) => {
    // Scroll to rule stack section
    await page.locator("text=Consensus clusters").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const ruleSection = page.locator("section").nth(3);
    await expect(ruleSection).toHaveScreenshot("rule-stack.png", {
      animations: "disabled",
    });
  });

  test("feature grid section screenshot", async ({ page }) => {
    // Scroll to feature grid section - use a more reliable selector
    await page.locator("text=We've got your back").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const featureSection = page.locator("section").nth(4);
    await expect(featureSection).toHaveScreenshot("feature-grid.png", {
      animations: "disabled",
    });
  });

  test("quote block section screenshot", async ({ page }) => {
    // Scroll to quote block section
    await page.locator("text=Jo Freeman").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const quoteSection = page.locator("section").nth(5);
    await expect(quoteSection).toHaveScreenshot("quote-block.png", {
      animations: "disabled",
    });
  });

  test("ask organizer section screenshot", async ({ page }) => {
    // Scroll to ask organizer section
    await page.locator("text=Still have questions?").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const askSection = page.locator("section").nth(6);
    await expect(askSection).toHaveScreenshot("ask-organizer.png", {
      animations: "disabled",
    });
  });

  test("header component screenshot", async ({ page }) => {
    const header = page.locator("header");
    await expect(header).toHaveScreenshot("header.png", {
      animations: "disabled",
    });
  });

  test("footer component screenshot", async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Use a more specific selector for the main footer
    const footer = page.locator("footer").last();
    await expect(footer).toHaveScreenshot("footer.png", {
      animations: "disabled",
    });
  });

  test("mobile viewport screenshots", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    // Wait for page to be stable
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("homepage-mobile.png", {
      animations: "disabled",
    });

    // Test mobile hero section - use a more reliable selector
    const heroSection = page.locator("section").first();
    if ((await heroSection.count()) > 0) {
      await heroSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await expect(heroSection).toHaveScreenshot("hero-banner-mobile.png", {
        animations: "disabled",
      });
    }
  });

  test("tablet viewport screenshots", async ({ page }) => {
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);

    // Wait for page to be stable
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("homepage-tablet.png", {
      animations: "disabled",
    });

    // Test tablet hero section - use a more reliable selector
    const heroSection = page.locator("section").first();
    if ((await heroSection.count()) > 0) {
      await heroSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await expect(heroSection).toHaveScreenshot("hero-banner-tablet.png", {
        animations: "disabled",
      });
    }
  });

  test("desktop viewport screenshots", async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot("homepage-desktop.png", {
      animations: "disabled",
    });

    // Test desktop hero section
    await page.locator("text=Collaborate").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const heroSection = page.locator("section").first();
    await expect(heroSection).toHaveScreenshot("hero-banner-desktop.png", {
      animations: "disabled",
    });
  });

  test("large desktop viewport screenshots", async ({ page }) => {
    // Test large desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot("homepage-large-desktop.png", {
      animations: "disabled",
    });
  });

  // test('button hover states', async ({ page }) => {
  //   // Test button hover states - scroll to hero section first to ensure button is visible
  //   await page.locator('text=Collaborate').scrollIntoViewIfNeeded();
  //   await page.waitForTimeout(500);
  //
  //   // Use a more specific selector for the visible button
  //   const ctaButton = page.locator('button:has-text("Learn how CommunityRule works")').first();
  //
  //   // Ensure button is visible
  //   await ctaButton.scrollIntoViewIfNeeded();
  //   await page.waitForTimeout(500);
  //
  //   // Normal state
  //   await expect(ctaButton).toHaveScreenshot('button-normal.png', {
  //     animations: 'disabled'
  //   });
  //
  //   // Hover state
  //   await ctaButton.hover();
  //   await page.waitForTimeout(500);
  //   await expect(ctaButton).toHaveScreenshot('button-hover.png', {
  //     animations: 'disabled'
  //   });
  // });

  test("rule card hover states", async ({ page }) => {
    // Scroll to rule stack section
    await page.locator("text=Consensus clusters").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const consensusCard = page.locator('[aria-label*="Consensus clusters"]');

    // Normal state
    await expect(consensusCard).toHaveScreenshot("rule-card-normal.png", {
      animations: "disabled",
    });

    // Hover state
    await consensusCard.hover();
    await page.waitForTimeout(500);
    await expect(consensusCard).toHaveScreenshot("rule-card-hover.png", {
      animations: "disabled",
    });
  });

  test("feature card hover states", async ({ page }) => {
    // Scroll to feature grid section
    await page.locator("text=We've got your back").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const featureCard = page.locator('a[href="#decision-making"]');

    // Normal state
    await expect(featureCard).toHaveScreenshot("feature-card-normal.png", {
      animations: "disabled",
    });

    // Hover state
    await featureCard.hover();
    await page.waitForTimeout(500);
    await expect(featureCard).toHaveScreenshot("feature-card-hover.png", {
      animations: "disabled",
    });
  });

  test("logo hover states", async ({ page }) => {
    // Scroll to logo wall section
    await page
      .locator("text=Trusted by leading cooperators")
      .scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const logo = page.locator('img[alt="Food Not Bombs"]');

    // Normal state
    await expect(logo).toHaveScreenshot("logo-normal.png", {
      animations: "disabled",
    });

    // Hover state
    await logo.hover();
    await page.waitForTimeout(500);
    await expect(logo).toHaveScreenshot("logo-hover.png", {
      animations: "disabled",
    });
  });

  // test('focus states', async ({ page }) => {
  //   // Test focus states for interactive elements - scroll to hero section first
  //   await page.locator('text=Collaborate').scrollIntoViewIfNeeded();
  //   await page.waitForTimeout(500);
  //
  //   // Use first button and ensure it's visible
  //   const ctaButton = page.locator('button:has-text("Learn how CommunityRule works")').first();
  //
  //   // Ensure button is visible
  //   await ctaButton.scrollIntoViewIfNeeded();
  //   await page.waitForTimeout(500);
  //
  //   // Focus the button
  //   await ctaButton.focus();
  //   await page.waitForTimeout(500);
  //
  //   await expect(ctaButton).toHaveScreenshot('button-focus.png', {
  //     animations: 'disabled'
  //   });
  // });

  test("loading states", async ({ page }) => {
    // Test loading states by blocking resources
    await page.route("**/*", (route) => {
      // Delay all requests to simulate loading
      setTimeout(() => route.continue(), 1000);
    });

    // Reload page to trigger loading states
    await page.reload();

    // Take screenshot during loading
    await expect(page).toHaveScreenshot("homepage-loading.png", {
      animations: "disabled",
    });
  });

  test("error states", async ({ page }) => {
    // Test error states by simulating a more controlled error condition
    // Instead of blocking resources, we'll simulate a network error state

    // Navigate to a non-existent route to trigger a 404-like state
    await page.goto("/non-existent-page");

    // Wait for page to stabilize
    await page.waitForTimeout(2000);

    // Take screenshot of error state
    await expect(page).toHaveScreenshot("homepage-error.png", {
      animations: "disabled",
    });
  });

  test("high contrast mode", async ({ page }) => {
    // Simulate high contrast mode
    await page.evaluate(() => {
      document.body.style.filter = "contrast(200%)";
    });

    await expect(page).toHaveScreenshot("homepage-high-contrast.png", {
      animations: "disabled",
    });

    // Reset contrast
    await page.evaluate(() => {
      document.body.style.filter = "none";
    });
  });

  test("reduced motion mode", async ({ page }) => {
    // Simulate reduced motion preference
    await page.evaluate(() => {
      document.documentElement.style.setProperty(
        "--prefers-reduced-motion",
        "reduce"
      );
    });

    await expect(page).toHaveScreenshot("homepage-reduced-motion.png", {
      animations: "disabled",
    });
  });

  test("dark mode simulation", async ({ page }) => {
    // Simulate dark mode (if supported)
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#000";
      document.body.style.color = "#fff";
    });

    await expect(page).toHaveScreenshot("homepage-dark-mode.png", {
      animations: "disabled",
    });

    // Reset to light mode
    await page.evaluate(() => {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    });
  });
});
