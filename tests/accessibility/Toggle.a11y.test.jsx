import { expect, test, describe, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import Toggle from "../../app/components/Toggle";

expect.extend(toHaveNoViolations);

describe("Toggle Accessibility", () => {
  test("has proper ARIA attributes", () => {
    render(<Toggle label="Test Toggle" />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(toggle).toHaveAttribute("type", "button");
  });

  test("has proper ARIA attributes when checked", () => {
    render(<Toggle label="Test Toggle" checked={true} />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  test("has proper ARIA attributes when disabled", () => {
    render(<Toggle label="Test Toggle" disabled={true} />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("disabled");
  });

  test("has proper label association", () => {
    render(<Toggle label="Test Toggle" />);

    const toggle = screen.getByRole("switch");
    const label = screen.getByText("Test Toggle");

    expect(toggle).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  test("handles keyboard navigation", () => {
    const handleChange = vi.fn();
    render(<Toggle label="Test Toggle" onChange={handleChange} />);

    const toggle = screen.getByRole("switch");
    toggle.focus();
    expect(toggle).toHaveFocus();

    fireEvent.keyDown(toggle, { key: "Enter" });
    expect(handleChange).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(toggle, { key: " " });
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  test("handles disabled state accessibility", () => {
    const handleChange = vi.fn();
    render(
      <Toggle label="Test Toggle" disabled={true} onChange={handleChange} />
    );

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("disabled");
    expect(toggle).toHaveClass("cursor-not-allowed");

    fireEvent.click(toggle);
    expect(handleChange).not.toHaveBeenCalled();
  });

  test("handles focus state accessibility", () => {
    render(<Toggle label="Test Toggle" />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveClass("focus-visible:shadow-[0_0_5px_1px_#3281F8]");
  });

  test("has no accessibility violations", async () => {
    const { container } = render(<Toggle label="Test Toggle" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("has no accessibility violations when checked", async () => {
    const { container } = render(<Toggle label="Test Toggle" checked={true} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("has no accessibility violations when disabled", async () => {
    const { container } = render(
      <Toggle label="Test Toggle" disabled={true} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("has no accessibility violations with icon", async () => {
    const { container } = render(
      <Toggle label="Test Toggle" showIcon={true} icon="I" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("has no accessibility violations with text", async () => {
    const { container } = render(
      <Toggle label="Test Toggle" showText={true} text="Toggle" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
