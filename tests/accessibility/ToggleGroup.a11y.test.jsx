import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import ToggleGroup from "../../app/components/ToggleGroup";

expect.extend(toHaveNoViolations);

describe("ToggleGroup Accessibility", () => {
  it("has proper ARIA attributes", () => {
    render(<ToggleGroup>Toggle Item</ToggleGroup>);
    const toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveAttribute("type", "button");
    expect(toggleGroup).toHaveAttribute("role", "button");
  });

  it("has proper ARIA attributes when focused", () => {
    render(<ToggleGroup state="focus">Focused Toggle</ToggleGroup>);
    const toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveAttribute("type", "button");
    expect(toggleGroup).toHaveAttribute("role", "button");
  });

  it("handles keyboard navigation", () => {
    const handleChange = vi.fn();
    render(<ToggleGroup onChange={handleChange}>Keyboard Toggle</ToggleGroup>);
    const toggleGroup = screen.getByRole("button");

    // Test Enter key
    fireEvent.keyDown(toggleGroup, { key: "Enter" });
    expect(handleChange).toHaveBeenCalledTimes(1);

    // Test Space key
    fireEvent.keyDown(toggleGroup, { key: " " });
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it("handles focus state accessibility", () => {
    render(<ToggleGroup state="focus">Focus Toggle</ToggleGroup>);
    const toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass("shadow-[0_0_5px_1px_#3281F8]");
  });

  it("handles selected state accessibility", () => {
    render(<ToggleGroup state="selected">Selected Toggle</ToggleGroup>);
    const toggleGroup = screen.getByRole("button");
    expect(toggleGroup).toHaveClass("bg-[var(--color-magenta-magenta100)]");
    expect(toggleGroup).toHaveClass(
      "shadow-[inset_0_0_0_1px_var(--color-border-default-secondary)]",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ToggleGroup>Accessible Toggle</ToggleGroup>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when focused", async () => {
    const { container } = render(
      <ToggleGroup state="focus">Focused Toggle</ToggleGroup>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when selected", async () => {
    const { container } = render(
      <ToggleGroup state="selected">Selected Toggle</ToggleGroup>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with text", async () => {
    const { container } = render(
      <ToggleGroup showText={true}>Text Toggle</ToggleGroup>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations without text", async () => {
    const { container } = render(
      <ToggleGroup showText={false} ariaLabel="Icon Toggle">
        Icon Toggle
      </ToggleGroup>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
