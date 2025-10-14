import { expect } from "@storybook/test";
import { userEvent, within } from "@storybook/test";

export const DefaultInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioGroup = canvas.getByRole("radiogroup");
    const radioButtons = canvas.getAllByRole("radio");

    // Should have radiogroup role
    await expect(radioGroup).toBeInTheDocument();

    // Should have 3 radio buttons
    await expect(radioButtons).toHaveLength(3);

    // First should be selected initially
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "false");
    await expect(radioButtons[2]).toHaveAttribute("aria-checked", "false");
  },
};

export const StandardInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioGroup = canvas.getByRole("radiogroup");
    const radioButtons = canvas.getAllByRole("radio");

    // Should have radiogroup role
    await expect(radioGroup).toBeInTheDocument();

    // Second should be selected initially
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "false");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons[2]).toHaveAttribute("aria-checked", "false");

    // Click first option
    await userEvent.click(radioButtons[0]);
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "false");
    await expect(radioButtons[2]).toHaveAttribute("aria-checked", "false");
  },
};

export const InverseInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioGroup = canvas.getByRole("radiogroup");
    const radioButtons = canvas.getAllByRole("radio");

    // Should have radiogroup role
    await expect(radioGroup).toBeInTheDocument();

    // First should be selected initially
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "false");
    await expect(radioButtons[2]).toHaveAttribute("aria-checked", "false");

    // Click second option
    await userEvent.click(radioButtons[1]);
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "false");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons[2]).toHaveAttribute("aria-checked", "false");
  },
};

export const InteractiveInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioGroup = canvas.getByRole("radiogroup");
    const radioButtons = canvas.getAllByRole("radio");

    // Should have radiogroup role
    expect(radioGroup).toBeInTheDocument();

    // Should show initial state
    expect(canvas.getByText("Selected: option1")).toBeVisible();

    // Click second option
    userEvent.click(radioButtons[1]);
    expect(canvas.getByText("Selected: option2")).toBeVisible();

    // Click third option
    userEvent.click(radioButtons[2]);
    expect(canvas.getByText("Selected: option3")).toBeVisible();
  },
};

export const KeyboardInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioButtons = canvas.getAllByRole("radio");

    // Focus first radio button
    await userEvent.click(radioButtons[0]);
    await expect(radioButtons[0]).toHaveFocus();

    // Navigate to second radio button
    await userEvent.tab();
    await expect(radioButtons[1]).toHaveFocus();

    // Activate with Space
    await userEvent.keyboard(" ");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "false");

    // Navigate to third radio button
    await userEvent.tab();
    await expect(radioButtons[2]).toHaveFocus();

    // Activate with Enter
    await userEvent.keyboard("Enter");
    await expect(radioButtons[2]).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "false");
  },
};

export const AccessibilityInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioGroup = canvas.getByRole("radiogroup");
    const radioButtons = canvas.getAllByRole("radio");

    // Should have proper ARIA attributes
    await expect(radioGroup).toHaveAttribute("role", "radiogroup");

    radioButtons.forEach(async (button) => {
      await expect(button).toHaveAttribute("role", "radio");
      await expect(button).toHaveAttribute("aria-checked");
      await expect(button).toHaveAttribute("tabIndex", "0");
    });

    // Should have accessible names
    await expect(canvas.getByText("Option 1")).toBeVisible();
    await expect(canvas.getByText("Option 2")).toBeVisible();
    await expect(canvas.getByText("Option 3")).toBeVisible();
  },
};

export const SingleSelectionInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioButtons = canvas.getAllByRole("radio");

    // Initially first should be selected
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "false");
    await expect(radioButtons[2]).toHaveAttribute("aria-checked", "false");

    // Click second option
    await userEvent.click(radioButtons[1]);
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "false");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons[2]).toHaveAttribute("aria-checked", "false");

    // Click third option
    await userEvent.click(radioButtons[2]);
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "false");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "false");
    await expect(radioButtons[2]).toHaveAttribute("aria-checked", "true");
  },
};

export const FormIntegration = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioGroup = canvas.getByRole("radiogroup");
    const radioButtons = canvas.getAllByRole("radio");

    // Should have hidden inputs for form submission
    const hiddenInputs = canvas.getAllByRole("radio", { hidden: true });
    await expect(hiddenInputs).toHaveLength(3);

    // All should have the same name
    const names = await Promise.all(
      hiddenInputs.map((input) => input.getAttribute("name")),
    );
    expect(names.every((name) => name === names[0])).toBe(true);

    // Should be included in form data
    await userEvent.click(radioButtons[1]);
    await expect(hiddenInputs[1]).toBeChecked();
  },
};
