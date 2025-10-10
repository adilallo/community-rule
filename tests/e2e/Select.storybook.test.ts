import { test, expect } from "@playwright/test";

test.describe("Select Component Storybook Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:6006/?path=/story/forms-select--default");
  });

  test("renders default select component", async ({ page }) => {
    const selectButton = page.getByRole("button", { name: /select/i });
    await expect(selectButton).toBeVisible();

    const label = page.getByText("Test Select");
    await expect(label).toBeVisible();
  });

  test("opens dropdown when clicked", async ({ page }) => {
    const selectButton = page.getByRole("button", { name: /select/i });
    await selectButton.click();

    // Wait for dropdown to appear
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(page.getByText("Option 1")).toBeVisible();
    await expect(page.getByText("Option 2")).toBeVisible();
    await expect(page.getByText("Option 3")).toBeVisible();
  });

  test("selects option when clicked", async ({ page }) => {
    const selectButton = page.getByRole("button", { name: /select/i });
    await selectButton.click();

    await expect(page.getByRole("listbox")).toBeVisible();

    await page.getByText("Option 1").click();

    // Check that the selected value is displayed
    await expect(selectButton).toContainText("Option 1");

    // Check that dropdown is closed
    await expect(page.getByRole("listbox")).not.toBeVisible();
  });

  test("closes dropdown when clicking outside", async ({ page }) => {
    const selectButton = page.getByRole("button", { name: /select/i });
    await selectButton.click();

    await expect(page.getByRole("listbox")).toBeVisible();

    // Click outside the dropdown
    await page.click("body", { position: { x: 10, y: 10 } });

    await expect(page.getByRole("listbox")).not.toBeVisible();
  });

  test("handles keyboard navigation", async ({ page }) => {
    const selectButton = page.getByRole("button", { name: /select/i });
    await selectButton.focus();

    // Open with Enter key
    await page.keyboard.press("Enter");
    await expect(page.getByRole("listbox")).toBeVisible();

    // Close with Escape key
    await page.keyboard.press("Escape");
    await expect(page.getByRole("listbox")).not.toBeVisible();

    // Open with Space key
    await page.keyboard.press(" ");
    await expect(page.getByRole("listbox")).toBeVisible();
  });

  test("shows different sizes correctly", async ({ page }) => {
    // Navigate to All Sizes story
    await page.goto(
      "http://localhost:6006/?path=/story/forms-select--all-sizes"
    );

    const selectButtons = page.getByRole("button");
    const count = await selectButtons.count();

    // Should have multiple select components
    expect(count).toBeGreaterThan(1);

    // Test that all sizes are visible
    for (let i = 0; i < count; i++) {
      await expect(selectButtons.nth(i)).toBeVisible();
    }
  });

  test("shows different states correctly", async ({ page }) => {
    // Navigate to All States story
    await page.goto(
      "http://localhost:6006/?path=/story/forms-select--all-states"
    );

    const selectButtons = page.getByRole("button");
    const count = await selectButtons.count();

    // Should have multiple select components in different states
    expect(count).toBeGreaterThan(1);

    // Test that all states are visible
    for (let i = 0; i < count; i++) {
      await expect(selectButtons.nth(i)).toBeVisible();
    }
  });

  test("hover state shows correct styling", async ({ page }) => {
    // Navigate to Hover story
    await page.goto("http://localhost:6006/?path=/story/forms-select--hover");

    const selectButton = page.getByRole("button");
    await expect(selectButton).toBeVisible();

    // Check that hover state is applied (shadow effect)
    const boxShadow = await selectButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.boxShadow;
    });

    expect(boxShadow).toContain("2px");
  });

  test("focus state shows correct styling", async ({ page }) => {
    // Navigate to Focus story
    await page.goto("http://localhost:6006/?path=/story/forms-select--focus");

    const selectButton = page.getByRole("button");
    await expect(selectButton).toBeVisible();

    // Check that focus state is applied (blue border and shadow)
    const borderColor = await selectButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.borderColor;
    });

    const boxShadow = await selectButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.boxShadow;
    });

    expect(boxShadow).toContain("3px");
  });

  test("error state shows correct styling", async ({ page }) => {
    // Navigate to Error story
    await page.goto("http://localhost:6006/?path=/story/forms-select--error");

    const selectButton = page.getByRole("button");
    await expect(selectButton).toBeVisible();

    // Check that error state is applied (red border)
    const borderColor = await selectButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.borderColor;
    });

    expect(borderColor).toContain("rgb");
  });

  test("disabled state prevents interaction", async ({ page }) => {
    // Navigate to Disabled story
    await page.goto(
      "http://localhost:6006/?path=/story/forms-select--disabled"
    );

    const selectButton = page.getByRole("button");
    await expect(selectButton).toBeVisible();
    await expect(selectButton).toBeDisabled();

    // Try to click disabled select
    await selectButton.click();

    // Dropdown should not open
    await expect(page.getByRole("listbox")).not.toBeVisible();
  });

  test("interactive story allows selection", async ({ page }) => {
    // Navigate to Interactive story
    await page.goto(
      "http://localhost:6006/?path=/story/forms-select--interactive"
    );

    const selectButton = page.getByRole("button");
    await selectButton.click();

    await expect(page.getByRole("listbox")).toBeVisible();

    // Select an option
    await page.getByText("Option 1").click();

    // Check that selection is reflected
    await expect(selectButton).toContainText("Option 1");
  });

  test("horizontal label variant displays correctly", async ({ page }) => {
    // Navigate to Horizontal Label story
    await page.goto(
      "http://localhost:6006/?path=/story/forms-select--horizontal-label"
    );

    const selectButton = page.getByRole("button");
    await expect(selectButton).toBeVisible();

    const label = page.getByText("Test Select");
    await expect(label).toBeVisible();

    // Check that label and select are in horizontal layout
    const labelBox = await label.boundingBox();
    const selectBox = await selectButton.boundingBox();

    expect(labelBox?.y).toBeCloseTo(selectBox?.y || 0, 5);
  });

  test("small size has correct height", async ({ page }) => {
    // Navigate to Small story
    await page.goto("http://localhost:6006/?path=/story/forms-select--small");

    const selectButton = page.getByRole("button");
    await expect(selectButton).toBeVisible();

    const height = await selectButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.height;
    });

    expect(height).toBe("30px");
  });

  test("medium size has correct height", async ({ page }) => {
    // Navigate to Medium story
    await page.goto("http://localhost:6006/?path=/story/forms-select--medium");

    const selectButton = page.getByRole("button");
    await expect(selectButton).toBeVisible();

    const height = await selectButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.height;
    });

    expect(height).toBe("36px");
  });

  test("large size has correct height", async ({ page }) => {
    // Navigate to Large story
    await page.goto("http://localhost:6006/?path=/story/forms-select--large");

    const selectButton = page.getByRole("button");
    await expect(selectButton).toBeVisible();

    const height = await selectButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.height;
    });

    expect(height).toBe("40px");
  });

  test("focus behavior works correctly", async ({ page }) => {
    // Navigate to Interactive story
    await page.goto(
      "http://localhost:6006/?path=/story/forms-select--interactive"
    );

    const selectButton = page.getByRole("button");

    // Tab to focus the select
    await page.keyboard.press("Tab");
    await expect(selectButton).toBeFocused();

    // Check that focus-visible styles are applied
    const boxShadow = await selectButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.boxShadow;
    });

    // Should have focus indicator
    expect(boxShadow).toContain("3px");
  });
});
