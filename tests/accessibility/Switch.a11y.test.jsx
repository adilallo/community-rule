import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import Switch from "../../app/components/Switch";

expect.extend(toHaveNoViolations);

describe("Switch Accessibility", () => {
  it("has proper ARIA attributes", () => {
    render(<Switch checked={false} label="Test Switch" />);
    const switchButton = screen.getByRole("switch");

    expect(switchButton).toHaveAttribute("role", "switch");
    expect(switchButton).toHaveAttribute("aria-checked", "false");
    expect(switchButton).toHaveAttribute("aria-label", "Test Switch");
  });

  it("has proper ARIA attributes when checked", () => {
    render(<Switch checked={true} label="Test Switch" />);
    const switchButton = screen.getByRole("switch");

    expect(switchButton).toHaveAttribute("aria-checked", "true");
  });

  it("has proper ARIA attributes when focused", () => {
    render(<Switch state="focus" label="Test Switch" />);
    const switchButton = screen.getByRole("switch");

    expect(switchButton).toHaveAttribute("aria-checked", "false");
    expect(switchButton).toHaveClass("shadow-[0_0_5px_3px_#3281F8]");
    expect(switchButton).toHaveClass("rounded-full");
    expect(switchButton).toHaveAttribute("aria-label", "Test Switch");
  });

  it("handles keyboard navigation", () => {
    const handleChange = vi.fn();
    render(<Switch onChange={handleChange} label="Test Switch" />);
    const switchButton = screen.getByRole("switch");

    // Test Enter key
    fireEvent.keyDown(switchButton, { key: "Enter" });
    expect(handleChange).toHaveBeenCalledTimes(1);

    // Test Space key
    fireEvent.keyDown(switchButton, { key: " " });
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it("handles focus state accessibility", () => {
    const handleFocus = vi.fn();
    render(<Switch onFocus={handleFocus} label="Test Switch" />);
    const switchButton = screen.getByRole("switch");

    fireEvent.focus(switchButton);
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it("handles checked state accessibility", () => {
    const { rerender } = render(<Switch checked={false} label="Test Switch" />);
    let switchButton = screen.getByRole("switch");
    expect(switchButton).toHaveAttribute("aria-checked", "false");

    rerender(<Switch checked={true} label="Test Switch" />);
    switchButton = screen.getByRole("switch");
    expect(switchButton).toHaveAttribute("aria-checked", "true");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Switch label="Test Switch" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when checked", async () => {
    const { container } = render(<Switch checked={true} label="Test Switch" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when focused", async () => {
    const { container } = render(<Switch state="focus" label="Test Switch" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with text", async () => {
    const { container } = render(<Switch label="Enable notifications" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations without text", async () => {
    const { container } = render(<Switch />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
