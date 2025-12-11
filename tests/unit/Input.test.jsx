import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, describe, vi } from "vitest";
import Input from "../../app/components/Input";

describe("Input Component", () => {
  test("renders with default props", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  test("renders with label", () => {
    render(<Input label="Test input" />);
    expect(screen.getByText("Test input")).toBeInTheDocument();
    expect(screen.getByLabelText("Test input")).toBeInTheDocument();
  });

  test("renders with placeholder", () => {
    render(<Input placeholder="Enter text..." />);
    const input = screen.getByPlaceholderText("Enter text...");
    expect(input).toBeInTheDocument();
  });

  test("renders with value", () => {
    render(<Input value="test value" />);
    const input = screen.getByDisplayValue("test value");
    expect(input).toBeInTheDocument();
  });

  test("calls onChange when text is entered", () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new text" } });

    expect(handleChange).toHaveBeenCalledWith(expect.any(Object));
  });

  test("calls onFocus when focused", () => {
    const handleFocus = vi.fn();
    render(<Input onFocus={handleFocus} />);

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    expect(handleFocus).toHaveBeenCalledWith(expect.any(Object));
  });

  test("calls onBlur when blurred", () => {
    const handleBlur = vi.fn();
    render(<Input onBlur={handleBlur} />);

    const input = screen.getByRole("textbox");
    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalledWith(expect.any(Object));
  });

  test("does not call onChange when disabled", () => {
    const handleChange = vi.fn();
    render(<Input disabled={true} onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new text" } });

    expect(handleChange).not.toHaveBeenCalled();
  });

  test("does not call onFocus when disabled", () => {
    const handleFocus = vi.fn();
    render(<Input disabled={true} onFocus={handleFocus} />);

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    expect(handleFocus).not.toHaveBeenCalled();
  });

  test("does not call onBlur when disabled", () => {
    const handleBlur = vi.fn();
    render(<Input disabled={true} onBlur={handleBlur} />);

    const input = screen.getByRole("textbox");
    fireEvent.blur(input);

    expect(handleBlur).not.toHaveBeenCalled();
  });

  test("applies disabled attributes when disabled", () => {
    render(<Input disabled={true} />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  test("applies correct size classes", () => {
    const { rerender } = render(<Input size="small" />);
    let input = screen.getByRole("textbox");
    expect(input).toHaveClass("h-[32px]");

    rerender(<Input size="medium" />);
    input = screen.getByRole("textbox");
    expect(input).toHaveClass("h-[36px]");

    rerender(<Input size="large" />);
    input = screen.getByRole("textbox");
    expect(input).toHaveClass("h-[40px]");
  });

  test("applies correct label variant classes", () => {
    const { rerender } = render(<Input label="Test" labelVariant="default" />);
    let container = screen.getByRole("textbox").closest("div").parentElement;
    expect(container).toHaveClass("flex-col");

    rerender(<Input label="Test" labelVariant="horizontal" />);
    container = screen.getByRole("textbox").closest("div").parentElement;
    expect(container).toHaveClass("flex", "items-center");
  });

  test("applies error state classes", () => {
    render(<Input error={true} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass(
      "border-[var(--color-border-default-utility-negative)]",
    );
  });

  test("applies disabled state classes", () => {
    render(<Input disabled={true} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("cursor-not-allowed");
    expect(input).toHaveClass("bg-[var(--color-content-default-secondary)]");
  });

  test("applies focus state classes", () => {
    render(<Input state="focus" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass(
      "border-[var(--color-border-default-utility-info)]",
    );
    expect(input).toHaveClass("shadow-[0_0_5px_3px_#3281F8]");
  });

  test("applies hover state classes", () => {
    render(<Input state="hover" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("border-[var(--color-border-default-tertiary)]");
    expect(input).toHaveClass(
      "shadow-[0_0_0_2px_var(--color-border-default-tertiary)]",
    );
  });

  test("applies active state classes", () => {
    render(<Input state="active" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("border-[var(--color-border-default-tertiary)]");
  });

  test("applies default state classes", () => {
    render(<Input state="default" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("border-[var(--color-border-default-tertiary)]");
    expect(input).toHaveClass(
      "hover:shadow-[0_0_0_2px_var(--color-border-default-tertiary)]",
    );
  });

  test("applies custom className", () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-class");
  });

  test("passes through additional props", () => {
    render(<Input id="test-input" name="test" type="email" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "test-input");
    expect(input).toHaveAttribute("name", "test");
    expect(input).toHaveAttribute("type", "email");
  });

  test("generates unique ID when not provided", () => {
    render(<Input label="Test" />);
    const input = screen.getByRole("textbox");
    const label = screen.getByText("Test");
    expect(input).toHaveAttribute("id");
    expect(label).toHaveAttribute("for", input.id);
  });

  test("uses provided ID when given", () => {
    render(<Input id="custom-id" label="Test" />);
    const input = screen.getByRole("textbox");
    const label = screen.getByText("Test");
    expect(input).toHaveAttribute("id", "custom-id");
    expect(label).toHaveAttribute("for", "custom-id");
  });

  test("applies correct border radius style", () => {
    const { rerender } = render(<Input size="small" />);
    let input = screen.getByRole("textbox");
    expect(input).toHaveStyle("border-radius: var(--measures-radius-small)");

    rerender(<Input size="medium" />);
    input = screen.getByRole("textbox");
    expect(input).toHaveStyle("border-radius: var(--measures-radius-medium)");

    rerender(<Input size="large" />);
    input = screen.getByRole("textbox");
    expect(input).toHaveStyle("border-radius: var(--measures-radius-large)");
  });

  test("applies opacity wrapper when disabled", () => {
    render(<Input disabled={true} />);
    const wrapper = screen.getByRole("textbox").closest("div");
    expect(wrapper).toHaveClass("opacity-40");
  });

  test("does not apply opacity wrapper when not disabled", () => {
    render(<Input disabled={false} />);
    const wrapper = screen.getByRole("textbox").closest("div");
    expect(wrapper).not.toHaveClass("opacity-40");
  });

  test("applies correct label styling", () => {
    render(<Input label="Test label" size="small" />);
    const label = screen.getByText("Test label");
    expect(label).toHaveClass("text-[12px]");
    expect(label).toHaveClass("leading-[14px]");
    expect(label).toHaveClass("font-medium");
    expect(label).toHaveClass("text-[var(--color-content-default-secondary)]");
  });

  test("applies correct input text styling for different sizes", () => {
    const { rerender } = render(<Input size="small" />);
    let input = screen.getByRole("textbox");
    expect(input).toHaveClass("text-[10px]");

    rerender(<Input size="medium" />);
    input = screen.getByRole("textbox");
    expect(input).toHaveClass("text-[14px]");
    expect(input).toHaveClass("leading-[20px]");

    rerender(<Input size="large" />);
    input = screen.getByRole("textbox");
    expect(input).toHaveClass("text-[16px]");
    expect(input).toHaveClass("leading-[24px]");
  });

  test("handles keyboard navigation", () => {
    const handleFocus = vi.fn();
    render(<Input onFocus={handleFocus} />);

    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "Tab" });
    fireEvent.focus(input);

    expect(handleFocus).toHaveBeenCalled();
  });

  test("forwards ref correctly", () => {
    const ref = React.createRef();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  test("is memoized", () => {
    expect(Input.$$typeof).toBe(Symbol.for("react.memo"));
  });
});
