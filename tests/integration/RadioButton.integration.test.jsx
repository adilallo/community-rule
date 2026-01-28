import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import RadioButton from "../../app/components/RadioButton";

describe("RadioButton Integration", () => {
  it("works in form context", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    function TestForm() {
      const [value, setValue] = useState("option1");

      return (
        <form onSubmit={handleSubmit}>
          <RadioButton
            label="Option 1"
            name="test-radio"
            value="option1"
            checked={value === "option1"}
            onChange={({ checked }) => checked && setValue("option1")}
          />
          <RadioButton
            label="Option 2"
            name="test-radio"
            value="option2"
            checked={value === "option2"}
            onChange={({ checked }) => checked && setValue("option2")}
          />
          <button type="submit">Submit</button>
        </form>
      );
    }

    render(<TestForm />);

    const option2 = screen.getByText("Option 2").closest("label");
    const submitButton = screen.getByRole("button");

    // Initially option1 should be selected
    expect(screen.getByDisplayValue("option1")).toBeChecked();
    expect(screen.getByDisplayValue("option2")).not.toBeChecked();

    // Click option2
    await user.click(option2);
    expect(screen.getByDisplayValue("option2")).toBeChecked();
    expect(screen.getByDisplayValue("option1")).not.toBeChecked();

    // Submit form
    await user.click(submitButton);
    expect(handleSubmit).toHaveBeenCalled();
  });

  it("handles keyboard navigation", async () => {
    const user = userEvent.setup();

    function KeyboardForm() {
      const [value, setValue] = useState("option1");

      return (
        <div>
          <RadioButton
            label="Option 1"
            name="keyboard-radio"
            value="option1"
            checked={value === "option1"}
            onChange={({ checked }) => checked && setValue("option1")}
          />
          <RadioButton
            label="Option 2"
            name="keyboard-radio"
            value="option2"
            checked={value === "option2"}
            onChange={({ checked }) => checked && setValue("option2")}
          />
        </div>
      );
    }

    render(<KeyboardForm />);

    const radioButtons = screen.getAllByRole("radio");

    // Focus first radio button
    radioButtons[0].focus();
    expect(radioButtons[0]).toHaveFocus();

    // Navigate to second radio button
    await user.tab();
    expect(radioButtons[1]).toHaveFocus();

    // Activate with Space
    await user.keyboard(" ");
    expect(screen.getByDisplayValue("option2")).toBeChecked();
  });

  it("handles mode switching", async () => {
    function ModeSwitchForm() {
      const [mode, setMode] = useState("standard");
      const [value, setValue] = useState("option1");

      return (
        <div>
          <button
            onClick={() =>
              setMode(mode === "standard" ? "inverse" : "standard")
            }
          >
            Toggle Mode
          </button>
          <RadioButton
            label="Test Radio"
            name="mode-radio"
            value="option1"
            checked={value === "option1"}
            mode={mode}
            onChange={({ checked }) => checked && setValue("option1")}
          />
        </div>
      );
    }

    const user = userEvent.setup();
    render(<ModeSwitchForm />);

    const toggleButton = screen.getByRole("button");
    const radioButton = screen.getByRole("radio");

    // Initially standard mode
    expect(radioButton).toHaveClass(
      "outline-[var(--color-border-default-tertiary)]",
    );

    // Switch to inverse mode
    await user.click(toggleButton);
    expect(radioButton).toHaveClass(
      "outline-[var(--color-border-inverse-primary)]",
    );
  });

  it("maintains state across re-renders", () => {
    function StateForm() {
      const [value, setValue] = useState("option1");
      const [count, setCount] = useState(0);

      return (
        <div>
          <button onClick={() => setCount(count + 1)}>
            Re-render ({count})
          </button>
          <RadioButton
            label="Test Radio"
            name="state-radio"
            value="option1"
            checked={value === "option1"}
            onChange={({ checked }) => checked && setValue("option1")}
          />
        </div>
      );
    }

    const user = userEvent.setup();
    render(<StateForm />);

    const radioButton = screen.getByRole("radio");
    const reRenderButton = screen.getByRole("button");

    // Should be checked initially
    expect(radioButton).toHaveAttribute("aria-checked", "true");

    // Re-render should maintain state
    user.click(reRenderButton);
    expect(radioButton).toHaveAttribute("aria-checked", "true");
  });

  it("works with multiple radio groups", async () => {
    function MultiGroupForm() {
      const [group1Value, setGroup1Value] = useState("option1");
      const [group2Value, setGroup2Value] = useState("option1");

      return (
        <div>
          <div>
            <h3>Group 1</h3>
            <RadioButton
              label="Option A"
              name="group1"
              value="option1"
              checked={group1Value === "option1"}
              onChange={({ checked }) => checked && setGroup1Value("option1")}
            />
            <RadioButton
              label="Option B"
              name="group1"
              value="option2"
              checked={group1Value === "option2"}
              onChange={({ checked }) => checked && setGroup1Value("option2")}
            />
          </div>
          <div>
            <h3>Group 2</h3>
            <RadioButton
              label="Option X"
              name="group2"
              value="option1"
              checked={group2Value === "option1"}
              onChange={({ checked }) => checked && setGroup2Value("option1")}
            />
            <RadioButton
              label="Option Y"
              name="group2"
              value="option2"
              checked={group2Value === "option2"}
              onChange={({ checked }) => checked && setGroup2Value("option2")}
            />
          </div>
        </div>
      );
    }

    const user = userEvent.setup();
    render(<MultiGroupForm />);

    // Both groups should work independently
    const group1OptionB = screen.getByText("Option B").closest("label");
    const group2OptionY = screen.getByText("Option Y").closest("label");

    await user.click(group1OptionB);
    await user.click(group2OptionY);

    const group1Inputs = screen
      .getAllByDisplayValue("option2")
      .filter((input) => input.getAttribute("name") === "group1");
    const group2Inputs = screen
      .getAllByDisplayValue("option2")
      .filter((input) => input.getAttribute("name") === "group2");

    expect(group1Inputs[0]).toBeChecked();
    expect(group2Inputs[0]).toBeChecked();
  });

  it("handles controlled and uncontrolled scenarios", async () => {
    function ControlledForm() {
      const [controlledValue, setControlledValue] = useState("option1");
      const [uncontrolledValue, setUncontrolledValue] = useState("option1");

      return (
        <div>
          <div>
            <h3>Controlled</h3>
            <RadioButton
              label="Controlled Option 1"
              name="controlled"
              value="option1"
              checked={controlledValue === "option1"}
              onChange={({ checked }) =>
                checked && setControlledValue("option1")
              }
            />
            <RadioButton
              label="Controlled Option 2"
              name="controlled"
              value="option2"
              checked={controlledValue === "option2"}
              onChange={({ checked }) =>
                checked && setControlledValue("option2")
              }
            />
          </div>
          <div>
            <h3>Uncontrolled</h3>
            <RadioButton
              label="Uncontrolled Option 1"
              name="uncontrolled"
              value="option1"
              checked={uncontrolledValue === "option1"}
              onChange={({ checked }) =>
                checked && setUncontrolledValue("option1")
              }
            />
            <RadioButton
              label="Uncontrolled Option 2"
              name="uncontrolled"
              value="option2"
              checked={uncontrolledValue === "option2"}
              onChange={({ checked }) =>
                checked && setUncontrolledValue("option2")
              }
            />
          </div>
        </div>
      );
    }

    const user = userEvent.setup();
    render(<ControlledForm />);

    // Both should work the same way
    const controlledOption2 = screen
      .getByText("Controlled Option 2")
      .closest("label");
    const uncontrolledOption2 = screen
      .getByText("Uncontrolled Option 2")
      .closest("label");

    await user.click(controlledOption2);
    await user.click(uncontrolledOption2);

    const controlledInputs = screen
      .getAllByDisplayValue("option2")
      .filter((input) => input.getAttribute("name") === "controlled");
    const uncontrolledInputs = screen
      .getAllByDisplayValue("option2")
      .filter((input) => input.getAttribute("name") === "uncontrolled");

    expect(controlledInputs[0]).toBeChecked();
    expect(uncontrolledInputs[0]).toBeChecked();
  });

  it("handles accessibility in complex forms", () => {
    function AccessibleForm() {
      const [value, setValue] = useState("option1");

      return (
        <form>
          <fieldset>
            <legend>Choose an option</legend>
            <RadioButton
              label="Option 1"
              name="accessible-radio"
              value="option1"
              checked={value === "option1"}
              onChange={({ checked }) => checked && setValue("option1")}
              ariaLabel="First option"
            />
            <RadioButton
              label="Option 2"
              name="accessible-radio"
              value="option2"
              checked={value === "option2"}
              onChange={({ checked }) => checked && setValue("option2")}
              ariaLabel="Second option"
            />
          </fieldset>
        </form>
      );
    }

    render(<AccessibleForm />);

    const radioButtons = screen.getAllByRole("radio");

    // Should have proper accessibility attributes
    radioButtons.forEach((button) => {
      expect(button).toHaveAttribute("role", "radio");
      expect(button).toHaveAttribute("aria-checked");
      expect(button).toHaveAttribute("tabIndex", "0");
    });

    // Should have aria-labels
    expect(radioButtons[0]).toHaveAttribute("aria-label", "First option");
    expect(radioButtons[1]).toHaveAttribute("aria-label", "Second option");
  });
});
