import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";

// Interaction test for Default story
export const DefaultInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    // Test initial state
    expect(checkbox).toHaveAttribute("aria-checked", "false");

    // Test click interaction
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "true");

    // Test toggle back
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  },
};

// Interaction test for Checked story
export const CheckedInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    // Test initial checked state
    expect(checkbox).toHaveAttribute("aria-checked", "true");

    // Test unchecking
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  },
};

// Interaction test for Standard story
export const StandardInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkboxes = canvas.getAllByRole("checkbox");

    // Test both checkboxes
    expect(checkboxes).toHaveLength(2);

    // Test first checkbox (unchecked)
    expect(checkboxes[0]).toHaveAttribute("aria-checked", "false");
    await userEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toHaveAttribute("aria-checked", "true");

    // Test second checkbox (checked)
    expect(checkboxes[1]).toHaveAttribute("aria-checked", "true");
    await userEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toHaveAttribute("aria-checked", "false");
  },
};

// Interaction test for Inverse story
export const InverseInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkboxes = canvas.getAllByRole("checkbox");

    // Test both checkboxes in inverse mode
    expect(checkboxes).toHaveLength(2);

    // Test first checkbox (unchecked)
    expect(checkboxes[0]).toHaveAttribute("aria-checked", "false");
    await userEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toHaveAttribute("aria-checked", "true");

    // Test second checkbox (checked)
    expect(checkboxes[1]).toHaveAttribute("aria-checked", "true");
    await userEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toHaveAttribute("aria-checked", "false");
  },
};

// Keyboard interaction test
export const KeyboardInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    // Focus the checkbox
    await userEvent.tab();
    expect(checkbox).toHaveFocus();

    // Test Space key
    await userEvent.keyboard(" ");
    expect(checkbox).toHaveAttribute("aria-checked", "true");

    // Test Enter key
    await userEvent.keyboard("Enter");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  },
};

// Accessibility interaction test
export const AccessibilityInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    // Test ARIA attributes
    expect(checkbox).toHaveAttribute("role", "checkbox");
    expect(checkbox).toHaveAttribute("aria-checked");
    expect(checkbox).toHaveAttribute("tabIndex");

    // Test keyboard navigation
    await userEvent.tab();
    expect(checkbox).toHaveFocus();

    // Test activation
    await userEvent.keyboard(" ");
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  },
};

// Form integration test
export const FormIntegration = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    // Test form integration
    const hiddenInput = canvas.getByRole("checkbox", { hidden: true });
    expect(hiddenInput).toBeInTheDocument();

    // Test checkbox interaction
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(hiddenInput).toBeChecked();
  },
};
