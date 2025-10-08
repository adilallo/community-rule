import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, describe, vi } from "vitest";
import Checkbox from "../../app/components/Checkbox";

describe("Checkbox Component", () => {
  test("renders with default props", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  test("renders with label", () => {
    render(<Checkbox label="Test checkbox" />);
    expect(screen.getByText("Test checkbox")).toBeInTheDocument();
  });

  test("renders as checked when checked prop is true", () => {
    render(<Checkbox checked={true} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  test("renders as unchecked when checked prop is false", () => {
    render(<Checkbox checked={false} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  test("calls onChange when clicked", () => {
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith({
      checked: true,
      value: undefined,
      event: expect.any(Object),
    });
  });

  test("calls onChange when toggled from checked to unchecked", () => {
    const handleChange = vi.fn();
    render(<Checkbox checked={true} onChange={handleChange} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith({
      checked: false,
      value: undefined,
      event: expect.any(Object),
    });
  });

  test("handles keyboard navigation", () => {
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} />);

    const checkbox = screen.getByRole("checkbox");

    // Test Space key
    fireEvent.keyDown(checkbox, { key: " " });
    expect(handleChange).toHaveBeenCalledWith({
      checked: true,
      value: undefined,
      event: expect.any(Object),
    });

    // Test Enter key
    fireEvent.keyDown(checkbox, { key: "Enter" });
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  test("does not call onChange when disabled", () => {
    const handleChange = vi.fn();
    render(<Checkbox disabled={true} onChange={handleChange} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(handleChange).not.toHaveBeenCalled();
  });

  test("applies disabled attributes when disabled", () => {
    render(<Checkbox disabled={true} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-disabled", "true");
    expect(checkbox).toHaveAttribute("tabIndex", "-1");
  });

  test("applies correct tabIndex when not disabled", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("tabIndex", "0");
  });

  test("renders with standard mode by default", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  test("renders with inverse mode", () => {
    render(<Checkbox mode="inverse" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  test("applies custom className", () => {
    render(<Checkbox className="custom-class" />);
    const label = screen.getByRole("checkbox").closest("label");
    expect(label).toHaveClass("custom-class");
  });

  test("passes through additional props", () => {
    render(<Checkbox id="test-checkbox" name="test" value="test-value" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("id", "test-checkbox");
  });

  test("renders hidden native input for form compatibility", () => {
    render(<Checkbox name="test" value="test-value" checked={true} />);
    const hiddenInput = screen.getByDisplayValue("test-value");
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveAttribute("type", "checkbox");
    expect(hiddenInput).toHaveAttribute("name", "test");
    expect(hiddenInput).toBeChecked();
  });

  test("applies aria-label when provided", () => {
    render(<Checkbox ariaLabel="Custom label" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-label", "Custom label");
  });

  test("prevents default on mouse down", () => {
    render(<Checkbox />);
    const label = screen.getByRole("checkbox").closest("label");
    const mouseDownEvent = new MouseEvent("mousedown", { bubbles: true });
    const preventDefaultSpy = vi.spyOn(mouseDownEvent, "preventDefault");

    fireEvent(label, mouseDownEvent);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  test("renders checkmark SVG when checked", () => {
    render(<Checkbox checked={true} />);
    const svg = screen.getByRole("checkbox").querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
  });

  test("does not render checkmark SVG when unchecked", () => {
    render(<Checkbox checked={false} />);
    const svg = screen.getByRole("checkbox").querySelector("svg");
    expect(svg).toBeInTheDocument();
    // SVG should be present but checkmark should be transparent
    const path = svg.querySelector("polyline");
    expect(path).toHaveAttribute("stroke", "transparent");
  });
});
