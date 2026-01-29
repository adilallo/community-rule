import { test, expect } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
  async function settle(page: any) {
    await page.evaluate(() => {
      window.scrollTo(0, window.scrollY); // ensure a frame boundary
      void document.body.getBoundingClientRect();
    });
    await page.waitForTimeout(50);
  }

  test("homepage full page screenshot", async ({ page }) => {
    // Add deterministic CSS to normalize rendering
    await page.addStyleTag({
      content: `
        /* stop caret and selection flicker */
        * { caret-color: transparent !important; }
        ::selection { background: transparent !important; }
        /* hide scrollbars */
        ::-webkit-scrollbar { display: none !important; }
        html { scrollbar-width: none !important; }
        /* stabilize font rasterization */
        * {
          text-rendering: geometricPrecision !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
      `,
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Make sure we've really got the webfonts before shots
    await page.evaluate(async () => {
      // @ts-ignore
      if (document.fonts && document.fonts.status !== "loaded") {
        // @ts-ignore
        await document.fonts.ready;
      }
    });

    // Stabilize layout before screenshot
    await settle(page);

    // Take full page screenshot
    await expect(page).toHaveScreenshot("homepage-full.png", {
      fullPage: true,
      animations: "disabled",
      scale: "css",
    });
  });

  test("homepage viewport screenshot", async ({ page }) => {
    // Add deterministic CSS to normalize rendering
    await page.addStyleTag({
      content: `
        /* stop caret and selection flicker */
        * { caret-color: transparent !important; }
        ::selection { background: transparent !important; }
        /* hide scrollbars */
        ::-webkit-scrollbar { display: none !important; }
        html { scrollbar-width: none !important; }
        /* stabilize font rasterization */
        * {
          text-rendering: geometricPrecision !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
      `,
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Make sure we've really got the webfonts before shots
    await page.evaluate(async () => {
      // @ts-ignore
      if (document.fonts && document.fonts.status !== "loaded") {
        // @ts-ignore
        await document.fonts.ready;
      }
    });

    // Stabilize layout before screenshot
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      void document.body.getBoundingClientRect();
    });
    await page.waitForTimeout(50);

    // Take viewport screenshot
    await expect(page).toHaveScreenshot("homepage-viewport.png", {
      animations: "disabled",
    });
  });

  test("blog listing page", async ({ page }) => {
    // Add deterministic CSS to normalize rendering
    await page.addStyleTag({
      content: `
        /* stop caret and selection flicker */
        * { caret-color: transparent !important; }
        ::selection { background: transparent !important; }
        /* hide scrollbars */
        ::-webkit-scrollbar { display: none !important; }
        html { scrollbar-width: none !important; }
        /* stabilize font rasterization */
        * {
          text-rendering: geometricPrecision !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
      `,
    });

    // Navigate to blog listing page
    await page.goto("/blog");
    await page.waitForLoadState("networkidle");

    // Wait for blog content to be fully rendered
    await page.waitForTimeout(1000);
    await settle(page);

    // Take full page screenshot of blog listing
    await expect(page).toHaveScreenshot("blog-listing.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("blog post page", async ({ page }) => {
    // Add deterministic CSS to normalize rendering
    await page.addStyleTag({
      content: `
        /* stop caret and selection flicker */
        * { caret-color: transparent !important; }
        ::selection { background: transparent !important; }
        /* hide scrollbars */
        ::-webkit-scrollbar { display: none !important; }
        html { scrollbar-width: none !important; }
        /* stabilize font rasterization */
        * {
          text-rendering: geometricPrecision !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
      `,
    });

    // Navigate to a specific blog post
    await page.goto("/blog/resolving-active-conflicts");
    await page.waitForLoadState("networkidle");

    // Wait for blog post content to be fully rendered
    await page.waitForSelector("main", { timeout: 10000 });
    await page.waitForTimeout(1000);
    await settle(page);

    // Take full page screenshot of blog post
    await expect(page).toHaveScreenshot("blog-post.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("404 error page", async ({ page }) => {
    // Add deterministic CSS to normalize rendering
    await page.addStyleTag({
      content: `
        /* stop caret and selection flicker */
        * { caret-color: transparent !important; }
        ::selection { background: transparent !important; }
        /* hide scrollbars */
        ::-webkit-scrollbar { display: none !important; }
        html { scrollbar-width: none !important; }
        /* stabilize font rasterization */
        * {
          text-rendering: geometricPrecision !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
      `,
    });

    // Navigate to a non-existent route to trigger 404
    await page.goto("/non-existent-page");
    await page.waitForLoadState("networkidle");
    await settle(page);

    // Take screenshot of 404 page
    await expect(page).toHaveScreenshot("404-error.png", {
      animations: "disabled",
    });
  });
});
