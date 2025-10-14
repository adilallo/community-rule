import { expect, test, describe, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Toggle from "../../app/components/Toggle";

describe("Toggle Component", () => {
  test("renders with default props", () => {
    render(<Toggle label="Test Toggle" />);

    const toggle = screen.getByRole("switch");
    const label = screen.getByText("Test Toggle");

    expect(toggle).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(toggle).toHaveAttribute("type", "button");
  });

  test("renders with custom props", () => {
    render(
      <Toggle
        label="Custom Toggle"
        checked={true}
        disabled={true}
        className="custom-class"
      />,
    );

    const toggle = screen.getByRole("switch");
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(toggle).toHaveAttribute("disabled");
  });

  test("handles checked state", () => {
    const { rerender } = render(<Toggle label="Test Toggle" checked={false} />);

    let toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");

    rerender(<Toggle label="Test Toggle" checked={true} />);
    toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  test("handles disabled state", () => {
    render(<Toggle label="Test Toggle" disabled={true} />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("disabled");
    expect(toggle).toHaveClass("cursor-not-allowed");
  });

  test("handles state prop", () => {
    const { rerender } = render(<Toggle label="Test Toggle" state="focus" />);

    let toggle = screen.getByRole("switch");
    expect(toggle).toHaveClass("shadow-[0_0_5px_1px_#3281F8]");

    rerender(<Toggle label="Test Toggle" state="default" />);
    toggle = screen.getByRole("switch");
    expect(toggle).not.toHaveClass("shadow-[0_0_5px_1px_#3281F8]");
  });

  test("handles showIcon and icon props", () => {
    render(<Toggle label="Test Toggle" showIcon={true} icon="I" />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveTextContent("I");
  });

  test("handles showText and text props", () => {
    render(<Toggle label="Test Toggle" showText={true} text="Toggle" />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveTextContent("Toggle");
  });

  test("handles both icon and text", () => {
    render(
      <Toggle
        label="Test Toggle"
        showIcon={true}
        showText={true}
        icon="I"
        text="Toggle"
      />,
    );

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveTextContent("I");
    expect(toggle).toHaveTextContent("Toggle");
  });

  test("calls onChange when clicked", () => {
    const handleChange = vi.fn();
    render(<Toggle label="Test Toggle" onChange={handleChange} />);

    const toggle = screen.getByRole("switch");
    fireEvent.click(toggle);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test("does not call onChange when disabled", () => {
    const handleChange = vi.fn();
    render(
      <Toggle label="Test Toggle" disabled={true} onChange={handleChange} />,
    );

    const toggle = screen.getByRole("switch");
    fireEvent.click(toggle);

    expect(handleChange).not.toHaveBeenCalled();
  });

  test("applies correct classes for different states", () => {
    const { rerender } = render(<Toggle label="Test Toggle" checked={false} />);

    let toggle = screen.getByRole("switch");
    expect(toggle).toHaveClass("bg-[var(--color-surface-default-primary)]");

    rerender(<Toggle label="Test Toggle" checked={true} />);
    toggle = screen.getByRole("switch");
    expect(toggle).toHaveClass("bg-[var(--color-magenta-magenta100)]");

    rerender(<Toggle label="Test Toggle" disabled={true} />);
    toggle = screen.getByRole("switch");
    expect(toggle).toHaveClass("bg-[var(--color-surface-default-tertiary)]");
  });

  test("applies hover classes when not checked", () => {
    render(<Toggle label="Test Toggle" checked={false} />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveClass(
      "hover:!bg-[var(--color-surface-default-secondary)]",
    );
  });

  test("does not apply hover classes when checked", () => {
    render(<Toggle label="Test Toggle" checked={true} />);

    const toggle = screen.getByRole("switch");
    expect(toggle).not.toHaveClass(
      "hover:!bg-[var(--color-surface-default-secondary)]",
    );
  });

  test("applies focus-visible classes", () => {
    render(<Toggle label="Test Toggle" />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveClass("focus-visible:shadow-[0_0_5px_1px_#3281F8]");
  });

  test("applies correct size classes", () => {
    render(<Toggle label="Test Toggle" />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveClass("h-[var(--measures-sizing-032)]");
    expect(toggle).toHaveClass("px-[16px]");
    expect(toggle).toHaveClass("py-[8px]");
    expect(toggle).toHaveClass("gap-[4px]");
  });

  test("applies correct text classes", () => {
    render(<Toggle label="Test Toggle" />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveClass("text-[12px]");
    expect(toggle).toHaveClass("leading-[16px]");
  });

  test("applies correct label classes", () => {
    render(<Toggle label="Test Toggle" />);

    const label = screen.getByText("Test Toggle");
    expect(label).toHaveClass("text-[12px]");
    expect(label).toHaveClass("leading-[16px]");
    expect(label).toHaveClass("text-[var(--color-content-default-secondary)]");
  });

  test("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Toggle label="Test Toggle" ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  test("applies custom className", () => {
    render(<Toggle label="Test Toggle" className="custom-class" />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveClass("custom-class");
  });
});
