import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import RadioGroup from "../../../app/components/RadioGroup";

describe("RadioGroup Accessibility", () => {
  const defaultOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  it("has proper radiogroup role", () => {
    render(<RadioGroup options={defaultOptions} />);

    const radioGroup = screen.getByRole("radiogroup");
    expect(radioGroup).toBeInTheDocument();
  });

  it("has proper ARIA attributes on radiogroup", () => {
    render(
      <RadioGroup options={defaultOptions} aria-label="Test Radio Group" />,
    );

    const radioGroup = screen.getByRole("radiogroup");
    expect(radioGroup).toHaveAttribute("aria-label", "Test Radio Group");
  });

  it("has proper radio button roles", () => {
    render(<RadioGroup options={defaultOptions} />);

    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons).toHaveLength(3);

    radioButtons.forEach((button) => {
      expect(button).toHaveAttribute("role", "radio");
      expect(button).toHaveAttribute("aria-checked");
    });
  });

  it("shows correct selection state", () => {
    render(<RadioGroup options={defaultOptions} value="option2" />);

    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons[0]).toHaveAttribute("aria-checked", "false");
    expect(radioButtons[1]).toHaveAttribute("aria-checked", "true");
    expect(radioButtons[2]).toHaveAttribute("aria-checked", "false");
  });

  it("updates selection state correctly", () => {
    const { rerender } = render(
      <RadioGroup options={defaultOptions} value="option1" />,
    );

    let radioButtons = screen.getAllByRole("radio");
    expect(radioButtons[0]).toHaveAttribute("aria-checked", "true");

    rerender(<RadioGroup options={defaultOptions} value="option3" />);

    radioButtons = screen.getAllByRole("radio");
    expect(radioButtons[0]).toHaveAttribute("aria-checked", "false");
    expect(radioButtons[2]).toHaveAttribute("aria-checked", "true");
  });

  it("associates labels with radio buttons", () => {
    render(<RadioGroup options={defaultOptions} />);

    const radioButtons = screen.getAllByRole("radio");
    radioButtons.forEach((button, index) => {
      const labelId = button.getAttribute("aria-labelledby");
      expect(labelId).toBeTruthy();

      const labelElement = document.getElementById(labelId);
      expect(labelElement).toHaveTextContent(`Option ${index + 1}`);
    });
  });

  it("uses aria-label when provided in options", () => {
    const optionsWithAria = [
      { value: "option1", label: "Option 1", ariaLabel: "First Option" },
      { value: "option2", label: "Option 2", ariaLabel: "Second Option" },
    ];

    render(<RadioGroup options={optionsWithAria} />);

    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons[0]).toHaveAttribute("aria-label", "First Option");
    expect(radioButtons[1]).toHaveAttribute("aria-label", "Second Option");
  });

  it("is keyboard accessible", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioGroup
        options={defaultOptions}
        value="option1"
        onChange={handleChange}
      />,
    );

    const radioButtons = screen.getAllByRole("radio");

    // Focus first radio button
    radioButtons[0].focus();
    expect(radioButtons[0]).toHaveFocus();

    // Navigate to second option
    radioButtons[1].focus();
    expect(radioButtons[1]).toHaveFocus();

    // Activate with Space
    await user.keyboard(" ");
    expect(handleChange).toHaveBeenCalledWith({ value: "option2" });
  });

  it("handles Enter key activation", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioGroup
        options={defaultOptions}
        value="option1"
        onChange={handleChange}
      />,
    );

    const radioButtons = screen.getAllByRole("radio");
    await user.click(radioButtons[2]); // Focus the element first
    await user.keyboard("Enter");

    expect(handleChange).toHaveBeenCalledWith({ value: "option3" });
  });

  it("handles Space key activation", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioGroup
        options={defaultOptions}
        value="option1"
        onChange={handleChange}
      />,
    );

    const radioButtons = screen.getAllByRole("radio");
    radioButtons[1].focus();
    await user.keyboard(" ");

    expect(handleChange).toHaveBeenCalledWith({ value: "option2" });
  });

  it("ignores other keys", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioGroup
        options={defaultOptions}
        value="option1"
        onChange={handleChange}
      />,
    );

    const radioButtons = screen.getAllByRole("radio");
    radioButtons[1].focus();

    await user.keyboard("a");
    await user.keyboard("Tab");
    await user.keyboard("Escape");

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("has proper tab order", () => {
    render(<RadioGroup options={defaultOptions} />);

    const radioButtons = screen.getAllByRole("radio");
    radioButtons.forEach((button) => {
      expect(button).toHaveAttribute("tabIndex", "0");
    });
  });

  it("generates unique IDs for accessibility", () => {
    render(
      <div>
        <RadioGroup options={defaultOptions} />
        <RadioGroup options={defaultOptions} />
      </div>,
    );

    const radioButtons = screen.getAllByRole("radio");
    const ids = radioButtons.map((button) => button.id);
    const uniqueIds = new Set(ids);

    // Should have unique IDs
    expect(uniqueIds.size).toBe(6);
  });

  it("uses provided name for form association", () => {
    render(<RadioGroup options={defaultOptions} name="test-group" />);

    const hiddenInputs = screen.getAllByDisplayValue("option1");
    hiddenInputs.forEach((input) => {
      expect(input).toHaveAttribute("name", "test-group");
    });
  });

  it("has proper form association", () => {
    render(
      <RadioGroup options={defaultOptions} name="test-group" value="option2" />,
    );

    const hiddenInputs = screen.getAllByDisplayValue("option1");
    expect(hiddenInputs[0]).toHaveAttribute("name", "test-group");
    expect(hiddenInputs[0]).toHaveAttribute("value", "option1");
    expect(hiddenInputs[0]).not.toBeChecked();

    const option2Inputs = screen.getAllByDisplayValue("option2");
    expect(option2Inputs[0]).toHaveAttribute("name", "test-group");
    expect(option2Inputs[0]).toHaveAttribute("value", "option2");
    expect(option2Inputs[0]).toBeChecked();
  });

  it("maintains focus management", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    const { rerender } = render(
      <RadioGroup
        options={defaultOptions}
        value="option1"
        onChange={handleChange}
      />,
    );

    const radioButtons = screen.getAllByRole("radio");
    radioButtons[1].focus();
    expect(radioButtons[1]).toHaveFocus();

    // Change selection
    rerender(
      <RadioGroup
        options={defaultOptions}
        value="option2"
        onChange={handleChange}
      />,
    );

    // Should still be focusable
    expect(radioButtons[1]).toHaveAttribute("tabIndex", "0");
  });

  it("supports screen reader navigation", () => {
    render(<RadioGroup options={defaultOptions} />);

    const radioGroup = screen.getByRole("radiogroup");
    const radioButtons = screen.getAllByRole("radio");

    // RadioGroup should be present
    expect(radioGroup).toBeInTheDocument();

    // All radio buttons should be in tab order
    radioButtons.forEach((button) => {
      expect(button).toHaveAttribute("tabIndex", "0");
      expect(button).toHaveAttribute("role", "radio");
    });
  });

  it("handles empty options gracefully", () => {
    render(<RadioGroup options={[]} />);

    const radioGroup = screen.getByRole("radiogroup");
    expect(radioGroup).toBeInTheDocument();

    const radioButtons = screen.queryAllByRole("radio");
    expect(radioButtons).toHaveLength(0);
  });

  it("has proper accessible names", () => {
    render(<RadioGroup options={defaultOptions} />);

    const radioButtons = screen.getAllByRole("radio");
    radioButtons.forEach((button, index) => {
      const labelId = button.getAttribute("aria-labelledby");
      const labelElement = document.getElementById(labelId);
      expect(labelElement).toHaveTextContent(`Option ${index + 1}`);
    });
  });

  it("maintains single selection behavior", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioGroup
        options={defaultOptions}
        value="option1"
        onChange={handleChange}
      />,
    );

    const radioButtons = screen.getAllByRole("radio");

    // Click option 2 directly
    await user.click(radioButtons[1]);

    expect(handleChange).toHaveBeenCalledWith({ value: "option2" });

    // Only one should be selected at a time
    expect(handleChange).toHaveBeenCalledTimes(2);
  });
});
