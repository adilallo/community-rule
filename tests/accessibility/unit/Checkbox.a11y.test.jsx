import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test, describe } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import Checkbox from "../../../app/components/Checkbox";

expect.extend(toHaveNoViolations);

describe("Checkbox Accessibility", () => {
  test("should not have accessibility violations when unchecked", async () => {
    const { container } = render(<Checkbox label="Test checkbox" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("should not have accessibility violations when checked", async () => {
    const { container } = render(
      <Checkbox label="Test checkbox" checked={true} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("should not have accessibility violations when disabled", async () => {
    const { container } = render(
      <Checkbox label="Test checkbox" disabled={true} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("should not have accessibility violations in inverse mode", async () => {
    const { container } = render(
      <Checkbox label="Test checkbox" mode="inverse" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("should have proper ARIA attributes", () => {
    render(<Checkbox label="Test checkbox" checked={true} />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toHaveAttribute("role", "checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(checkbox).toHaveAttribute("tabIndex", "0");
  });

  test("should have proper ARIA attributes when disabled", () => {
    render(<Checkbox label="Test checkbox" disabled={true} />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toHaveAttribute("role", "checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    expect(checkbox).toHaveAttribute("aria-disabled", "true");
    expect(checkbox).toHaveAttribute("tabIndex", "-1");
  });

  test("should have proper ARIA attributes when checked", () => {
    render(<Checkbox label="Test checkbox" checked={true} />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toHaveAttribute("role", "checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(checkbox).toHaveAttribute("tabIndex", "0");
  });

  test("should have proper ARIA attributes when unchecked", () => {
    render(<Checkbox label="Test checkbox" checked={false} />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toHaveAttribute("role", "checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    expect(checkbox).toHaveAttribute("tabIndex", "0");
  });

  test("should have proper ARIA attributes with custom aria-label", () => {
    render(<Checkbox ariaLabel="Custom accessibility label" />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toHaveAttribute(
      "aria-label",
      "Custom accessibility label"
    );
  });

  test("should have proper focus management", () => {
    const { rerender } = render(<Checkbox label="Test checkbox" />);
    const checkbox = screen.getByRole("checkbox");

    // Should be focusable when not disabled
    expect(checkbox).toHaveAttribute("tabIndex", "0");

    // Should not be focusable when disabled
    rerender(
      <Checkbox label="Test checkbox disabled" disabled={true} />
    );
    const disabledCheckbox = screen.getByRole("checkbox");
    expect(disabledCheckbox).toHaveAttribute("tabIndex", "-1");
  });

  test("should have proper keyboard navigation", () => {
    render(<Checkbox label="Test checkbox" />);
    const checkbox = screen.getByRole("checkbox");

    // Should be focusable
    expect(checkbox).toHaveAttribute("tabIndex", "0");

    // Should support keyboard interaction
    expect(checkbox).toHaveAttribute("role", "checkbox");
  });

  test("should have proper semantic structure", () => {
    render(<Checkbox label="Test checkbox" />);

    // Should have a label element
    const label = screen.getByText("Test checkbox").closest("label");
    expect(label).toBeInTheDocument();

    // Should have a checkbox role
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();

    // Should be associated with the label
    expect(label).toContainElement(checkbox);
  });

  test("should have proper color contrast", async () => {
    const { container } = render(<Checkbox label="Test checkbox" />);
    const results = await axe(container);

    // Check for color contrast violations
    const contrastViolations = results.violations.filter(
      (violation) => violation.id === "color-contrast"
    );
    expect(contrastViolations).toHaveLength(0);
  });

  test("should have proper focus indicators", async () => {
    const { container } = render(<Checkbox label="Test checkbox" />);
    const results = await axe(container);

    // Check for focus indicator violations
    const focusViolations = results.violations.filter(
      (violation) => violation.id === "focus-order-semantics"
    );
    expect(focusViolations).toHaveLength(0);
  });

  test("should have proper form integration", () => {
    render(<Checkbox name="test-checkbox" value="test-value" checked={true} />);

    // Should have hidden input for form submission
    const hiddenInput = screen.getByDisplayValue("test-value");
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveAttribute("type", "checkbox");
    expect(hiddenInput).toHaveAttribute("name", "test-checkbox");
    expect(hiddenInput).toBeChecked();
  });
});
