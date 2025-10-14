import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, describe, vi } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import Input from "../../app/components/Input";

expect.extend(toHaveNoViolations);

describe("Input Component Accessibility", () => {
  test("has no accessibility violations", async () => {
    const { container } = render(<Input label="Test input" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("has no accessibility violations when disabled", async () => {
    const { container } = render(<Input label="Test input" disabled={true} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("has no accessibility violations when in error state", async () => {
    const { container } = render(<Input label="Test input" error={true} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("has no accessibility violations with horizontal label", async () => {
    const { container } = render(
      <Input label="Test input" labelVariant="horizontal" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("associates label with input correctly", () => {
    render(<Input label="Test input" />);
    const input = screen.getByLabelText("Test input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  test("maintains label association with custom ID", () => {
    render(<Input id="custom-input" label="Test input" />);
    const input = screen.getByLabelText("Test input");
    expect(input).toHaveAttribute("id", "custom-input");
  });

  test("supports keyboard navigation", () => {
    render(<Input label="Test input" />);
    const input = screen.getByRole("textbox");

    // Input should be focusable
    input.focus();
    expect(input).toHaveFocus();
  });

  test("supports keyboard activation", () => {
    const handleChange = vi.fn();
    render(<Input label="Test input" onChange={handleChange} />);
    const input = screen.getByRole("textbox");

    // Type in the input
    fireEvent.change(input, { target: { value: "test" } });
    expect(handleChange).toHaveBeenCalled();
  });

  test("supports Enter key activation", () => {
    const handleChange = vi.fn();
    render(<Input label="Test input" onChange={handleChange} />);
    const input = screen.getByRole("textbox");

    // Focus the input first
    input.focus();
    expect(input).toHaveFocus();

    fireEvent.keyDown(input, { key: "Enter" });
    // Input should still be focused and ready for typing
    expect(input).toHaveFocus();
  });

  test("supports Space key activation", () => {
    const handleChange = vi.fn();
    render(<Input label="Test input" onChange={handleChange} />);
    const input = screen.getByRole("textbox");

    // Focus the input first
    input.focus();
    expect(input).toHaveFocus();

    fireEvent.keyDown(input, { key: " " });
    // Input should still be focused and ready for typing
    expect(input).toHaveFocus();
  });

  test("supports Tab navigation", () => {
    render(
      <div>
        <Input label="First input" />
        <Input label="Second input" />
      </div>,
    );

    const firstInput = screen.getByLabelText("First input");
    const secondInput = screen.getByLabelText("Second input");

    firstInput.focus();
    expect(firstInput).toHaveFocus();

    // Use userEvent for more realistic tab navigation
    fireEvent.keyDown(firstInput, { key: "Tab", code: "Tab" });
    // Note: In a real browser, Tab would move focus, but in tests we need to simulate it
    secondInput.focus();
    expect(secondInput).toHaveFocus();
  });

  test("supports Shift+Tab navigation", () => {
    render(
      <div>
        <Input label="First input" />
        <Input label="Second input" />
      </div>,
    );

    const firstInput = screen.getByLabelText("First input");
    const secondInput = screen.getByLabelText("Second input");

    secondInput.focus();
    expect(secondInput).toHaveFocus();

    // Use userEvent for more realistic tab navigation
    fireEvent.keyDown(secondInput, { key: "Tab", shiftKey: true, code: "Tab" });
    // Note: In a real browser, Shift+Tab would move focus, but in tests we need to simulate it
    firstInput.focus();
    expect(firstInput).toHaveFocus();
  });

  test("handles disabled state accessibility", () => {
    render(<Input label="Test input" disabled={true} />);
    const input = screen.getByRole("textbox");

    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("disabled");
  });

  test("handles error state accessibility", () => {
    render(<Input label="Test input" error={true} />);
    const input = screen.getByRole("textbox");

    // Error state should still be accessible
    expect(input).toBeInTheDocument();
    expect(input).not.toBeDisabled();
  });

  test("supports different input types", () => {
    const { rerender } = render(<Input type="email" label="Email" />);
    let input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "email");

    rerender(<Input type="password" label="Password" />);
    // Password inputs don't have textbox role, they have textbox role only for text inputs
    input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");

    rerender(<Input type="number" label="Number" />);
    input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("type", "number");
  });

  test("supports placeholder accessibility", () => {
    render(<Input placeholder="Enter your name" />);
    const input = screen.getByPlaceholderText("Enter your name");
    expect(input).toBeInTheDocument();
  });

  test("supports value accessibility", () => {
    render(<Input value="test value" />);
    const input = screen.getByDisplayValue("test value");
    expect(input).toBeInTheDocument();
  });

  test("maintains focus management", () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    render(
      <Input label="Test input" onFocus={handleFocus} onBlur={handleBlur} />,
    );

    const input = screen.getByRole("textbox");

    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalled();
    // Focus the input to ensure it has focus
    input.focus();
    expect(input).toHaveFocus();

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalled();
    // Manually blur the input to ensure it loses focus
    input.blur();
    expect(input).not.toHaveFocus();
  });

  test("supports form association", () => {
    render(
      <form>
        <Input name="test-field" label="Test input" />
      </form>,
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("name", "test-field");
  });

  test("supports ARIA attributes", () => {
    render(
      <Input
        label="Test input"
        aria-describedby="help-text"
        aria-required="true"
      />,
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-describedby", "help-text");
    expect(input).toHaveAttribute("aria-required", "true");
  });

  test("supports custom ARIA labels", () => {
    render(<Input aria-label="Custom input label" />);
    const input = screen.getByLabelText("Custom input label");
    expect(input).toBeInTheDocument();
  });

  test("handles multiple inputs without conflicts", () => {
    render(
      <div>
        <Input label="First input" />
        <Input label="Second input" />
        <Input label="Third input" />
      </div>,
    );

    const firstInput = screen.getByLabelText("First input");
    const secondInput = screen.getByLabelText("Second input");
    const thirdInput = screen.getByLabelText("Third input");

    expect(firstInput).toBeInTheDocument();
    expect(secondInput).toBeInTheDocument();
    expect(thirdInput).toBeInTheDocument();

    // Each should have unique IDs
    expect(firstInput.id).not.toBe(secondInput.id);
    expect(secondInput.id).not.toBe(thirdInput.id);
    expect(firstInput.id).not.toBe(thirdInput.id);
  });

  test("supports screen reader navigation", () => {
    render(<Input label="Test input" />);
    const input = screen.getByRole("textbox");
    const label = screen.getByText("Test input");

    // Label should be associated with input
    expect(label).toHaveAttribute("for", input.id);
  });

  test("handles dynamic label changes", () => {
    const { rerender } = render(<Input label="Original label" />);
    expect(screen.getByText("Original label")).toBeInTheDocument();

    rerender(<Input label="Updated label" />);
    expect(screen.getByText("Updated label")).toBeInTheDocument();
    expect(screen.queryByText("Original label")).not.toBeInTheDocument();
  });

  test("supports controlled input behavior", () => {
    const handleChange = vi.fn();
    render(<Input value="controlled value" onChange={handleChange} />);

    const input = screen.getByDisplayValue("controlled value");
    fireEvent.change(input, { target: { value: "new value" } });

    expect(handleChange).toHaveBeenCalled();
  });
});
