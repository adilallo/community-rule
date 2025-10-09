import { test, expect } from "@playwright/test";

test.describe("RadioGroup Storybook Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "http://localhost:6006/iframe.html?id=forms-radiogroup--default"
    );
  });

  test("renders default story", async ({ page }) => {
    const radioGroup = page.locator('[role="radiogroup"]');
    await expect(radioGroup).toBeVisible();

    const radioButtons = page.locator('[role="radio"]');
    await expect(radioButtons).toHaveCount(3);
  });

  test("renders standard story", async ({ page }) => {
    await page.goto(
      "http://localhost:6006/iframe.html?id=forms-radiogroup--standard"
    );

    const radioGroup = page.locator('[role="radiogroup"]');
    await expect(radioGroup).toBeVisible();

    const radioButtons = page.locator('[role="radio"]');
    await expect(radioButtons).toHaveCount(3);

    // Second option should be selected
    await expect(radioButtons.nth(1)).toHaveAttribute("aria-checked", "true");
  });

  test("renders inverse story", async ({ page }) => {
    await page.goto(
      "http://localhost:6006/iframe.html?id=forms-radiogroup--inverse"
    );

    const radioGroup = page.locator('[role="radiogroup"]');
    await expect(radioGroup).toBeVisible();

    const radioButtons = page.locator('[role="radio"]');
    await expect(radioButtons).toHaveCount(3);

    // First option should be selected
    await expect(radioButtons.first()).toHaveAttribute("aria-checked", "true");
  });

  test("renders interactive story", async ({ page }) => {
    await page.goto(
      "http://localhost:6006/iframe.html?id=forms-radiogroup--interactive"
    );

    const radioGroup = page.locator('[role="radiogroup"]');
    await expect(radioGroup).toBeVisible();

    const radioButtons = page.locator('[role="radio"]');
    await expect(radioButtons).toHaveCount(3);

    // Should show selected value
    await expect(page.locator('text="Selected: option1"')).toBeVisible();
  });

  test("interacts with controls", async ({ page }) => {
    // Test mode control
    await page.selectOption('[data-testid="mode-control"]', "inverse");
    const radioGroup = page.locator('[role="radiogroup"]');
    const radioButtons = page.locator('[role="radio"]');

    // All radio buttons should have inverse styling
    for (let i = 0; i < (await radioButtons.count()); i++) {
      await expect(radioButtons.nth(i)).toHaveClass(
        /outline-\[var\(--color-border-inverse-primary\)\]/
      );
    }

    await page.selectOption('[data-testid="mode-control"]', "standard");
    for (let i = 0; i < (await radioButtons.count()); i++) {
      await expect(radioButtons.nth(i)).toHaveClass(
        /outline-\[var\(--color-border-default-tertiary\)\]/
      );
    }
  });

  test("interacts with value control", async ({ page }) => {
    // Test value control
    await page.fill('[data-testid="value-control"]', "option2");

    const radioButtons = page.locator('[role="radio"]');
    await expect(radioButtons.nth(1)).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons.first()).toHaveAttribute("aria-checked", "false");
    await expect(radioButtons.nth(2)).toHaveAttribute("aria-checked", "false");
  });

  test("handles keyboard navigation", async ({ page }) => {
    const radioButtons = page.locator('[role="radio"]');

    // Focus first radio button
    await radioButtons.first().focus();
    await expect(radioButtons.first()).toBeFocused();

    // Navigate to second radio button
    await page.keyboard.press("Tab");
    await expect(radioButtons.nth(1)).toBeFocused();

    // Navigate to third radio button
    await page.keyboard.press("Tab");
    await expect(radioButtons.nth(2)).toBeFocused();
  });

  test("handles keyboard activation", async ({ page }) => {
    const radioButtons = page.locator('[role="radio"]');

    // Focus second radio button
    await radioButtons.nth(1).focus();

    // Activate with Space
    await page.keyboard.press("Space");
    await expect(radioButtons.nth(1)).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons.first()).toHaveAttribute("aria-checked", "false");

    // Activate third radio button with Enter
    await radioButtons.nth(2).focus();
    await page.keyboard.press("Enter");
    await expect(radioButtons.nth(2)).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons.nth(1)).toHaveAttribute("aria-checked", "false");
  });

  test("handles mouse interaction", async ({ page }) => {
    const radioButtons = page.locator('[role="radio"]');

    // Click second option
    await radioButtons.nth(1).click();
    await expect(radioButtons.nth(1)).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons.first()).toHaveAttribute("aria-checked", "false");

    // Click third option
    await radioButtons.nth(2).click();
    await expect(radioButtons.nth(2)).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons.nth(1)).toHaveAttribute("aria-checked", "false");
  });

  test("maintains single selection", async ({ page }) => {
    const radioButtons = page.locator('[role="radio"]');

    // Click first option
    await radioButtons.first().click();
    await expect(radioButtons.first()).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons.nth(1)).toHaveAttribute("aria-checked", "false");
    await expect(radioButtons.nth(2)).toHaveAttribute("aria-checked", "false");

    // Click second option
    await radioButtons.nth(1).click();
    await expect(radioButtons.first()).toHaveAttribute("aria-checked", "false");
    await expect(radioButtons.nth(1)).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons.nth(2)).toHaveAttribute("aria-checked", "false");
  });

  test("has proper accessibility attributes", async ({ page }) => {
    const radioGroup = page.locator('[role="radiogroup"]');
    const radioButtons = page.locator('[role="radio"]');

    await expect(radioGroup).toHaveAttribute("role", "radiogroup");

    for (let i = 0; i < (await radioButtons.count()); i++) {
      await expect(radioButtons.nth(i)).toHaveAttribute("role", "radio");
      await expect(radioButtons.nth(i)).toHaveAttribute("aria-checked");
      await expect(radioButtons.nth(i)).toHaveAttribute("tabIndex", "0");
    }
  });

  test("shows proper labels", async ({ page }) => {
    await expect(page.locator('text="Option 1"')).toBeVisible();
    await expect(page.locator('text="Option 2"')).toBeVisible();
    await expect(page.locator('text="Option 3"')).toBeVisible();
  });

  test("handles form submission", async ({ page }) => {
    const hiddenInputs = page.locator('input[type="radio"]');
    await expect(hiddenInputs).toHaveCount(3);

    // All should have the same name
    const names = await hiddenInputs.evaluateAll((inputs) =>
      inputs.map((input) => input.getAttribute("name"))
    );
    expect(names.every((name) => name === names[0])).toBe(true);
  });

  test("shows dot indicators correctly", async ({ page }) => {
    const radioButtons = page.locator('[role="radio"]');

    // Initially first option should be selected
    const firstDot = radioButtons.first().locator("div").first();
    await expect(firstDot).toHaveClass(
      /w-\[16px\]/,
      /h-\[16px\]/,
      /rounded-full/
    );

    // Click second option
    await radioButtons.nth(1).click();

    // First dot should be hidden, second should be visible
    const secondDot = radioButtons.nth(1).locator("div").first();
    await expect(secondDot).toHaveClass(
      /w-\[16px\]/,
      /h-\[16px\]/,
      /rounded-full/
    );
  });

  test("handles interactive story state changes", async ({ page }) => {
    await page.goto(
      "http://localhost:6006/iframe.html?id=forms-radiogroup--interactive"
    );

    // Should show initial state
    await expect(page.locator('text="Selected: option1"')).toBeVisible();

    // Click second option
    const radioButtons = page.locator('[role="radio"]');
    await radioButtons.nth(1).click();

    // Should update displayed value
    await expect(page.locator('text="Selected: option2"')).toBeVisible();
  });

  test("maintains focus state", async ({ page }) => {
    const radioButtons = page.locator('[role="radio"]');

    // Focus first radio button
    await radioButtons.first().focus();
    await expect(radioButtons.first()).toBeFocused();

    // Should maintain focus after interaction
    await page.keyboard.press("Space");
    await expect(radioButtons.first()).toBeFocused();
  });

  test("handles different viewport sizes", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    const radioGroup = page.locator('[role="radiogroup"]');
    await expect(radioGroup).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(radioGroup).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(radioGroup).toBeVisible();
  });
});
