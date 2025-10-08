import { test, expect } from "@playwright/test";

test.describe("Checkbox Visual Regression Tests", () => {
  test("Standard mode - unchecked", async ({ page }) => {
    await page.goto("/forms");
    await expect(
      page.locator('[data-testid="standard-unchecked"]')
    ).toBeVisible();
    await expect(page).toHaveScreenshot("checkbox-standard-unchecked.png");
  });

  test("Standard mode - checked", async ({ page }) => {
    await page.goto("/forms");
    await expect(
      page.locator('[data-testid="standard-checked"]')
    ).toBeVisible();
    await expect(page).toHaveScreenshot("checkbox-standard-checked.png");
  });

  test("Inverse mode - unchecked", async ({ page }) => {
    await page.goto("/forms");
    await expect(
      page.locator('[data-testid="inverse-unchecked"]')
    ).toBeVisible();
    await expect(page).toHaveScreenshot("checkbox-inverse-unchecked.png");
  });

  test("Inverse mode - checked", async ({ page }) => {
    await page.goto("/forms");
    await expect(page.locator('[data-testid="inverse-checked"]')).toBeVisible();
    await expect(page).toHaveScreenshot("checkbox-inverse-checked.png");
  });

  test("Standard mode - hover state", async ({ page }) => {
    await page.goto("/forms");
    const checkbox = page.locator('[data-testid="standard-unchecked"]');
    await checkbox.hover();
    await expect(page).toHaveScreenshot("checkbox-standard-hover.png");
  });

  test("Standard mode - focus state", async ({ page }) => {
    await page.goto("/forms");
    const checkbox = page.locator('[data-testid="standard-unchecked"]');
    await checkbox.focus();
    await expect(page).toHaveScreenshot("checkbox-standard-focus.png");
  });

  test("Inverse mode - hover state", async ({ page }) => {
    await page.goto("/forms");
    const checkbox = page.locator('[data-testid="inverse-unchecked"]');
    await checkbox.hover();
    await expect(page).toHaveScreenshot("checkbox-inverse-hover.png");
  });

  test("Inverse mode - focus state", async ({ page }) => {
    await page.goto("/forms");
    const checkbox = page.locator('[data-testid="inverse-unchecked"]');
    await checkbox.focus();
    await expect(page).toHaveScreenshot("checkbox-inverse-focus.png");
  });

  test("Disabled state - standard", async ({ page }) => {
    await page.goto("/forms");
    await expect(
      page.locator('[data-testid="standard-disabled"]')
    ).toBeVisible();
    await expect(page).toHaveScreenshot("checkbox-standard-disabled.png");
  });

  test("Disabled state - inverse", async ({ page }) => {
    await page.goto("/forms");
    await expect(
      page.locator('[data-testid="inverse-disabled"]')
    ).toBeVisible();
    await expect(page).toHaveScreenshot("checkbox-inverse-disabled.png");
  });

  test("All variations grid", async ({ page }) => {
    await page.goto("/forms");
    await expect(page.locator('[data-testid="checkbox-grid"]')).toBeVisible();
    await expect(page).toHaveScreenshot("checkbox-all-variations.png");
  });
});
