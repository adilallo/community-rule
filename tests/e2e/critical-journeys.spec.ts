import { test, expect } from "@playwright/test";

test.describe("Critical User Journeys", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("complete user journey: learn about CommunityRule", async ({ page }) => {
    // 1. User lands on homepage
    await expect(page.locator("text=Collaborate")).toBeVisible();

    // 2. User reads hero section
    await expect(
      page.locator("text=Help your community make important decisions"),
    ).toBeVisible();

    // 3. User clicks CTA to learn more
    const learnButton = page
      .locator('button:has-text("Learn how CommunityRule works")')
      .first();
    if ((await learnButton.count()) > 0 && (await learnButton.isVisible())) {
      await learnButton.click();
    }

    // 4. User scrolls to numbered cards section
    // Note: SectionHeader shows "How CommunityRule works" on mobile, "How CommunityRule helps" on desktop
    const howItWorksHeading = page.locator(
      'h2:has-text("How CommunityRule works"), h2:has-text("How CommunityRule helps")',
    );
    await expect(howItWorksHeading).toBeVisible();

    // 5. User reads the process steps
    await expect(
      page.locator("text=Document how your community makes decisions"),
    ).toBeVisible();
    await expect(
      page.locator("text=Build an operating manual for a successful community"),
    ).toBeVisible();
    await expect(
      page.locator(
        "text=Get a link to your manual for your group to review and evolve",
      ),
    ).toBeVisible();

    // 6. User explores rule templates
    await page.locator("text=Consensus clusters").first().click();
    await page.locator("text=Consensus").nth(1).click();
    await page.locator("text=Elected Board").first().click();
    await page.locator("text=Petition").first().click();

    // 7. User checks out features
    const features = [
      "Decision-making support",
      "Values alignment exercises",
      "Membership guidance",
      "Conflict resolution tools",
    ];

    for (const feature of features) {
      const featureElement = page.locator(`text=${feature}`);
      if (
        (await featureElement.count()) > 0 &&
        (await featureElement.first().isVisible())
      ) {
        await featureElement.first().click();
      }
    }

    // 8. User reads testimonial
    await expect(page.locator("text=Jo Freeman")).toBeVisible();

    // 9. User decides to contact organizer
    const askButton = page.locator(
      'a:has-text("Ask an organizer"), button:has-text("Ask an organizer")',
    );
    if (
      (await askButton.count()) > 0 &&
      (await askButton.first().isVisible())
    ) {
      await askButton.first().click();
    }
  });

  test("homepage loads successfully with all sections", async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/CommunityRule/);

    // Check main sections are present
    await expect(
      page.locator("h1, h2").filter({ hasText: "Collaborate" }),
    ).toBeVisible();

    const howItWorksHeading = page.locator(
      'h2:has-text("How CommunityRule works"), h2:has-text("How CommunityRule helps")',
    );
    await expect(howItWorksHeading).toBeVisible();

    await expect(
      page.locator("h1").filter({ hasText: "We've got your back" }),
    ).toBeVisible();

    // Check key components are rendered
    await expect(page.locator('img[alt="Hero illustration"]')).toBeVisible();
    await expect(
      page.locator("text=Trusted by leading cooperators"),
    ).toBeVisible();
    await expect(page.locator("text=Jo Freeman")).toBeVisible();
  });

  test("feature grid section functionality", async ({ page }) => {
    // Check section header
    await expect(
      page.locator('h1:has-text("We\'ve got your back")'),
    ).toBeVisible();
    await expect(
      page.locator(
        "text=Use our toolkit to improve, document, and evolve your organization",
      ),
    ).toBeVisible();

    // Check all four feature cards - FeatureGrid uses section with grid layout
    const featureSection = page.locator(
      'section[aria-label="Feature tools and services"], section:has-text("We\'ve got your back")',
    );
    await expect(featureSection.locator("text=Decision-making")).toBeVisible();
    await expect(featureSection.locator("text=Values alignment")).toBeVisible();
    await expect(featureSection.locator("text=Membership")).toBeVisible();
    await expect(
      featureSection.locator("text=Conflict resolution"),
    ).toBeVisible();

    // Check feature links - MiniCard components render as <a> tags with href="#..."
    // There are 4 feature cards + 1 "Learn more" link = 5 total links
    // We check for the specific feature card links
    await expect(
      featureSection.locator('a[href="#decision-making"]'),
    ).toBeVisible();
    await expect(
      featureSection.locator('a[href="#values-alignment"]'),
    ).toBeVisible();
    await expect(
      featureSection.locator('a[href="#membership-guidance"]'),
    ).toBeVisible();
    await expect(
      featureSection.locator('a[href="#conflict-resolution"]'),
    ).toBeVisible();

    // Test feature card interactions
    await page.locator('a[href="#decision-making"]').click();
  });

  test("header navigation functionality", async ({ page }) => {
    // Check header is present
    await expect(page.locator("header")).toBeVisible();

    // Test logo click
    const logoLinks = page.locator('a[aria-label="CommunityRule Logo"]');
    const logoCount = await logoLinks.count();
    expect(logoCount).toBeGreaterThan(0);

    let visibleLogo = null;
    for (let i = 0; i < logoCount; i++) {
      const logo = logoLinks.nth(i);
      if (await logo.isVisible()) {
        visibleLogo = logo;
        break;
      }
    }

    expect(visibleLogo).not.toBeNull();
    await visibleLogo.click();
    await expect(page).toHaveURL(/\/#?$/);
  });

  test("keyboard navigation and accessibility", async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toBeVisible();

    // Navigate through interactive elements
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Test Enter key on buttons
    await page.keyboard.press("Enter");

    // Basic accessibility checks
    const html = page.locator("html");
    const lang = await html.getAttribute("lang");
    expect(lang).toBeTruthy();

    // Check for main heading
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
  });

  test("responsive design behavior", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(
      page.locator("h1, h2").filter({ hasText: "Collaborate" }),
    ).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(
      page.locator("h1, h2").filter({ hasText: "Collaborate" }),
    ).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(
      page.locator("h1, h2").filter({ hasText: "Collaborate" }),
    ).toBeVisible();
  });
});
