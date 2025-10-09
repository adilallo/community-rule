import { expect } from "@storybook/test";
import { userEvent, within } from "@storybook/test";

export const DefaultInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioButton = canvas.getByRole("radio");

    // Should be unchecked initially
    await expect(radioButton).toHaveAttribute("aria-checked", "false");

    // Click to check
    await userEvent.click(radioButton);
    await expect(radioButton).toHaveAttribute("aria-checked", "true");

    // Click to uncheck
    await userEvent.click(radioButton);
    await expect(radioButton).toHaveAttribute("aria-checked", "false");
  },
};

export const CheckedInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioButton = canvas.getByRole("radio");

    // Should be checked initially
    await expect(radioButton).toHaveAttribute("aria-checked", "true");

    // Click to uncheck
    await userEvent.click(radioButton);
    await expect(radioButton).toHaveAttribute("aria-checked", "false");

    // Click to check again
    await userEvent.click(radioButton);
    await expect(radioButton).toHaveAttribute("aria-checked", "true");
  },
};

export const StandardInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioButtons = canvas.getAllByRole("radio");

    // First should be unchecked
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "false");
    // Second should be checked
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "true");

    // Click first radio button
    await userEvent.click(radioButtons[0]);
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "false");
  },
};

export const InverseInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioButtons = canvas.getAllByRole("radio");

    // First should be unchecked
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "false");
    // Second should be checked
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "true");

    // Click first radio button
    await userEvent.click(radioButtons[0]);
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "false");
  },
};

export const KeyboardInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioButton = canvas.getByRole("radio");

    // Focus the radio button
    await userEvent.click(radioButton);
    await expect(radioButton).toHaveFocus();

    // Test Space key
    await userEvent.keyboard(" ");
    await expect(radioButton).toHaveAttribute("aria-checked", "true");

    // Test Enter key
    await userEvent.keyboard("Enter");
    await expect(radioButton).toHaveAttribute("aria-checked", "false");
  },
};

export const AccessibilityInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioButton = canvas.getByRole("radio");

    // Should have proper ARIA attributes
    await expect(radioButton).toHaveAttribute("role", "radio");
    await expect(radioButton).toHaveAttribute("aria-checked");
    await expect(radioButton).toHaveAttribute("tabIndex", "0");

    // Should be keyboard accessible
    await userEvent.tab();
    await expect(radioButton).toHaveFocus();

    // Should have accessible name
    const label = canvas.getByText("Default radio button");
    await expect(label).toBeVisible();
  },
};

export const FormIntegration = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioButton = canvas.getByRole("radio");

    // Should have hidden input for form submission
    const hiddenInput = canvas.getByRole("radio", { hidden: true });
    await expect(hiddenInput).toBeInTheDocument();

    // Should be included in form data
    await userEvent.click(radioButton);
    await expect(hiddenInput).toBeChecked();
  },
};
