import { test, expect } from "@playwright/test";

const breakpoints = [
  { name: "xs", width: 320, height: 700 },
  { name: "sm", width: 360, height: 700 },
  { name: "md", width: 480, height: 700 },
  { name: "lg", width: 640, height: 700 },
  { name: "xl", width: 768, height: 700 },
  { name: "2xl", width: 1024, height: 700 },
  { name: "3xl", width: 1280, height: 700 },
  { name: "4xl", width: 1440, height: 700 },
  { name: "full", width: 1920, height: 700 },
];

for (const bp of breakpoints) {
  test.describe(`Footer responsive behavior at ${bp.name} breakpoint`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/");
    });

    test(`footer layout at ${bp.name}`, async ({ page }) => {
      const footer = page.getByRole("contentinfo");
      await expect(footer).toBeVisible();

      // Check that footer content is visible
      const footerContent = page.getByRole("contentinfo");
      await expect(footerContent).toBeVisible();
    });

    test(`footer navigation items visibility at ${bp.name}`, async ({
      page,
    }) => {
      // All breakpoints should have navigation items
      await expect(
        page.getByRole("link", { name: /use cases/i }),
      ).toBeVisible();
      // Look for the "Learn" link specifically in the footer (not in other components)
      await expect(
        page.getByRole("contentinfo").getByRole("link", { name: /learn/i })
      ).toBeVisible();
      await expect(page.getByRole("link", { name: /about/i })).toBeVisible();
    });

    test(`footer legal links visibility at ${bp.name}`, async ({ page }) => {
      // All breakpoints should have legal links
      await expect(
        page.getByRole("link", { name: /privacy policy/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: /terms of service/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: /cookies settings/i }),
      ).toBeVisible();
    });

    test(`footer social links visibility at ${bp.name}`, async ({ page }) => {
      // All breakpoints should have social links
      await expect(
        page.getByRole("link", { name: /follow us on bluesky/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: /follow us on gitlab/i }),
      ).toBeVisible();
    });

    test.skip(`footer logo visibility at ${bp.name}`, async ({ page }) => {
      // TODO: Fix logo visibility test - currently finds multiple logo variants
      // Logo should be visible at all breakpoints
      // Look for the logo specifically in the footer
      const logo = page.getByRole("contentinfo").getByText("CommunityRule");
      await expect(logo).toBeVisible();
    });

    // Breakpoint-specific tests
    if (bp.name === "xs") {
      test("xs breakpoint specific behavior", async ({ page }) => {
        // At xs, footer should stack vertically
        const footer = page.getByRole("contentinfo");
        await expect(footer).toBeVisible();

        // Check that content is properly stacked
        const footerContent = page.getByRole("contentinfo").locator("> div");
        await expect(footerContent).toBeVisible();
      });
    }

    if (bp.name === "md") {
      test("md breakpoint specific behavior", async ({ page }) => {
        // At md, footer should have proper spacing
        const footer = page.getByRole("contentinfo");
        await expect(footer).toBeVisible();
      });
    }

    if (bp.name === "xl") {
      test("xl breakpoint specific behavior", async ({ page }) => {
        // At xl, footer should have full layout
        const footer = page.getByRole("contentinfo");
        await expect(footer).toBeVisible();
      });
    }
  });
}

// Visual regression tests
test.describe("Footer visual regression", () => {
  test("footer visual consistency across breakpoints", async ({ page }) => {
    // Test visual consistency at all breakpoints
    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/");

      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      // Take a screenshot for visual regression testing
      await expect(page.getByRole("contentinfo")).toHaveScreenshot(
        `footer-${bp.name}.png`,
      );
    }
  });

  test("footer hover states visual consistency", async ({ page }) => {
    // Test hover states at key breakpoints
    const keyBreakpoints = [
      { name: "xs", width: 320, height: 700 },
      { name: "md", width: 768, height: 700 },
      { name: "xl", width: 1280, height: 700 },
    ];

    for (const bp of keyBreakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/");

      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      // Test hover on navigation items
      const useCasesLink = page.getByRole("contentinfo").getByRole("link", { name: /use cases/i });
      await useCasesLink.hover();
      await page.waitForTimeout(200);
      await expect(page.getByRole("contentinfo")).toHaveScreenshot(
        `footer-${bp.name}-hover-nav.png`,
      );

      // Test hover on social links
      const blueskyLink = page.getByRole("contentinfo").getByRole("link", {
        name: /follow us on bluesky/i,
      });
      await blueskyLink.hover();
      await page.waitForTimeout(200);
      await expect(page.getByRole("contentinfo")).toHaveScreenshot(
        `footer-${bp.name}-hover-social.png`,
      );
    }
  });

  test("footer focus states visual consistency", async ({ page }) => {
    // Test focus states at key breakpoints
    const keyBreakpoints = [
      { name: "xs", width: 320, height: 700 },
      { name: "md", width: 768, height: 700 },
      { name: "xl", width: 1280, height: 700 },
    ];

    for (const bp of keyBreakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/");

      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      // Test focus on navigation items
      const useCasesLink = page.getByRole("contentinfo").getByRole("link", { name: /use cases/i });
      await useCasesLink.focus();
      await page.waitForTimeout(200);
      await expect(page.getByRole("contentinfo")).toHaveScreenshot(
        `footer-${bp.name}-focus-nav.png`,
      );

      // Test focus on social links
      const blueskyLink = page.getByRole("contentinfo").getByRole("link", {
        name: /follow us on bluesky/i,
      });
      await blueskyLink.focus();
      await page.waitForTimeout(200);
      await expect(page.getByRole("contentinfo")).toHaveScreenshot(
        `footer-${bp.name}-focus-social.png`,
      );
    }
  });
});

// Additional responsive behavior tests
test.describe("Footer responsive behavior", () => {
  test("footer maintains proper layout across breakpoints", async ({
    page,
  }) => {
    // Test that footer doesn't break at edge cases
    const edgeCases = [
      { width: 320, height: 700 }, // Very small
      { width: 1920, height: 700 }, // Very large
    ];

    for (const viewport of edgeCases) {
      await page.setViewportSize(viewport);
      await page.goto("/");

      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      const footer = page.getByRole("contentinfo");
      await expect(footer).toBeVisible();
    }
  });

  test("footer elements are properly accessible across breakpoints", async ({
    page,
  }) => {
    // Test accessibility at different breakpoints
    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/");

      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      // Check that all interactive elements are accessible
      const interactiveElements = [
        page.getByRole("contentinfo").getByRole("link", { name: /use cases/i }),
        page.getByRole("contentinfo").getByRole("link", { name: /learn/i }),
        page.getByRole("contentinfo").getByRole("link", { name: /about/i }),
        page.getByRole("contentinfo").getByRole("link", { name: /privacy policy/i }),
        page.getByRole("contentinfo").getByRole("link", { name: /terms of service/i }),
        page.getByRole("contentinfo").getByRole("link", { name: /follow us on bluesky/i }),
        page.getByRole("contentinfo").getByRole("link", { name: /follow us on gitlab/i }),
      ];

      for (const element of interactiveElements) {
        await expect(element).toBeVisible();
        await expect(element).toBeEnabled();
      }
    }
  });
});
