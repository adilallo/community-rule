import { test, expect } from "@playwright/test";

test.describe("Checkbox Storybook Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:6006");
  });

  test("should load Checkbox stories", async ({ page }) => {
    // Navigate to Checkbox stories
    await page.click('[data-testid="Forms"]');
    await page.click('[data-testid="Checkbox"]');

    // Check that the stories are loaded
    await expect(page.locator('[data-testid="Default"]')).toBeVisible();
    await expect(page.locator('[data-testid="Checked"]')).toBeVisible();
    await expect(page.locator('[data-testid="Standard"]')).toBeVisible();
    await expect(page.locator('[data-testid="Inverse"]')).toBeVisible();
  });

  test("Default story should render correctly", async ({ page }) => {
    await page.click('[data-testid="Forms"]');
    await page.click('[data-testid="Checkbox"]');
    await page.click('[data-testid="Default"]');

    // Check that the checkbox is rendered
    const checkbox = page.locator('[role="checkbox"]').first();
    await expect(checkbox).toBeVisible();
    await expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  test("Checked story should render correctly", async ({ page }) => {
    await page.click('[data-testid="Forms"]');
    await page.click('[data-testid="Checkbox"]');
    await page.click('[data-testid="Checked"]');

    // Check that the checkbox is checked
    const checkbox = page.locator('[role="checkbox"]').first();
    await expect(checkbox).toBeVisible();
    await expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  test("Standard story should show standard mode checkboxes", async ({
    page,
  }) => {
    await page.click('[data-testid="Forms"]');
    await page.click('[data-testid="Checkbox"]');
    await page.click('[data-testid="Standard"]');

    // Check that multiple checkboxes are rendered
    const checkboxes = page.locator('[role="checkbox"]');
    await expect(checkboxes).toHaveCount(2); // Unchecked and checked

    // Check that they have proper styling (standard mode)
    const firstCheckbox = checkboxes.first();
    await expect(firstCheckbox).toBeVisible();
  });

  test("Inverse story should show inverse mode checkboxes", async ({
    page,
  }) => {
    await page.click('[data-testid="Forms"]');
    await page.click('[data-testid="Checkbox"]');
    await page.click('[data-testid="Inverse"]');

    // Check that multiple checkboxes are rendered
    const checkboxes = page.locator('[role="checkbox"]');
    await expect(checkboxes).toHaveCount(2); // Unchecked and checked

    // Check that they have proper styling (inverse mode)
    const firstCheckbox = checkboxes.first();
    await expect(firstCheckbox).toBeVisible();
  });

  test("should have proper controls in Controls panel", async ({ page }) => {
    await page.click('[data-testid="Forms"]');
    await page.click('[data-testid="Checkbox"]');
    await page.click('[data-testid="Default"]');

    // Check that controls are available
    await expect(page.locator('[data-testid="control-checked"]')).toBeVisible();
    await expect(page.locator('[data-testid="control-mode"]')).toBeVisible();
    await expect(page.locator('[data-testid="control-state"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="control-disabled"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="control-label"]')).toBeVisible();
  });

  test("should update when controls are changed", async ({ page }) => {
    await page.click('[data-testid="Forms"]');
    await page.click('[data-testid="Checkbox"]');
    await page.click('[data-testid="Default"]');

    // Toggle checked control
    await page.click('[data-testid="control-checked"]');

    // Check that the checkbox is now checked
    const checkbox = page.locator('[role="checkbox"]').first();
    await expect(checkbox).toHaveAttribute("aria-checked", "true");

    // Toggle back
    await page.click('[data-testid="control-checked"]');
    await expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  test("should change mode when mode control is changed", async ({ page }) => {
    await page.click('[data-testid="Forms"]');
    await page.click('[data-testid="Checkbox"]');
    await page.click('[data-testid="Default"]');

    // Change mode to inverse
    await page.selectOption('[data-testid="control-mode"]', "inverse");

    // Check that the checkbox styling has changed (inverse mode)
    const checkbox = page.locator('[role="checkbox"]').first();
    await expect(checkbox).toBeVisible();

    // Change back to standard
    await page.selectOption('[data-testid="control-mode"]', "standard");
    await expect(checkbox).toBeVisible();
  });

  test("should show disabled state when disabled control is toggled", async ({
    page,
  }) => {
    await page.click('[data-testid="Forms"]');
    await page.click('[data-testid="Checkbox"]');
    await page.click('[data-testid="Default"]');

    // Toggle disabled control
    await page.click('[data-testid="control-disabled"]');

    // Check that the checkbox is now disabled
    const checkbox = page.locator('[role="checkbox"]').first();
    await expect(checkbox).toHaveAttribute("aria-disabled", "true");
    await expect(checkbox).toHaveAttribute("tabIndex", "-1");

    // Toggle back
    await page.click('[data-testid="control-disabled"]');
    await expect(checkbox).toHaveAttribute("aria-disabled", "false");
    await expect(checkbox).toHaveAttribute("tabIndex", "0");
  });

  test("should update label when label control is changed", async ({
    page,
  }) => {
    await page.click('[data-testid="Forms"]');
    await page.click('[data-testid="Checkbox"]');
    await page.click('[data-testid="Default"]');

    // Change label
    await page.fill('[data-testid="control-label"]', "Custom Label");

    // Check that the label has updated
    await expect(page.locator("text=Custom Label")).toBeVisible();
  });

  test("should have proper accessibility in Storybook", async ({ page }) => {
    await page.click('[data-testid="Forms"]');
    await page.click('[data-testid="Checkbox"]');
    await page.click('[data-testid="Default"]');

    // Check accessibility attributes
    const checkbox = page.locator('[role="checkbox"]').first();
    await expect(checkbox).toHaveAttribute("role", "checkbox");
    await expect(checkbox).toHaveAttribute("aria-checked");
    await expect(checkbox).toHaveAttribute("tabIndex");
  });

  test("should support keyboard navigation in Storybook", async ({ page }) => {
    await page.click('[data-testid="Forms"]');
    await page.click('[data-testid="Checkbox"]');
    await page.click('[data-testid="Default"]');

    const checkbox = page.locator('[role="checkbox"]').first();

    // Focus the checkbox
    await checkbox.focus();
    await expect(checkbox).toBeFocused();

    // Test keyboard activation
    await checkbox.press(" ");
    await expect(checkbox).toHaveAttribute("aria-checked", "true");

    await checkbox.press(" ");
    await expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  test("should show proper documentation", async ({ page }) => {
    await page.click('[data-testid="Forms"]');
    await page.click('[data-testid="Checkbox"]');

    // Check that documentation is available
    await expect(page.locator('[data-testid="docs-tab"]')).toBeVisible();

    // Click on docs tab
    await page.click('[data-testid="docs-tab"]');

    // Check that documentation content is shown
    await expect(page.locator("text=Checkbox")).toBeVisible();
    await expect(page.locator("text=Props")).toBeVisible();
  });

  test("should have proper story navigation", async ({ page }) => {
    await page.click('[data-testid="Forms"]');
    await page.click('[data-testid="Checkbox"]');

    // Test navigation between stories
    const stories = ["Default", "Checked", "Standard", "Inverse"];

    for (const story of stories) {
      await page.click(`[data-testid="${story}"]`);
      await expect(page.locator('[role="checkbox"]').first()).toBeVisible();
    }
  });

  test("should maintain state between story switches", async ({ page }) => {
    await page.click('[data-testid="Forms"]');
    await page.click('[data-testid="Checkbox"]');
    await page.click('[data-testid="Default"]');

    // Interact with checkbox
    const checkbox = page.locator('[role="checkbox"]').first();
    await checkbox.click();
    await expect(checkbox).toHaveAttribute("aria-checked", "true");

    // Switch to another story and back
    await page.click('[data-testid="Checked"]');
    await page.click('[data-testid="Default"]');

    // Check that the state is maintained
    await expect(checkbox).toHaveAttribute("aria-checked", "true");
  });
});
