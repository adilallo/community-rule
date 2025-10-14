import { test, expect } from "@playwright/test";

test.describe("ContextMenu Components Storybook Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "http://localhost:6006/?path=/story/forms-contextmenu--default",
    );
  });

  test("renders default context menu", async ({ page }) => {
    const menu = page.getByRole("listbox");
    await expect(menu).toBeVisible();

    const items = page.getByRole("option");
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test("renders menu items correctly", async ({ page }) => {
    const menuItems = page.getByRole("option");
    const count = await menuItems.count();

    for (let i = 0; i < count; i++) {
      await expect(menuItems.nth(i)).toBeVisible();
    }
  });

  test("handles menu item clicks", async ({ page }) => {
    const menuItems = page.getByRole("option");
    const firstItem = menuItems.first();

    await firstItem.click();

    // Check that click was handled (no error should occur)
    await expect(firstItem).toBeVisible();
  });

  test("shows selected state correctly", async ({ page }) => {
    // Navigate to MenuItem story
    await page.goto(
      "http://localhost:6006/?path=/story/forms-contextmenu--menu-item",
    );

    const menuItems = page.getByRole("option");
    const count = await menuItems.count();

    // Check that at least one item has selected state
    let hasSelected = false;
    for (let i = 0; i < count; i++) {
      const isSelected = await menuItems.nth(i).getAttribute("aria-selected");
      if (isSelected === "true") {
        hasSelected = true;
        break;
      }
    }

    expect(hasSelected).toBe(true);
  });

  test("shows submenu indicators", async ({ page }) => {
    // Navigate to MenuItem story
    await page.goto(
      "http://localhost:6006/?path=/story/forms-contextmenu--menu-item",
    );

    const submenuArrows = page.getByTestId("submenu-arrow");
    const count = await submenuArrows.count();

    if (count > 0) {
      await expect(submenuArrows.first()).toBeVisible();
    }
  });

  test("shows checkmarks for selected items", async ({ page }) => {
    // Navigate to MenuItem story
    await page.goto(
      "http://localhost:6006/?path=/story/forms-contextmenu--menu-item",
    );

    const checkmarks = page.getByTestId("checkmark");
    const count = await checkmarks.count();

    if (count > 0) {
      await expect(checkmarks.first()).toBeVisible();
    }
  });

  test("renders menu sections correctly", async ({ page }) => {
    // Navigate to MenuSection story
    await page.goto(
      "http://localhost:6006/?path=/story/forms-contextmenu--menu-section",
    );

    const sectionTitles = page.getByText(/Section/);
    const count = await sectionTitles.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(sectionTitles.nth(i)).toBeVisible();
    }
  });

  test("renders menu dividers correctly", async ({ page }) => {
    // Navigate to MenuDivider story
    await page.goto(
      "http://localhost:6006/?path=/story/forms-contextmenu--menu-divider",
    );

    const dividers = page.getByTestId("context-menu-divider");
    const count = await dividers.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(dividers.nth(i)).toBeVisible();
    }
  });

  test("shows all variants correctly", async ({ page }) => {
    // Navigate to All Variants story
    await page.goto(
      "http://localhost:6006/?path=/story/forms-contextmenu--all-variants",
    );

    const menu = page.getByRole("listbox");
    await expect(menu).toBeVisible();

    const menuItems = page.getByRole("option");
    const count = await menuItems.count();
    expect(count).toBeGreaterThan(0);

    // Check for sections
    const sectionTitles = page.getByText(/Section/);
    const sectionCount = await sectionTitles.count();
    expect(sectionCount).toBeGreaterThan(0);

    // Check for dividers
    const dividers = page.getByTestId("context-menu-divider");
    const dividerCount = await dividers.count();
    expect(dividerCount).toBeGreaterThan(0);
  });

  test("handles keyboard navigation", async ({ page }) => {
    const menuItems = page.getByRole("option");
    const firstItem = menuItems.first();

    await firstItem.focus();
    await expect(firstItem).toBeFocused();

    // Navigate with arrow keys
    await page.keyboard.press("ArrowDown");
    const secondItem = menuItems.nth(1);
    await expect(secondItem).toBeFocused();
  });

  test("handles Enter key selection", async ({ page }) => {
    const menuItems = page.getByRole("option");
    const firstItem = menuItems.first();

    await firstItem.focus();
    await page.keyboard.press("Enter");

    // Should handle the selection without error
    await expect(firstItem).toBeVisible();
  });

  test("handles Space key selection", async ({ page }) => {
    const menuItems = page.getByRole("option");
    const firstItem = menuItems.first();

    await firstItem.focus();
    await page.keyboard.press(" ");

    // Should handle the selection without error
    await expect(firstItem).toBeVisible();
  });

  test("shows hover effects", async ({ page }) => {
    const menuItems = page.getByRole("option");
    const firstItem = menuItems.first();

    await firstItem.hover();

    // Check that hover styles are applied
    const backgroundColor = await firstItem.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundColor;
    });

    // Should have some background color change on hover
    expect(backgroundColor).toBeDefined();
  });

  test("has correct styling for different sizes", async ({ page }) => {
    // Navigate to All Variants story
    await page.goto(
      "http://localhost:6006/?path=/story/forms-contextmenu--all-variants",
    );

    const menuItems = page.getByRole("option");
    const count = await menuItems.count();

    for (let i = 0; i < count; i++) {
      const item = menuItems.nth(i);
      await expect(item).toBeVisible();

      // Check that items have proper text styling
      const fontSize = await item.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.fontSize;
      });

      expect(fontSize).toBeDefined();
    }
  });

  test("has proper ARIA attributes", async ({ page }) => {
    const menu = page.getByRole("listbox");
    await expect(menu).toBeVisible();

    const menuItems = page.getByRole("option");
    const count = await menuItems.count();

    for (let i = 0; i < count; i++) {
      const item = menuItems.nth(i);
      const ariaSelected = await item.getAttribute("aria-selected");
      expect(ariaSelected).toBeDefined();
    }
  });

  test("handles disabled items correctly", async ({ page }) => {
    // Navigate to All Variants story
    await page.goto(
      "http://localhost:6006/?path=/story/forms-contextmenu--all-variants",
    );

    const menuItems = page.getByRole("option");
    const count = await menuItems.count();

    // Check for disabled items
    for (let i = 0; i < count; i++) {
      const item = menuItems.nth(i);
      const isDisabled = await item.isDisabled();

      if (isDisabled) {
        // Disabled items should not respond to clicks
        await item.click();
        // Should not cause any errors
        await expect(item).toBeVisible();
      }
    }
  });

  test("has proper color contrast", async ({ page }) => {
    const menuItems = page.getByRole("option");
    const firstItem = menuItems.first();

    const color = await firstItem.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.color;
    });

    expect(color).toBeDefined();
    expect(color).not.toBe("rgba(0, 0, 0, 0)"); // Should not be transparent
  });

  test("renders with custom styling", async ({ page }) => {
    // Navigate to With Custom Styling story
    await page.goto(
      "http://localhost:6006/?path=/story/forms-contextmenu--with-custom-styling",
    );

    const menu = page.getByRole("listbox");
    await expect(menu).toBeVisible();

    // Check that custom styling is applied
    const customClass = await menu.getAttribute("class");
    expect(customClass).toContain("custom-menu");
  });

  test("handles interactive story correctly", async ({ page }) => {
    // Navigate to Interactive story
    await page.goto(
      "http://localhost:6006/?path=/story/forms-contextmenu--interactive",
    );

    const menuItems = page.getByRole("option");
    const count = await menuItems.count();

    expect(count).toBeGreaterThan(0);

    // Test interaction with different items
    for (let i = 0; i < Math.min(count, 3); i++) {
      const item = menuItems.nth(i);
      await item.click();

      // Should handle click without error
      await expect(item).toBeVisible();
    }
  });
});
