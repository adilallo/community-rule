import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Switch from "../../app/components/Switch";

describe("Switch Component", () => {
  it("renders with default props", () => {
    render(<Switch />);
    const switchButton = screen.getByRole("switch");
    expect(switchButton).toBeInTheDocument();
    expect(switchButton).toHaveAttribute("aria-checked", "false");
  });

  it("renders with custom props", () => {
    const handleChange = vi.fn();
    render(
      <Switch
        checked={true}
        onChange={handleChange}
        label="Test Switch"
        state="focus"
      />
    );

    const switchButton = screen.getByRole("switch");
    expect(switchButton).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("Test Switch")).toBeInTheDocument();
  });

  it("handles checked prop correctly", () => {
    const { rerender } = render(<Switch checked={false} />);
    let switchButton = screen.getByRole("switch");
    expect(switchButton).toHaveAttribute("aria-checked", "false");

    rerender(<Switch checked={true} />);
    switchButton = screen.getByRole("switch");
    expect(switchButton).toHaveAttribute("aria-checked", "true");
  });

  it("handles state prop correctly", () => {
    const { rerender } = render(<Switch state="default" />);
    let switchButton = screen.getByRole("switch");
    expect(switchButton).not.toHaveClass("shadow-[0_0_5px_1px_#3281F8]");

    rerender(<Switch state="focus" />);
    switchButton = screen.getByRole("switch");
    expect(switchButton).toHaveClass("shadow-[0_0_5px_3px_#3281F8]");
  });

  it("calls onChange when clicked", () => {
    const handleChange = vi.fn();
    render(<Switch onChange={handleChange} />);

    const switchButton = screen.getByRole("switch");
    fireEvent.click(switchButton);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("calls onFocus when focused", () => {
    const handleFocus = vi.fn();
    render(<Switch onFocus={handleFocus} />);

    const switchButton = screen.getByRole("switch");
    fireEvent.focus(switchButton);
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it("calls onBlur when blurred", () => {
    const handleBlur = vi.fn();
    render(<Switch onBlur={handleBlur} />);

    const switchButton = screen.getByRole("switch");
    fireEvent.blur(switchButton);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("handles keyboard events correctly", () => {
    const handleChange = vi.fn();
    render(<Switch onChange={handleChange} />);

    const switchButton = screen.getByRole("switch");

    // Test Enter key
    fireEvent.keyDown(switchButton, { key: "Enter" });
    expect(handleChange).toHaveBeenCalledTimes(1);

    // Test Space key
    fireEvent.keyDown(switchButton, { key: " " });
    expect(handleChange).toHaveBeenCalledTimes(2);

    // Test other key (should not trigger)
    fireEvent.keyDown(switchButton, { key: "Tab" });
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it("applies correct classes for different states", () => {
    const { rerender } = render(<Switch checked={false} />);
    let switchButton = screen.getByRole("switch");
    expect(switchButton).toHaveClass("cursor-pointer");

    rerender(<Switch checked={true} />);
    switchButton = screen.getByRole("switch");
    expect(switchButton).toHaveClass("cursor-pointer");
  });

  it("applies correct track styles based on checked state", () => {
    const { rerender } = render(<Switch checked={false} />);
    let switchButton = screen.getByRole("switch");
    let track = switchButton.querySelector("div");
    expect(track).toHaveClass("bg-[var(--color-surface-default-tertiary)]");

    rerender(<Switch checked={true} />);
    switchButton = screen.getByRole("switch");
    track = switchButton.querySelector("div");
    expect(track).toHaveClass("bg-[var(--color-surface-inverse-tertiary)]");

    switchButton = screen.getByRole("switch");
    track = switchButton.querySelector("div");
    expect(track).toHaveClass("bg-[var(--color-surface-inverse-tertiary)]");
  });

  it("applies correct focus styles", () => {
    const { rerender } = render(<Switch state="default" />);
    let switchButton = screen.getByRole("switch");
    expect(switchButton).not.toHaveClass("shadow-[0_0_5px_1px_#3281F8]");

    rerender(<Switch state="focus" />);
    switchButton = screen.getByRole("switch");
    expect(switchButton).toHaveClass("shadow-[0_0_5px_3px_#3281F8]");
  });

  it("applies correct base classes", () => {
    render(<Switch />);
    const switchButton = screen.getByRole("switch");
    expect(switchButton).toHaveClass(
      "relative",
      "inline-flex",
      "items-center",
      "cursor-pointer",
      "transition-all",
      "duration-200",
      "focus:outline-none",
      "focus-visible:shadow-[0_0_5px_3px_#3281F8]"
    );
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef();
    render(<Switch ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("applies custom className", () => {
    render(<Switch className="custom-class" />);
    const switchButton = screen.getByRole("switch");
    expect(switchButton).toHaveClass("custom-class");
  });

  it("renders label when provided", () => {
    render(<Switch label="Test Label" />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("does not render label when not provided", () => {
    render(<Switch />);
    expect(screen.queryByText("Switch label")).not.toBeInTheDocument();
    // Should have aria-label for accessibility
    const switchButton = screen.getByRole("switch");
    expect(switchButton).toHaveAttribute("aria-label", "Toggle switch");
  });

  it("applies correct label styles", () => {
    render(<Switch label="Test Label" />);
    const label = screen.getByText("Test Label");
    expect(label).toHaveClass(
      "ml-[var(--measures-spacing-008)]",
      "font-inter",
      "font-normal",
      "text-[14px]",
      "leading-[20px]",
      "text-[var(--color-content-default-primary)]"
    );
  });
});
