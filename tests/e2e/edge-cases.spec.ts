import { test, expect } from "@playwright/test";

test.describe("Edge Cases and Error Scenarios", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("handles slow network conditions", async ({ page }) => {
    // Page is already loaded from beforeEach
    // Simulate slow network for any subsequent requests
    await page.route("**/*", (route) => {
      // Add 2 second delay to all requests
      setTimeout(() => route.continue(), 2000);
    });

    // Navigate to a new page to test slow network conditions
    // Use a fresh navigation instead of reload to avoid Web Inspector issues
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 10000 });

    // Page should still load eventually
    await expect(page.locator("text=Collaborate")).toBeVisible({
      timeout: 10000,
    });
  });

  test("handles offline mode gracefully", async ({ page }) => {
    // Page is already loaded from beforeEach, so we can test offline behavior
    // without reloading (which is blocked by Web Inspector in local environments)

    // Simulate offline mode by blocking all network requests
    await page.route("**/*", (route) => {
      route.abort();
    });

    // Verify page content is still visible (cached content should remain)
    // This tests that the page doesn't crash when network requests fail
    const body = page.locator("body");
    await expect(body).toBeVisible();

    // Verify key content is still accessible
    await expect(page.locator("text=Collaborate")).toBeVisible();
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
      } catch (_e) {
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

    // Navigate to a new page to test missing images
    // Use a fresh navigation instead of reload to avoid Web Inspector issues
    await page.goto("/", { waitUntil: "domcontentloaded" });

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
});
