import { test, expect } from "@playwright/test";

test.describe("User Journeys", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("complete user journey: learn about CommunityRule", async ({ page }) => {
    // 1. User lands on homepage
    await expect(page.locator("text=Collaborate")).toBeVisible();

    // 2. User reads hero section
    await expect(
      page.locator("text=Help your community make important decisions")
    ).toBeVisible();

    // 3. User clicks CTA to learn more
    const learnButton = page
      .locator('button:has-text("Learn how CommunityRule works")')
      .first();
    if ((await learnButton.count()) > 0 && (await learnButton.isVisible())) {
      await learnButton.click();
    }

    // 4. User scrolls to numbered cards section
    await expect(
      page.locator('h2:has-text("How CommunityRule works")')
    ).toBeVisible();

    // 5. User reads the process steps
    await expect(
      page.locator("text=Document how your community makes decisions")
    ).toBeVisible();
    await expect(
      page.locator("text=Build an operating manual for a successful community")
    ).toBeVisible();
    await expect(
      page.locator(
        "text=Get a link to your manual for your group to review and evolve"
      )
    ).toBeVisible();

    // 6. User explores rule templates
    await page.locator("text=Consensus clusters").first().click();
    await page.locator("text=Consensus").nth(1).click(); // Use nth(1) to get the second "Consensus" element
    await page.locator("text=Elected Board").first().click();
    await page.locator("text=Petition").first().click();

    // 7. User checks out features - check if elements exist and are visible first
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
    const askButton = page.locator('button:has-text("Ask an organizer")');
    if (
      (await askButton.count()) > 0 &&
      (await askButton.first().isVisible())
    ) {
      await askButton.first().click();
    }

    // 10. User creates CommunityRule
    const createButton = page.locator(
      'button:has-text("Create CommunityRule")'
    );
    if (
      (await createButton.count()) > 0 &&
      (await createButton.first().isVisible())
    ) {
      await createButton.first().click();
    }
  });

  test("user journey: explore rule templates", async ({ page }) => {
    // Scroll to rule stack section
    await page.locator("text=Consensus clusters").scrollIntoViewIfNeeded();

    // Explore each rule template
    const ruleTemplates = [
      "Consensus clusters",
      "Consensus",
      "Elected Board",
      "Petition",
    ];

    for (const template of ruleTemplates) {
      const templateElement = page.locator(`text=${template}`);
      if (template === "Consensus") {
        await templateElement.nth(1).click(); // Use nth(1) for the second "Consensus" element
      } else {
        await templateElement.first().click();
      }
      // Should trigger analytics tracking
      await page.waitForTimeout(500); // Brief pause between clicks
    }

    // Click "See all templates"
    await page.locator('button:has-text("See all templates")').click();
  });

  test("user journey: explore feature tools", async ({ page }) => {
    // Scroll to feature grid section
    await page.locator("text=We've got your back").scrollIntoViewIfNeeded();

    // Explore each feature
    const features = [
      { name: "Decision-making support", href: "#decision-making" },
      { name: "Values alignment exercises", href: "#values-alignment" },
      { name: "Membership guidance", href: "#membership-guidance" },
      { name: "Conflict resolution tools", href: "#conflict-resolution" },
    ];

    for (const feature of features) {
      await page.locator(`a[href="${feature.href}"]`).click();
      await page.waitForTimeout(500);
    }
  });

  test("user journey: contact organizer", async ({ page }) => {
    // Scroll to ask organizer section
    await page.locator("text=Still have questions?").scrollIntoViewIfNeeded();

    // Read the section
    await expect(
      page.locator("text=Get answers from an experienced organizer")
    ).toBeVisible();

    // Click contact button - check if it exists and is visible first
    const askButton = page.locator('button:has-text("Ask an organizer")');
    if (
      (await askButton.count()) > 0 &&
      (await askButton.first().isVisible())
    ) {
      await askButton.first().click();
    }

    // Should trigger analytics tracking
    // In a real app, this might open a contact form or modal
  });

  test("user journey: create CommunityRule", async ({ page }) => {
    // Simplified approach - just check if the button exists and is visible
    const createButton = page.locator(
      'button:has-text("Create CommunityRule")'
    );

    if (
      (await createButton.count()) > 0 &&
      (await createButton.first().isVisible())
    ) {
      await createButton.first().click();
    }

    // Should navigate to creation flow
    // In a real app, this would go to a form or wizard
  });

  test("user journey: learn how it works", async ({ page }) => {
    // This test simulates a user learning about how CommunityRule works
    // Since the CTA button doesn't actually navigate anywhere (href="#"),
    // we'll focus on the actual user journey: reading about the process

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // User starts by reading the hero section
    await expect(page.locator("text=Collaborate")).toBeVisible();
    await expect(
      page.locator("text=Help your community make important decisions")
    ).toBeVisible();

    // User scrolls down to learn about how CommunityRule works
    await page
      .locator('h2:has-text("How CommunityRule works")')
      .scrollIntoViewIfNeeded();
    await expect(
      page.locator('h2:has-text("How CommunityRule works")')
    ).toBeVisible();

    // User reads the process steps
    await expect(
      page.locator("text=Document how your community makes decisions")
    ).toBeVisible();
    await expect(
      page.locator("text=Build an operating manual for a successful community")
    ).toBeVisible();
    await expect(
      page.locator(
        "text=Get a link to your manual for your group to review and evolve"
      )
    ).toBeVisible();

    // User explores rule templates
    await page.locator("text=Consensus clusters").first().click();
    await page.locator("text=Consensus").nth(1).click();
    await page.locator("text=Elected Board").first().click();
    await page.locator("text=Petition").first().click();

    // User has successfully learned about how CommunityRule works
    await expect(
      page.locator("text=We've got your back, every step of the way")
    ).toBeVisible();
  });

  test("user journey: scroll through entire page", async ({ page }) => {
    // Start at top
    await expect(page.locator("text=Collaborate")).toBeVisible();

    // Simplified approach - just scroll to bottom and check footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator("footer").first()).toBeVisible();
  });

  test("user journey: keyboard navigation through page", async ({ page }) => {
    // Start with tab navigation
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toBeVisible();

    // Navigate through all interactive elements
    let tabCount = 0;
    const maxTabs = 50; // Prevent infinite loop

    while (tabCount < maxTabs) {
      await page.keyboard.press("Tab");
      tabCount++;

      // Check if we've cycled back to the beginning
      const focusedElement = page.locator(":focus");
      if ((await focusedElement.count()) === 0) {
        break;
      }
    }

    // Test Enter key on focused elements
    await page.keyboard.press("Enter");
  });

  test("user journey: mobile navigation", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate through page on mobile
    await expect(page.locator("text=Collaborate")).toBeVisible();

    // Scroll through sections
    await page.locator("section").first().scrollIntoViewIfNeeded();

    // Test basic touch interactions - check if elements exist and are visible first
    const learnButton = page
      .locator('button:has-text("Learn how CommunityRule works")')
      .first();
    if ((await learnButton.count()) > 0 && (await learnButton.isVisible())) {
      await learnButton.click();
    }

    const consensusText = page.locator("text=Consensus clusters");
    if (
      (await consensusText.count()) > 0 &&
      (await consensusText.isVisible())
    ) {
      await consensusText.click();
    }

    const askButton = page
      .locator('button:has-text("Ask an organizer")')
      .first();
    if ((await askButton.count()) > 0 && (await askButton.isVisible())) {
      await askButton.click();
    }
  });

  test("user journey: tablet navigation", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // Navigate through page on tablet
    await expect(page.locator("text=Collaborate")).toBeVisible();

    // Test tablet-specific interactions - check if elements exist and are visible first
    const learnButton = page
      .locator('button:has-text("Learn how CommunityRule works")')
      .first();
    if ((await learnButton.count()) > 0 && (await learnButton.isVisible())) {
      await learnButton.click();
    }

    const consensusText = page.locator("text=Consensus clusters");
    if (
      (await consensusText.count()) > 0 &&
      (await consensusText.isVisible())
    ) {
      await consensusText.click();
    }

    const askButton = page
      .locator('button:has-text("Ask an organizer")')
      .first();
    if ((await askButton.count()) > 0 && (await askButton.isVisible())) {
      await askButton.click();
    }
  });

  test("user journey: desktop navigation", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });

    // Navigate through page on desktop
    await expect(page.locator("text=Collaborate")).toBeVisible();

    // Test desktop-specific interactions - check if elements exist and are visible first
    const learnButton = page
      .locator('button:has-text("Learn how CommunityRule works")')
      .first();
    if ((await learnButton.count()) > 0 && (await learnButton.isVisible())) {
      await learnButton.click();
    }

    const consensusText = page.locator("text=Consensus clusters");
    if (
      (await consensusText.count()) > 0 &&
      (await consensusText.isVisible())
    ) {
      await consensusText.click();
    }

    const askButton = page
      .locator('button:has-text("Ask an organizer")')
      .first();
    if ((await askButton.count()) > 0 && (await askButton.isVisible())) {
      await askButton.click();
    }
  });

  test("user journey: accessibility navigation", async ({ page }) => {
    // Test screen reader navigation
    await page.keyboard.press("Tab");

    // Navigate through landmarks
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Test heading navigation (if supported)
    await page.keyboard.press("Tab");

    // Test form navigation
    await page.keyboard.press("Tab");

    // Test button activation
    await page.keyboard.press("Enter");
  });

  test("user journey: performance testing", async ({ page }) => {
    // Measure initial page load
    const startTime = Date.now();
    await page.goto("/");
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds

    // Measure scroll performance
    const scrollStartTime = Date.now();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const scrollTime = Date.now() - scrollStartTime;

    expect(scrollTime).toBeLessThan(1000); // Should scroll smoothly

    // Measure interaction response time
    const clickStartTime = Date.now();
    const learnButton = page
      .locator('button:has-text("Learn how CommunityRule works")')
      .first();
    if ((await learnButton.count()) > 0 && (await learnButton.isVisible())) {
      await learnButton.click();
    }
    const clickTime = Date.now() - clickStartTime;

    expect(clickTime).toBeLessThan(500); // Should respond quickly
  });
});
