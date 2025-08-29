import { test, expect } from "@playwright/test";

const breakpoints = [
  { name: "xs", width: 360, height: 700 },
  { name: "sm", width: 640, height: 700 },
  { name: "md", width: 768, height: 700 },
  { name: "lg", width: 1024, height: 700 },
  { name: "xl", width: 1280, height: 700 },
];

for (const bp of breakpoints) {
  test.describe(`Header responsive behavior at ${bp.name} breakpoint`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/");
    });

    test(`header layout at ${bp.name}`, async ({ page }) => {
      const nav = page.getByRole("navigation", { name: /main navigation/i });
      await expect(nav).toBeVisible();

      // Check that header banner is visible
      const header = page.getByRole("banner", {
        name: /main navigation header/i,
      });
      await expect(header).toBeVisible();
    });

    test(`navigation items visibility at ${bp.name}`, async ({ page }) => {
      // All breakpoints should have navigation items
      await expect(
        page.getByRole("link", { name: /use cases/i })
      ).toBeVisible();
      await expect(page.getByRole("link", { name: /learn/i })).toBeVisible();
      await expect(page.getByRole("link", { name: /about/i })).toBeVisible();
    });

    test(`authentication elements visibility at ${bp.name}`, async ({
      page,
    }) => {
      // All breakpoints should have login button
      await expect(
        page.getByRole("link", { name: /log in to your account/i })
      ).toBeVisible();

      // All breakpoints should have create rule button
      await expect(
        page.getByRole("button", {
          name: /create a new rule with avatar decoration/i,
        })
      ).toBeVisible();
    });

    test(`logo visibility at ${bp.name}`, async ({ page }) => {
      // Logo should be visible at all breakpoints
      const logo = page.locator('[data-testid="logo-wrapper"]').first();
      await expect(logo).toBeVisible();
    });

    // Breakpoint-specific tests
    if (bp.name === "xs") {
      test("xs breakpoint specific behavior", async ({ page }) => {
        // At xs, navigation items should be in the right section
        const authXs = page.locator('[data-testid="auth-xs"]');
        await expect(authXs).toBeVisible();

        // Navigation items should be in the auth section at xs
        const useCasesLink = page.getByRole("link", { name: /use cases/i });
        await expect(useCasesLink).toBeVisible();

        // Login button should be in the auth section
        const loginButton = page.getByRole("link", {
          name: /log in to your account/i,
        });
        await expect(loginButton).toBeVisible();

        // Create rule button should be visible
        const createRuleButton = page.getByRole("button", {
          name: /create a new rule with avatar decoration/i,
        });
        await expect(createRuleButton).toBeVisible();
      });
    }

    if (bp.name === "sm") {
      test("sm breakpoint specific behavior", async ({ page }) => {
        // At sm, navigation should be in the center section
        const navSm = page.locator('[data-testid="nav-sm"]');
        await expect(navSm).toBeVisible();

        // Auth section should only have create rule button
        const authSm = page.locator('[data-testid="auth-sm"]');
        await expect(authSm).toBeVisible();
      });
    }

    if (bp.name === "md") {
      test("md breakpoint specific behavior", async ({ page }) => {
        // At md, navigation should be in the center section
        const navMd = page.locator('[data-testid="nav-md"]');
        await expect(navMd).toBeVisible();

        // Auth section should have login and create rule button
        const authMd = page.locator('[data-testid="auth-md"]');
        await expect(authMd).toBeVisible();
      });
    }

    if (bp.name === "lg") {
      test("lg breakpoint specific behavior", async ({ page }) => {
        // At lg, navigation should be in the center section
        const navLg = page.locator('[data-testid="nav-lg"]');
        await expect(navLg).toBeVisible();

        // Auth section should have login and create rule button
        const authLg = page.locator('[data-testid="auth-lg"]');
        await expect(authLg).toBeVisible();
      });
    }

    if (bp.name === "xl") {
      test("xl breakpoint specific behavior", async ({ page }) => {
        // At xl, navigation should be in the center section
        const navXl = page.locator('[data-testid="nav-xl"]');
        await expect(navXl).toBeVisible();

        // Auth section should have login and create rule button
        const authXl = page.locator('[data-testid="auth-xl"]');
        await expect(authXl).toBeVisible();
      });
    }
  });
}

// Additional responsive behavior tests
test.describe("Header responsive behavior", () => {
  test("header maintains proper layout across breakpoints", async ({
    page,
  }) => {
    // Test that header doesn't break at edge cases
    const edgeCases = [
      { width: 320, height: 700 }, // Very small
      { width: 1920, height: 700 }, // Very large
    ];

    for (const viewport of edgeCases) {
      await page.setViewportSize(viewport);
      await page.goto("/");

      const header = page.getByRole("banner", {
        name: /main navigation header/i,
      });
      await expect(header).toBeVisible();

      const nav = page.getByRole("navigation", { name: /main navigation/i });
      await expect(nav).toBeVisible();
    }
  });

  test("header elements are properly accessible across breakpoints", async ({
    page,
  }) => {
    // Test accessibility at different breakpoints
    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/");

      // Check that all interactive elements are accessible
      const interactiveElements = [
        page.getByRole("link", { name: /use cases/i }),
        page.getByRole("link", { name: /learn/i }),
        page.getByRole("link", { name: /about/i }),
        page.getByRole("link", { name: /log in to your account/i }),
        page.getByRole("button", {
          name: /create a new rule with avatar decoration/i,
        }),
      ];

      for (const element of interactiveElements) {
        await expect(element).toBeVisible();
        await expect(element).toBeEnabled();
      }
    }
  });
});
