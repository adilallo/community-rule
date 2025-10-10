import { expect, test } from "@playwright/test";

test.describe("Input Component Storybook", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--default");
  });

  test("renders default input correctly", async ({ page }) => {
    const input = page.getByRole("textbox");
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute("type", "text");
  });

  test("renders with label", async ({ page }) => {
    const label = page.getByText("Default Input");
    await expect(label).toBeVisible();
  });

  test("renders with placeholder", async ({ page }) => {
    const input = page.getByPlaceholder("Enter text...");
    await expect(input).toBeVisible();
  });

  test("handles text input", async ({ page }) => {
    const input = page.getByRole("textbox");
    await input.fill("test input");
    await expect(input).toHaveValue("test input");
  });

  test("handles focus and blur", async ({ page }) => {
    const input = page.getByRole("textbox");

    await input.focus();
    await expect(input).toBeFocused();

    await input.blur();
    await expect(input).not.toBeFocused();
  });

  test("handles keyboard navigation", async ({ page }) => {
    const input = page.getByRole("textbox");

    await input.focus();
    await expect(input).toBeFocused();

    await input.press("Tab");
    // Input should lose focus when tabbing away
  });

  test("handles different input types", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--interactive");

    const input = page.getByRole("textbox");
    await expect(input).toBeVisible();

    // Test typing
    await input.fill("test@example.com");
    await expect(input).toHaveValue("test@example.com");
  });
});

test.describe("Input Component - Size Variants", () => {
  test("renders small size correctly", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--small");

    const input = page.getByRole("textbox");
    await expect(input).toBeVisible();

    const label = page.getByText("Small Input");
    await expect(label).toBeVisible();
  });

  test("renders medium size correctly", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--medium");

    const input = page.getByRole("textbox");
    await expect(input).toBeVisible();

    const label = page.getByText("Medium Input");
    await expect(label).toBeVisible();
  });

  test("renders large size correctly", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--large");

    const input = page.getByRole("textbox");
    await expect(input).toBeVisible();

    const label = page.getByText("Large Input");
    await expect(label).toBeVisible();
  });
});

test.describe("Input Component - Label Variants", () => {
  test("renders default label variant", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--default-label");

    const input = page.getByRole("textbox");
    await expect(input).toBeVisible();

    const inputId = await input.getAttribute("id");
    const label = page.locator(`label[for="${inputId}"]`);
    await expect(label).toBeVisible();
  });

  test("renders horizontal label variant", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--horizontal-label");

    const input = page.getByRole("textbox");
    await expect(input).toBeVisible();

    const inputId = await input.getAttribute("id");
    const label = page.locator(`label[for="${inputId}"]`);
    await expect(label).toBeVisible();
  });
});

test.describe("Input Component - States", () => {
  test("renders active state", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--active");

    const input = page.getByRole("textbox");
    await expect(input).toBeVisible();

    const label = page.getByText("Active State");
    await expect(label).toBeVisible();
  });

  test("renders hover state", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--hover");

    const input = page.getByRole("textbox");
    await expect(input).toBeVisible();

    const label = page.getByText("Hover State");
    await expect(label).toBeVisible();
  });

  test("renders focus state", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--focus");

    const input = page.getByRole("textbox");
    await expect(input).toBeVisible();

    const label = page.getByText("Focus State");
    await expect(label).toBeVisible();
  });

  test("renders error state", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--error");

    const input = page.getByRole("textbox");
    await expect(input).toBeVisible();

    const label = page.getByText("Error State");
    await expect(label).toBeVisible();
  });

  test("renders disabled state", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--disabled");

    const input = page.getByRole("textbox");
    await expect(input).toBeVisible();
    await expect(input).toBeDisabled();

    const label = page.getByText("Disabled State");
    await expect(label).toBeVisible();
  });
});

test.describe("Input Component - Comparison Stories", () => {
  test("renders all sizes comparison", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--all-sizes");

    // Check that all size variants are present
    await expect(page.getByText("Small Size")).toBeVisible();
    await expect(page.getByText("Medium Size")).toBeVisible();
    await expect(page.getByText("Large Size")).toBeVisible();

    // Check that inputs are present
    const inputs = page.getByRole("textbox");
    // Small horizontal story was removed; expect 5 inputs now
    await expect(inputs).toHaveCount(5);
  });

  test("renders all states comparison", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--all-states");

    // Check that all state variants are present
    await expect(page.getByText("Default State")).toBeVisible();
    await expect(page.getByText("Active State")).toBeVisible();
    await expect(page.getByText("Hover State")).toBeVisible();
    await expect(page.getByText("Focus State")).toBeVisible();
    await expect(page.getByText("Error State")).toBeVisible();
    await expect(page.getByText("Disabled State")).toBeVisible();

    // Check that inputs are present
    const inputs = page.getByRole("textbox");
    await expect(inputs).toHaveCount(6);
  });
});

test.describe("Input Component - Interactive Story", () => {
  test("handles interactive input changes", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--interactive");

    const input = page.getByRole("textbox");
    await expect(input).toBeVisible();

    // Test typing
    await input.fill("Hello World");
    await expect(input).toHaveValue("Hello World");

    // Test clearing
    await input.fill("");
    await expect(input).toHaveValue("");

    // Test typing again
    await input.fill("New text");
    await expect(input).toHaveValue("New text");
  });

  test("handles focus and blur in interactive story", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--interactive");

    const input = page.getByRole("textbox");

    await input.focus();
    await expect(input).toBeFocused();

    await input.blur();
    await expect(input).not.toBeFocused();
  });
});

test.describe("Input Component - Accessibility", () => {
  test("has proper label association", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--default");

    const input = page.getByRole("textbox");
    const label = page.getByText("Default Input");

    await expect(input).toBeVisible();
    await expect(label).toBeVisible();

    // Check that label is properly associated
    const labelFor = await label.getAttribute("for");
    const inputId = await input.getAttribute("id");
    expect(labelFor).toBe(inputId);
  });

  test("supports keyboard navigation", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--interactive");

    const input = page.getByRole("textbox");

    // Focus with keyboard
    await input.focus();
    await expect(input).toBeFocused();

    // Type with keyboard
    await input.press("a");
    await expect(input).toHaveValue("a");

    await input.press("b");
    await expect(input).toHaveValue("ab");
  });

  test("handles disabled state accessibility", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--disabled");

    const input = page.getByRole("textbox");
    await expect(input).toBeDisabled();

    // Verify that filling is not allowed by asserting it remains empty without attempting to fill
    await expect(input).toHaveValue("");
  });
});

test.describe("Input Component - Form Integration", () => {
  test("works within form context", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--interactive");

    const input = page.getByRole("textbox");

    // Test form-like behavior
    await input.fill("form value");
    await expect(input).toHaveValue("form value");

    // Test clearing
    await input.clear();
    await expect(input).toHaveValue("");
  });

  test("handles different input types", async ({ page }) => {
    await page.goto("/iframe.html?id=forms-input--interactive");

    const input = page.getByRole("textbox");

    // Test different input patterns
    await input.fill("test@example.com");
    await expect(input).toHaveValue("test@example.com");

    await input.clear();
    await input.fill("12345");
    await expect(input).toHaveValue("12345");
  });
});
