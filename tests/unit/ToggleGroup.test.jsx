import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ToggleGroup from "../../app/components/ToggleGroup";

describe("ToggleGroup Component", () => {
  it("renders with default props", () => {
    render(<ToggleGroup>Test Content</ToggleGroup>);
    const toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toBeInTheDocument();
    expect(toggleGroup).toHaveTextContent("Test Content");
  });

  it("renders with custom props", () => {
    render(
      <ToggleGroup position="middle" state="selected" showText={true}>
        Custom Content
      </ToggleGroup>,
    );
    const toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toBeInTheDocument();
    expect(toggleGroup).toHaveTextContent("Custom Content");
  });

  it("handles position prop correctly", () => {
    const { rerender } = render(
      <ToggleGroup position="left">Left</ToggleGroup>,
    );
    let toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass(
      "rounded-l-[var(--measures-radius-medium)]",
      "rounded-r-none",
    );

    rerender(<ToggleGroup position="middle">Middle</ToggleGroup>);
    toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass("rounded-none");

    rerender(<ToggleGroup position="right">Right</ToggleGroup>);
    toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass(
      "rounded-r-[var(--measures-radius-medium)]",
      "rounded-l-none",
    );
  });

  it("handles state prop correctly", () => {
    const { rerender } = render(
      <ToggleGroup state="default">Default</ToggleGroup>,
    );
    let toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass(
      "bg-[var(--color-surface-default-primary)]",
    );

    rerender(<ToggleGroup state="hover">Hover</ToggleGroup>);
    toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass("bg-[var(--color-magenta-magenta100)]");

    rerender(<ToggleGroup state="focus">Focus</ToggleGroup>);
    toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass(
      "bg-[var(--color-surface-default-primary)]",
      "shadow-[0_0_5px_1px_#3281F8]",
    );

    rerender(<ToggleGroup state="selected">Selected</ToggleGroup>);
    toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass(
      "bg-[var(--color-magenta-magenta100)]",
      "shadow-[inset_0_0_0_1px_var(--color-border-default-secondary)]",
    );
  });

  it("handles showText prop correctly", () => {
    const { rerender } = render(
      <ToggleGroup showText={true}>Visible Text</ToggleGroup>,
    );
    let toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveTextContent("Visible Text");

    rerender(<ToggleGroup showText={false}>☰</ToggleGroup>);
    toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveTextContent("☰");
  });

  it("calls onChange when clicked", () => {
    const handleChange = vi.fn();
    render(<ToggleGroup onChange={handleChange}>Clickable</ToggleGroup>);
    const toggleGroup = screen.getByRole("button");

    fireEvent.click(toggleGroup);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("calls onFocus when focused", () => {
    const handleFocus = vi.fn();
    render(<ToggleGroup onFocus={handleFocus}>Focusable</ToggleGroup>);
    const toggleGroup = screen.getByRole("button");

    fireEvent.focus(toggleGroup);
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it("calls onBlur when blurred", () => {
    const handleBlur = vi.fn();
    render(<ToggleGroup onBlur={handleBlur}>Blurable</ToggleGroup>);
    const toggleGroup = screen.getByRole("button");

    fireEvent.blur(toggleGroup);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("handles keyboard events correctly", () => {
    const handleChange = vi.fn();
    render(<ToggleGroup onChange={handleChange}>Keyboard</ToggleGroup>);
    const toggleGroup = screen.getByRole("button");

    // Test Enter key
    fireEvent.keyDown(toggleGroup, { key: "Enter" });
    expect(handleChange).toHaveBeenCalledTimes(1);

    // Test Space key
    fireEvent.keyDown(toggleGroup, { key: " " });
    expect(handleChange).toHaveBeenCalledTimes(2);

    // Test other key (should not trigger)
    fireEvent.keyDown(toggleGroup, { key: "Escape" });
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it("applies correct classes for different states", () => {
    const { rerender } = render(
      <ToggleGroup state="default">Default</ToggleGroup>,
    );
    let toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass(
      "bg-[var(--color-surface-default-primary)]",
    );

    rerender(<ToggleGroup state="hover">Hover</ToggleGroup>);
    toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass("bg-[var(--color-magenta-magenta100)]");

    rerender(<ToggleGroup state="focus">Focus</ToggleGroup>);
    toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass("shadow-[0_0_5px_1px_#3281F8]");

    rerender(<ToggleGroup state="selected">Selected</ToggleGroup>);
    toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass(
      "bg-[var(--color-magenta-magenta100)]",
      "shadow-[inset_0_0_0_1px_var(--color-border-default-secondary)]",
    );
  });

  it("applies correct position classes", () => {
    const { rerender } = render(
      <ToggleGroup position="left">Left</ToggleGroup>,
    );
    let toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass(
      "rounded-l-[var(--measures-radius-medium)]",
      "rounded-r-none",
    );

    rerender(<ToggleGroup position="middle">Middle</ToggleGroup>);
    toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass("rounded-none");

    rerender(<ToggleGroup position="right">Right</ToggleGroup>);
    toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass(
      "rounded-r-[var(--measures-radius-medium)]",
      "rounded-l-none",
    );
  });

  it("applies correct base classes", () => {
    render(<ToggleGroup>Base</ToggleGroup>);
    const toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass(
      "py-[var(--measures-spacing-008)]",
      "px-[var(--measures-spacing-008)]",
      "gap-[var(--measures-spacing-008)]",
      "font-inter",
      "font-medium",
      "text-[12px]",
      "leading-[12px]",
      "cursor-pointer",
      "transition-all",
      "duration-200",
      "focus:outline-none",
      "focus-visible:shadow-[0_0_5px_1px_#3281F8]",
      "hover:bg-[var(--color-magenta-magenta100)]",
      "flex",
      "items-center",
      "justify-center",
    );
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef();
    render(<ToggleGroup ref={ref}>Ref Test</ToggleGroup>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("applies custom className", () => {
    render(<ToggleGroup className="custom-class">Custom</ToggleGroup>);
    const toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass("custom-class");
  });
});
