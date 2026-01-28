import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import RadioButton from "../../../app/components/RadioButton";

describe("RadioButton Accessibility", () => {
  it("has proper ARIA attributes", () => {
    render(<RadioButton label="Test Radio" />);

    const radioButton = screen.getByRole("radio");
    expect(radioButton).toHaveAttribute("role", "radio");
    expect(radioButton).toHaveAttribute("aria-checked", "false");
    expect(radioButton).toHaveAttribute("tabIndex", "0");
  });

  it("updates aria-checked when checked state changes", () => {
    const { rerender } = render(
      <RadioButton checked={false} label="Test Radio" />,
    );

    let radioButton = screen.getByRole("radio");
    expect(radioButton).toHaveAttribute("aria-checked", "false");

    rerender(<RadioButton checked={true} label="Test Radio" />);

    radioButton = screen.getByRole("radio");
    expect(radioButton).toHaveAttribute("aria-checked", "true");
  });

  it("associates label with radio button", () => {
    render(<RadioButton label="Accessible Radio" />);

    const radioButton = screen.getByRole("radio");
    const labelId = radioButton.getAttribute("aria-labelledby");
    expect(labelId).toBeTruthy();

    const labelElement = document.getElementById(labelId);
    expect(labelElement).toHaveTextContent("Accessible Radio");
  });

  it("uses aria-label when provided", () => {
    render(<RadioButton ariaLabel="Custom Aria Label" />);

    const radioButton = screen.getByRole("radio");
    expect(radioButton).toHaveAttribute("aria-label", "Custom Aria Label");
    expect(radioButton).not.toHaveAttribute("aria-labelledby");
  });

  it("prioritizes aria-label over aria-labelledby", () => {
    render(<RadioButton label="Visible Label" ariaLabel="Hidden Aria Label" />);

    const radioButton = screen.getByRole("radio");
    expect(radioButton).toHaveAttribute("aria-label", "Hidden Aria Label");
    expect(radioButton).not.toHaveAttribute("aria-labelledby");
  });

  it("is keyboard accessible", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<RadioButton onChange={handleChange} label="Keyboard Radio" />);

    const radioButton = screen.getByRole("radio");
    radioButton.focus();

    expect(radioButton).toHaveFocus();

    await user.keyboard(" ");
    expect(handleChange).toHaveBeenCalled();
  });

  it("handles Enter key activation", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<RadioButton onChange={handleChange} label="Enter Radio" />);

    const radioButton = screen.getByRole("radio");
    await user.click(radioButton); // Focus the element first
    await user.keyboard("Enter");

    expect(handleChange).toHaveBeenCalled();
  });

  it("handles Space key activation", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<RadioButton onChange={handleChange} label="Space Radio" />);

    const radioButton = screen.getByRole("radio");
    radioButton.focus();
    await user.keyboard(" ");

    expect(handleChange).toHaveBeenCalled();
  });

  it("ignores other keys", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<RadioButton onChange={handleChange} label="Other Keys Radio" />);

    const radioButton = screen.getByRole("radio");
    radioButton.focus();
    await user.keyboard("a");
    await user.keyboard("Tab");
    await user.keyboard("Escape");

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("has proper tab order", () => {
    render(
      <div>
        <RadioButton label="First Radio" />
        <RadioButton label="Second Radio" />
        <RadioButton label="Third Radio" />
      </div>,
    );

    const radioButtons = screen.getAllByRole("radio");
    radioButtons.forEach((button) => {
      expect(button).toHaveAttribute("tabIndex", "0");
    });
  });

  it("generates unique IDs for accessibility", () => {
    render(
      <div>
        <RadioButton label="Radio 1" />
        <RadioButton label="Radio 2" />
        <RadioButton label="Radio 3" />
      </div>,
    );

    const radioButtons = screen.getAllByRole("radio");
    const ids = radioButtons.map((button) => button.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(3);
    expect(ids.every((id) => id.startsWith("radio-"))).toBe(true);
  });

  it("uses provided ID for accessibility", () => {
    render(<RadioButton id="custom-radio-id" label="Custom ID Radio" />);

    const radioButton = screen.getByRole("radio");
    expect(radioButton).toHaveAttribute("id", "custom-radio-id");
  });

  it("has accessible name from label", () => {
    render(<RadioButton label="Accessible Name Radio" />);

    const radioButton = screen.getByRole("radio");
    const accessibleName = radioButton.getAttribute("aria-labelledby");
    const labelElement = document.getElementById(accessibleName);

    expect(labelElement).toHaveTextContent("Accessible Name Radio");
  });

  it("has accessible name from aria-label", () => {
    render(<RadioButton ariaLabel="Aria Label Name" />);

    const radioButton = screen.getByRole("radio");
    expect(radioButton).toHaveAttribute("aria-label", "Aria Label Name");
  });

  it("maintains focus management", async () => {
    const handleChange = vi.fn();

    const { rerender } = render(
      <RadioButton
        checked={false}
        onChange={handleChange}
        label="Focus Radio"
      />,
    );

    const radioButton = screen.getByRole("radio");
    radioButton.focus();
    expect(radioButton).toHaveFocus();

    // Change checked state
    rerender(
      <RadioButton
        checked={true}
        onChange={handleChange}
        label="Focus Radio"
      />,
    );

    // Should still be focusable
    expect(radioButton).toHaveAttribute("tabIndex", "0");
  });

  it("has proper role and state", () => {
    render(<RadioButton checked={true} label="State Radio" />);

    const radioButton = screen.getByRole("radio");
    expect(radioButton).toHaveAttribute("role", "radio");
    expect(radioButton).toHaveAttribute("aria-checked", "true");
  });

  it("supports screen reader navigation", () => {
    render(
      <div>
        <RadioButton label="First Option" />
        <RadioButton label="Second Option" />
        <RadioButton label="Third Option" />
      </div>,
    );

    const radioButtons = screen.getAllByRole("radio");

    // All should be in tab order
    radioButtons.forEach((button) => {
      expect(button).toHaveAttribute("tabIndex", "0");
      expect(button).toHaveAttribute("role", "radio");
    });
  });

  it("has proper form association", () => {
    render(
      <RadioButton name="test-radio" value="test-value" label="Form Radio" />,
    );

    const hiddenInput = screen.getByDisplayValue("test-value");
    expect(hiddenInput).toHaveAttribute("type", "radio");
    expect(hiddenInput).toHaveAttribute("name", "test-radio");
    expect(hiddenInput).toHaveAttribute("value", "test-value");
  });
});
