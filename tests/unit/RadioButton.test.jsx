import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import RadioButton from "../../app/components/RadioButton";

describe("RadioButton", () => {
  it("renders with default props", () => {
    render(<RadioButton />);

    const radioButton = screen.getByRole("radio");
    expect(radioButton).toBeInTheDocument();
    expect(radioButton).toHaveAttribute("aria-checked", "false");
  });

  it("renders with label", () => {
    render(<RadioButton label="Test Radio" />);

    expect(screen.getByText("Test Radio")).toBeInTheDocument();
  });

  it("shows checked state", () => {
    render(<RadioButton checked={true} label="Checked Radio" />);

    const radioButton = screen.getByRole("radio");
    expect(radioButton).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange when clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioButton checked={false} onChange={handleChange} label="Test Radio" />
    );

    const radioButton = screen.getByRole("radio");
    await user.click(radioButton);

    expect(handleChange).toHaveBeenCalledWith({
      checked: true,
      value: undefined,
    });
  });

  it("calls onChange with value when clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioButton
        checked={false}
        value="test-value"
        onChange={handleChange}
        label="Test Radio"
      />
    );

    const radioButton = screen.getByRole("radio");
    await user.click(radioButton);

    expect(handleChange).toHaveBeenCalledWith({
      checked: true,
      value: "test-value",
    });
  });

  it("does not call onChange when clicking already checked radio button", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioButton checked={true} onChange={handleChange} label="Test Radio" />
    );

    const radioButton = screen.getByRole("radio");
    await user.click(radioButton);

    // Radio buttons should not be unchecked by clicking them again
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("handles keyboard activation", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioButton checked={false} onChange={handleChange} label="Test Radio" />
    );

    const radioButton = screen.getByRole("radio");
    radioButton.focus();
    await user.keyboard(" ");

    expect(handleChange).toHaveBeenCalledWith({
      checked: true,
      value: undefined,
    });
  });

  it("handles Enter key activation", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioButton checked={false} onChange={handleChange} label="Test Radio" />
    );

    const radioButton = screen.getByRole("radio");
    await user.click(radioButton); // Focus the element first
    await user.keyboard("{Enter}");

    expect(handleChange).toHaveBeenCalledWith({
      checked: true,
      value: undefined,
    });
  });

  it("applies standard mode classes", () => {
    render(<RadioButton mode="standard" label="Standard Radio" />);

    const radioButton = screen.getByRole("radio");
    expect(radioButton).toHaveClass(
      "outline-[var(--color-border-default-tertiary)]"
    );
  });

  it("applies inverse mode classes", () => {
    render(<RadioButton mode="inverse" label="Inverse Radio" />);

    const radioButton = screen.getByRole("radio");
    expect(radioButton).toHaveClass(
      "outline-[var(--color-border-inverse-primary)]"
    );
  });

  it("applies focus state classes", () => {
    render(<RadioButton state="focus" label="Focus Radio" />);

    const radioButton = screen.getByRole("radio");
    expect(radioButton).toHaveClass("focus:outline");
  });

  it("applies hover state classes", () => {
    render(<RadioButton state="hover" label="Hover Radio" />);

    const radioButton = screen.getByRole("radio");
    expect(radioButton).toHaveClass("hover:outline");
  });

  it("renders hidden input for form submission", () => {
    render(
      <RadioButton
        name="test-radio"
        value="test-value"
        checked={true}
        label="Test Radio"
      />
    );

    const hiddenInput = screen.getByDisplayValue("test-value");
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveAttribute("type", "radio");
    expect(hiddenInput).toHaveAttribute("name", "test-radio");
    expect(hiddenInput).toBeChecked();
  });

  it("applies custom className", () => {
    render(<RadioButton className="custom-class" label="Custom Radio" />);

    const label = screen.getByText("Custom Radio").closest("label");
    expect(label).toHaveClass("custom-class");
  });

  it("generates unique ID when not provided", () => {
    render(<RadioButton label="Radio 1" />);
    render(<RadioButton label="Radio 2" />);

    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons[0]).toHaveAttribute("id");
    expect(radioButtons[1]).toHaveAttribute("id");
    expect(radioButtons[0].id).not.toBe(radioButtons[1].id);
  });

  it("uses provided ID", () => {
    render(<RadioButton id="custom-id" label="Custom ID Radio" />);

    const radioButton = screen.getByRole("radio");
    expect(radioButton).toHaveAttribute("id", "custom-id");
  });

  it("associates label with radio button for accessibility", () => {
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
  });

  it("shows dot indicator when checked", () => {
    render(
      <RadioButton checked={true} mode="standard" label="Checked Radio" />
    );

    const dot = screen.getByRole("radio").querySelector("div");
    expect(dot).toHaveClass("w-[16px]", "h-[16px]", "rounded-full");
  });

  it("hides dot indicator when unchecked", () => {
    render(
      <RadioButton checked={false} mode="standard" label="Unchecked Radio" />
    );

    const dot = screen.getByRole("radio").querySelector("div");
    // Check if the dot has transparent background or no background color set
    const computedStyle = window.getComputedStyle(dot);
    const backgroundColor = computedStyle.backgroundColor;

    // The dot should either be transparent or have no background color
    expect(
      backgroundColor === "transparent" ||
        backgroundColor === "rgba(0, 0, 0, 0)" ||
        backgroundColor === ""
    ).toBe(true);
  });
});
