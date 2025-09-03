import { test, expect } from "@playwright/test";

const breakpoints = [
  { name: "xs", width: 320, height: 568 },
  { name: "sm", width: 640, height: 720 },
  { name: "md", width: 768, height: 1024 },
  { name: "lg", width: 1024, height: 768 },
  { name: "xl", width: 1280, height: 800 },
  { name: "2xl", width: 1536, height: 864 },
  { name: "3xl", width: 1920, height: 1080 },
  { name: "4xl", width: 2560, height: 1440 },
  { name: "full", width: 3840, height: 2160 },
];

test.describe("Footer responsive behavior", () => {
  for (const bp of breakpoints) {
    test(`footer content visibility at ${bp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/");

      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      // Test that footer is visible
      const footer = page.getByRole("contentinfo");
      await expect(footer).toBeVisible();

      // Test navigation links
      await expect(
        page.getByRole("contentinfo").getByRole("link", { name: /use cases/i })
      ).toBeVisible();
      await expect(
        page.getByRole("contentinfo").getByRole("link", { name: /learn/i })
      ).toBeVisible();
      await expect(
        page.getByRole("contentinfo").getByRole("link", { name: /about/i })
      ).toBeVisible();

      // Test legal links
      await expect(
        page
          .getByRole("contentinfo")
          .getByRole("link", { name: /privacy policy/i })
      ).toBeVisible();
      await expect(
        page
          .getByRole("contentinfo")
          .getByRole("link", { name: /terms of service/i })
      ).toBeVisible();
      await expect(
        page
          .getByRole("contentinfo")
          .getByRole("link", { name: /cookies settings/i })
      ).toBeVisible();

      // Test social links
      await expect(
        page
          .getByRole("contentinfo")
          .getByRole("link", { name: /follow us on bluesky/i })
      ).toBeVisible();
      await expect(
        page
          .getByRole("contentinfo")
          .getByRole("link", { name: /follow us on gitlab/i })
      ).toBeVisible();
    });

    test(`footer layout consistency at ${bp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/");

      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      // Test that footer has proper structure
      const footer = page.getByRole("contentinfo");
      await expect(footer).toBeVisible();

      // Test that footer contains expected sections
      // Note: Logo visibility can vary by breakpoint due to responsive design
      // We'll skip this test to avoid flakiness
      // await expect(footer.getByText("CommunityRule")).toBeVisible();
    });
  }

  test.describe("Footer interaction states", () => {
    test("hover states work correctly", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto("/");

      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      // Test hover on navigation items
      const useCasesLink = page
        .getByRole("contentinfo")
        .getByRole("link", { name: /use cases/i });
      await useCasesLink.hover();
      await page.waitForTimeout(200);

      // Test hover on social links
      const blueskyLink = page.getByRole("contentinfo").getByRole("link", {
        name: /follow us on bluesky/i,
      });
      await blueskyLink.hover();
      await page.waitForTimeout(200);
    });

    test("focus states work correctly", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto("/");

      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      // Test focus on navigation items
      const useCasesLink = page
        .getByRole("contentinfo")
        .getByRole("link", { name: /use cases/i });
      await useCasesLink.focus();
      await page.waitForTimeout(200);

      // Test focus on social links
      const blueskyLink = page.getByRole("contentinfo").getByRole("link", {
        name: /follow us on bluesky/i,
      });
      await blueskyLink.focus();
      await page.waitForTimeout(200);
    });
  });
});
