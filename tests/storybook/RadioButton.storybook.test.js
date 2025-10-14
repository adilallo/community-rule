import { test, expect } from "@playwright/test";

test.describe("RadioButton Storybook Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "http://localhost:6006/iframe.html?id=forms-radiobutton--default",
    );
  });

  test("renders default story", async ({ page }) => {
    const radioButton = page.locator('[role="radio"]');
    await expect(radioButton).toBeVisible();
    await expect(radioButton).toHaveAttribute("aria-checked", "false");
  });

  test("renders checked story", async ({ page }) => {
    await page.goto(
      "http://localhost:6006/iframe.html?id=forms-radiobutton--checked",
    );

    const radioButton = page.locator('[role="radio"]');
    await expect(radioButton).toBeVisible();
    await expect(radioButton).toHaveAttribute("aria-checked", "true");
  });

  test("renders standard story", async ({ page }) => {
    await page.goto(
      "http://localhost:6006/iframe.html?id=forms-radiobutton--standard",
    );

    const radioButtons = page.locator('[role="radio"]');
    await expect(radioButtons).toHaveCount(2);

    // First should be unchecked
    await expect(radioButtons.first()).toHaveAttribute("aria-checked", "false");
    // Second should be checked
    await expect(radioButtons.nth(1)).toHaveAttribute("aria-checked", "true");
  });

  test("renders inverse story", async ({ page }) => {
    await page.goto(
      "http://localhost:6006/iframe.html?id=forms-radiobutton--inverse",
    );

    const radioButtons = page.locator('[role="radio"]');
    await expect(radioButtons).toHaveCount(2);

    // First should be unchecked
    await expect(radioButtons.first()).toHaveAttribute("aria-checked", "false");
    // Second should be checked
    await expect(radioButtons.nth(1)).toHaveAttribute("aria-checked", "true");
  });

  test("interacts with controls", async ({ page }) => {
    // Test checked control
    await page.check('[data-testid="checked-control"]');
    const radioButton = page.locator('[role="radio"]');
    await expect(radioButton).toHaveAttribute("aria-checked", "true");

    await page.uncheck('[data-testid="checked-control"]');
    await expect(radioButton).toHaveAttribute("aria-checked", "false");
  });

  test("interacts with mode control", async ({ page }) => {
    // Test mode control
    await page.selectOption('[data-testid="mode-control"]', "inverse");
    const radioButton = page.locator('[role="radio"]');
    await expect(radioButton).toHaveClass(
      /outline-\[var\(--color-border-inverse-primary\)\]/,
    );

    await page.selectOption('[data-testid="mode-control"]', "standard");
    await expect(radioButton).toHaveClass(
      /outline-\[var\(--color-border-default-tertiary\)\]/,
    );
  });

  test("interacts with state control", async ({ page }) => {
    // Test state control
    await page.selectOption('[data-testid="state-control"]', "focus");
    const radioButton = page.locator('[role="radio"]');
    await expect(radioButton).toHaveClass(/focus:outline/);

    await page.selectOption('[data-testid="state-control"]', "hover");
    await expect(radioButton).toHaveClass(/hover:outline/);
  });

  test("interacts with label control", async ({ page }) => {
    // Test label control
    await page.fill('[data-testid="label-control"]', "Custom Label");
    await expect(page.locator('text="Custom Label"')).toBeVisible();
  });

  test("handles keyboard interaction", async ({ page }) => {
    const radioButton = page.locator('[role="radio"]');
    await radioButton.focus();
    await expect(radioButton).toBeFocused();

    // Test Space key
    await page.keyboard.press("Space");
    await expect(radioButton).toHaveAttribute("aria-checked", "true");

    // Test Enter key
    await page.keyboard.press("Enter");
    await expect(radioButton).toHaveAttribute("aria-checked", "false");
  });

  test("has proper accessibility attributes", async ({ page }) => {
    const radioButton = page.locator('[role="radio"]');

    await expect(radioButton).toHaveAttribute("role", "radio");
    await expect(radioButton).toHaveAttribute("aria-checked");
    await expect(radioButton).toHaveAttribute("tabIndex", "0");
  });

  test("shows dot indicator when checked", async ({ page }) => {
    await page.check('[data-testid="checked-control"]');

    const radioButton = page.locator('[role="radio"]');
    const dot = radioButton.locator("div").first();
    await expect(dot).toHaveClass(/w-\[16px\]/, /h-\[16px\]/, /rounded-full/);
  });

  test("hides dot indicator when unchecked", async ({ page }) => {
    await page.uncheck('[data-testid="checked-control"]');

    const radioButton = page.locator('[role="radio"]');
    const dot = radioButton.locator("div").first();
    await expect(dot).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  });

  test("maintains focus state", async ({ page }) => {
    const radioButton = page.locator('[role="radio"]');
    await radioButton.focus();
    await expect(radioButton).toBeFocused();

    // Should maintain focus after interaction
    await page.keyboard.press("Space");
    await expect(radioButton).toBeFocused();
  });

  test("handles mouse interaction", async ({ page }) => {
    const radioButton = page.locator('[role="radio"]');

    // Click to check
    await radioButton.click();
    await expect(radioButton).toHaveAttribute("aria-checked", "true");

    // Click to uncheck
    await radioButton.click();
    await expect(radioButton).toHaveAttribute("aria-checked", "false");
  });

  test("shows proper styling for different modes", async ({ page }) => {
    // Test standard mode
    await page.selectOption('[data-testid="mode-control"]', "standard");
    const radioButton = page.locator('[role="radio"]');
    await expect(radioButton).toHaveClass(
      /outline-\[var\(--color-border-default-tertiary\)\]/,
    );

    // Test inverse mode
    await page.selectOption('[data-testid="mode-control"]', "inverse");
    await expect(radioButton).toHaveClass(
      /outline-\[var\(--color-border-inverse-primary\)\]/,
    );
  });

  test("handles form submission", async ({ page }) => {
    const hiddenInput = page.locator('input[type="radio"]');
    await expect(hiddenInput).toBeVisible();

    // Should be included in form data
    await page.check('[data-testid="checked-control"]');
    await expect(hiddenInput).toBeChecked();
  });
});
