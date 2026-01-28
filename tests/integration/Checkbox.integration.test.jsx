import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import { expect, test, describe, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Checkbox from "../../app/components/Checkbox";

// Test component that uses Checkbox in a form
function TestForm() {
  const [formData, setFormData] = useState({
    agree: false,
    newsletter: false,
    notifications: true,
  });

  const handleCheckboxChange =
    (field) =>
    ({ checked }) => {
      setFormData((prev) => ({ ...prev, [field]: checked }));
    };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
  };

  return (
    <form onSubmit={handleSubmit} data-testid="test-form">
      <Checkbox
        label="I agree to the terms"
        checked={formData.agree}
        onChange={handleCheckboxChange("agree")}
        name="agree"
        data-testid="agree-checkbox"
      />
      <Checkbox
        label="Subscribe to newsletter"
        checked={formData.newsletter}
        onChange={handleCheckboxChange("newsletter")}
        name="newsletter"
        data-testid="newsletter-checkbox"
      />
      <Checkbox
        label="Enable notifications"
        checked={formData.notifications}
        onChange={handleCheckboxChange("notifications")}
        name="notifications"
        data-testid="notifications-checkbox"
      />
      <button type="submit" data-testid="submit-button">
        Submit
      </button>
    </form>
  );
}

describe("Checkbox Integration Tests", () => {
  test("handles multiple checkboxes in a form", async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const agreeCheckbox = screen.getByTestId("agree-checkbox");
    const newsletterCheckbox = screen.getByTestId("newsletter-checkbox");
    const notificationsCheckbox = screen.getByTestId("notifications-checkbox");

    // Initial state
    expect(agreeCheckbox).toHaveAttribute("aria-checked", "false");
    expect(newsletterCheckbox).toHaveAttribute("aria-checked", "false");
    expect(notificationsCheckbox).toHaveAttribute("aria-checked", "true");

    // Toggle checkboxes
    await user.click(agreeCheckbox);
    await user.click(newsletterCheckbox);
    await user.click(notificationsCheckbox);

    // Check final state
    expect(agreeCheckbox).toHaveAttribute("aria-checked", "true");
    expect(newsletterCheckbox).toHaveAttribute("aria-checked", "true");
    expect(notificationsCheckbox).toHaveAttribute("aria-checked", "false");
  });

  test("handles keyboard navigation between checkboxes", async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const agreeCheckbox = screen.getByTestId("agree-checkbox");
    const newsletterCheckbox = screen.getByTestId("newsletter-checkbox");
    const notificationsCheckbox = screen.getByTestId("notifications-checkbox");

    // Focus first checkbox
    await user.tab();
    expect(agreeCheckbox).toHaveFocus();

    // Navigate to next checkbox
    await user.tab();
    expect(newsletterCheckbox).toHaveFocus();

    // Navigate to next checkbox
    await user.tab();
    expect(notificationsCheckbox).toHaveFocus();
  });

  test("handles keyboard activation", async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const agreeCheckbox = screen.getByTestId("agree-checkbox");

    // Focus and activate with Space
    await user.tab();
    expect(agreeCheckbox).toHaveFocus();
    expect(agreeCheckbox).toHaveAttribute("aria-checked", "false");

    await user.keyboard(" ");
    expect(agreeCheckbox).toHaveAttribute("aria-checked", "true");

    // Activate with Enter
    await user.keyboard("Enter");
    expect(agreeCheckbox).toHaveAttribute("aria-checked", "true");
  });

  test("handles mode switching", async () => {
    function ModeSwitchForm() {
      const [mode, setMode] = useState("standard");
      const [checked, setChecked] = useState(false);

      return (
        <div>
          <Checkbox
            label="Switch to inverse mode"
            checked={mode === "inverse"}
            onChange={({ checked }) =>
              setMode(checked ? "inverse" : "standard")
            }
            data-testid="mode-switch"
          />
          <Checkbox
            label="Test checkbox"
            checked={checked}
            onChange={({ checked }) => setChecked(checked)}
            mode={mode}
            data-testid="test-checkbox"
          />
        </div>
      );
    }

    const user = userEvent.setup();
    render(<ModeSwitchForm />);

    const modeSwitch = screen.getByTestId("mode-switch");
    const testCheckbox = screen.getByTestId("test-checkbox");

    // Initially standard mode
    expect(testCheckbox).toBeInTheDocument();

    // Switch to inverse mode
    await user.click(modeSwitch);
    expect(testCheckbox).toBeInTheDocument();

    // Should still be functional
    await user.click(testCheckbox);
    expect(testCheckbox).toHaveAttribute("aria-checked", "true");
  });

  test("handles form submission with checkbox values", async () => {
    const handleSubmit = vi.fn();

    function FormWithSubmission() {
      const [formData, setFormData] = useState({
        agree: false,
        newsletter: false,
      });

      const handleCheckboxChange =
        (field) =>
        ({ checked }) => {
          setFormData((prev) => ({ ...prev, [field]: checked }));
        };

      const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(formData);
      };

      return (
        <form onSubmit={onSubmit} data-testid="form">
          <Checkbox
            label="I agree"
            checked={formData.agree}
            onChange={handleCheckboxChange("agree")}
            name="agree"
            value="yes"
            data-testid="agree-checkbox"
          />
          <Checkbox
            label="Newsletter"
            checked={formData.newsletter}
            onChange={handleCheckboxChange("newsletter")}
            name="newsletter"
            value="yes"
            data-testid="newsletter-checkbox"
          />
          <button type="submit" data-testid="submit-button">
            Submit
          </button>
        </form>
      );
    }

    const user = userEvent.setup();
    render(<FormWithSubmission />);

    const agreeCheckbox = screen.getByTestId("agree-checkbox");
    const newsletterCheckbox = screen.getByTestId("newsletter-checkbox");
    const submitButton = screen.getByTestId("submit-button");

    // Check some checkboxes
    await user.click(agreeCheckbox);
    await user.click(newsletterCheckbox);

    // Submit form
    await user.click(submitButton);

    // Verify form data was captured
    expect(handleSubmit).toHaveBeenCalledWith({
      agree: true,
      newsletter: true,
    });
  });

  test("handles accessibility in form context", async () => {
    render(<TestForm />);

    const form = screen.getByTestId("test-form");
    const checkboxes = screen.getAllByRole("checkbox");

    // All checkboxes should be accessible
    expect(checkboxes).toHaveLength(3);

    checkboxes.forEach((checkbox) => {
      expect(checkbox).toHaveAttribute("role", "checkbox");
      expect(checkbox).toHaveAttribute("aria-checked");
      expect(checkbox).toHaveAttribute("tabIndex");
    });

    // Form should be accessible
    expect(form).toBeInTheDocument();
  });
});
