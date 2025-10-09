import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import RadioGroup from "../../app/components/RadioGroup";

describe("RadioGroup Integration", () => {
  const defaultOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  it("works in form context", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    
    function TestForm() {
      const [value, setValue] = useState("option1");
      
      return (
        <form onSubmit={handleSubmit}>
          <RadioGroup
            name="test-radio-group"
            value={value}
            options={defaultOptions}
            onChange={({ value }) => setValue(value)}
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
    const handleChange = vi.fn();
    
    function KeyboardForm() {
      const [value, setValue] = useState("option1");
      
      return (
        <RadioGroup
          name="keyboard-radio-group"
          value={value}
          options={defaultOptions}
          onChange={({ value }) => setValue(value)}
        />
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
          <button onClick={() => setMode(mode === "standard" ? "inverse" : "standard")}>
            Toggle Mode
          </button>
          <RadioGroup
            name="mode-radio-group"
            value={value}
            mode={mode}
            options={defaultOptions}
            onChange={({ value }) => setValue(value)}
          />
        </div>
      );
    }

    const user = userEvent.setup();
    render(<ModeSwitchForm />);

    const toggleButton = screen.getByRole("button");
    const radioButtons = screen.getAllByRole("radio");
    
    // Initially standard mode
    radioButtons.forEach(button => {
      expect(button).toHaveClass("outline-[var(--color-border-default-tertiary)]");
    });
    
    // Switch to inverse mode
    await user.click(toggleButton);
    radioButtons.forEach(button => {
      expect(button).toHaveClass("outline-[var(--color-border-inverse-primary)]");
    });
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
          <RadioGroup
            name="state-radio-group"
            value={value}
            options={defaultOptions}
            onChange={({ value }) => setValue(value)}
          />
        </div>
      );
    }

    const user = userEvent.setup();
    render(<StateForm />);

    const radioButtons = screen.getAllByRole("radio");
    const reRenderButton = screen.getByRole("button");
    
    // Should be checked initially
    expect(radioButtons[0]).toHaveAttribute("aria-checked", "true");
    
    // Re-render should maintain state
    user.click(reRenderButton);
    expect(radioButtons[0]).toHaveAttribute("aria-checked", "true");
  });

  it("works with multiple radio groups", async () => {
    function MultiGroupForm() {
      const [group1Value, setGroup1Value] = useState("option1");
      const [group2Value, setGroup2Value] = useState("option1");
      
      return (
        <div>
          <div>
            <h3>Group 1</h3>
            <RadioGroup
              name="group1"
              value={group1Value}
              options={defaultOptions}
              onChange={({ value }) => setGroup1Value(value)}
            />
          </div>
          <div>
            <h3>Group 2</h3>
            <RadioGroup
              name="group2"
              value={group2Value}
              options={defaultOptions}
              onChange={({ value }) => setGroup2Value(value)}
            />
          </div>
        </div>
      );
    }

    const user = userEvent.setup();
    render(<MultiGroupForm />);

    // Both groups should work independently
    // Find the Option 2 in group1 by filtering getAllByDisplayValue by name
    const group1Option2Input = screen.getAllByDisplayValue("option2").find(
      input => input.getAttribute("name") === "group1"
    );
    const group1Option2 = group1Option2Input.closest("label");
    
    // Find the Option 3 in group2 by filtering getAllByDisplayValue by name
    const group2Option3Input = screen.getAllByDisplayValue("option3").find(
      input => input.getAttribute("name") === "group2"
    );
    const group2Option3 = group2Option3Input.closest("label");
    
    await user.click(group1Option2);
    await user.click(group2Option3);
    
    const group1Inputs = screen.getAllByDisplayValue("option2").filter(
      input => input.getAttribute("name") === "group1"
    );
    const group2Inputs = screen.getAllByDisplayValue("option3").filter(
      input => input.getAttribute("name") === "group2"
    );
    
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
            <RadioGroup
              name="controlled"
              value={controlledValue}
              options={defaultOptions}
              onChange={({ value }) => setControlledValue(value)}
            />
          </div>
          <div>
            <h3>Uncontrolled</h3>
            <RadioGroup
              name="uncontrolled"
              value={uncontrolledValue}
              options={defaultOptions}
              onChange={({ value }) => setUncontrolledValue(value)}
            />
          </div>
        </div>
      );
    }

    const user = userEvent.setup();
    render(<ControlledForm />);

    // Both should work the same way
    // Find the Option 2 in controlled group by filtering getAllByDisplayValue by name
    const controlledOption2Input = screen.getAllByDisplayValue("option2").find(
      input => input.getAttribute("name") === "controlled"
    );
    const controlledOption2 = controlledOption2Input.closest("label");
    
    // Find the Option 2 in uncontrolled group by filtering getAllByDisplayValue by name
    const uncontrolledOption2Input = screen.getAllByDisplayValue("option2").find(
      input => input.getAttribute("name") === "uncontrolled"
    );
    const uncontrolledOption2 = uncontrolledOption2Input.closest("label");
    
    await user.click(controlledOption2);
    await user.click(uncontrolledOption2);
    
    const controlledInputs = screen.getAllByDisplayValue("option2").filter(
      input => input.getAttribute("name") === "controlled"
    );
    const uncontrolledInputs = screen.getAllByDisplayValue("option2").filter(
      input => input.getAttribute("name") === "uncontrolled"
    );
    
    expect(controlledInputs[0]).toBeChecked();
    expect(uncontrolledInputs[0]).toBeChecked();
  });

  it("handles accessibility in complex forms", () => {
    function AccessibleForm() {
      const [value, setValue] = useState("option1");
      
      const accessibleOptions = [
        { value: "option1", label: "Option 1", ariaLabel: "First option" },
        { value: "option2", label: "Option 2", ariaLabel: "Second option" },
        { value: "option3", label: "Option 3", ariaLabel: "Third option" },
      ];
      
      return (
        <form>
          <fieldset>
            <legend>Choose an option</legend>
            <RadioGroup
              name="accessible-radio-group"
              value={value}
              options={accessibleOptions}
              onChange={({ value }) => setValue(value)}
              aria-label="Accessible radio group"
            />
          </fieldset>
        </form>
      );
    }

    render(<AccessibleForm />);

    const radioGroup = screen.getByRole("radiogroup");
    const radioButtons = screen.getAllByRole("radio");
    
    // Should have proper accessibility attributes
    expect(radioGroup).toHaveAttribute("aria-label", "Accessible radio group");
    
    radioButtons.forEach(button => {
      expect(button).toHaveAttribute("role", "radio");
      expect(button).toHaveAttribute("aria-checked");
      expect(button).toHaveAttribute("tabIndex", "0");
    });
    
    // Should have aria-labels
    expect(radioButtons[0]).toHaveAttribute("aria-label", "First option");
    expect(radioButtons[1]).toHaveAttribute("aria-label", "Second option");
    expect(radioButtons[2]).toHaveAttribute("aria-label", "Third option");
  });

  it("handles dynamic options", async () => {
    function DynamicForm() {
      const [value, setValue] = useState("option1");
      const [options, setOptions] = useState(defaultOptions);
      
      return (
        <div>
          <button onClick={() => setOptions([...options, { value: "option4", label: "Option 4" }])}>
            Add Option
          </button>
          <RadioGroup
            name="dynamic-radio-group"
            value={value}
            options={options}
            onChange={({ value }) => setValue(value)}
          />
        </div>
      );
    }

    const user = userEvent.setup();
    render(<DynamicForm />);

    const addButton = screen.getByRole("button");
    
    // Initially 3 options
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    
    // Add option
    await user.click(addButton);
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    expect(screen.getByText("Option 4")).toBeInTheDocument();
  });

  it("handles empty options gracefully", () => {
    function EmptyForm() {
      const [value, setValue] = useState("");
      
      return (
        <RadioGroup
          name="empty-radio-group"
          value={value}
          options={[]}
          onChange={({ value }) => setValue(value)}
        />
      );
    }

    render(<EmptyForm />);

    const radioGroup = screen.getByRole("radiogroup");
    expect(radioGroup).toBeInTheDocument();
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
  });

  it("maintains single selection behavior", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    function SingleSelectionForm() {
      const [value, setValue] = useState("option1");
      
      return (
        <RadioGroup
          name="single-selection-radio-group"
          value={value}
          options={defaultOptions}
          onChange={({ value }) => {
            setValue(value);
            handleChange(value);
          }}
        />
      );
    }

    render(<SingleSelectionForm />);

    const radioButtons = screen.getAllByRole("radio");
    
    // Initially option1 should be selected
    expect(radioButtons[0]).toHaveAttribute("aria-checked", "true");
    expect(radioButtons[1]).toHaveAttribute("aria-checked", "false");
    expect(radioButtons[2]).toHaveAttribute("aria-checked", "false");
    
    // Click option2
    const option2 = screen.getByText("Option 2").closest("label");
    await user.click(option2);
    
    // Only option2 should be selected
    expect(radioButtons[0]).toHaveAttribute("aria-checked", "false");
    expect(radioButtons[1]).toHaveAttribute("aria-checked", "true");
    expect(radioButtons[2]).toHaveAttribute("aria-checked", "false");
    
    expect(handleChange).toHaveBeenCalledWith("option2");
  });
});
