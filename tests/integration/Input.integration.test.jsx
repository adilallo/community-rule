import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, describe, vi } from "vitest";
import Input from "../../app/components/Input";

// Test component that uses Input with state management
const TestInputForm = ({ initialValue = "", onValueChange }) => {
  const [value, setValue] = useState(initialValue);
  const [focused, setFocused] = useState(false);

  const handleChange = (e) => {
    setValue(e.target.value);
    onValueChange?.(e.target.value);
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  return (
    <div>
      <Input
        label="Test Input"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        state={focused ? "focus" : "default"}
      />
      <div data-testid="value-display">{value}</div>
      <div data-testid="focus-status">{focused ? "focused" : "blurred"}</div>
    </div>
  );
};

// Test component with multiple inputs
const MultiInputForm = () => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <form>
      <Input
        label="First Name"
        name="firstName"
        value={values.firstName}
        onChange={handleChange("firstName")}
      />
      <Input
        label="Last Name"
        name="lastName"
        value={values.lastName}
        onChange={handleChange("lastName")}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange("email")}
      />
    </form>
  );
};

// Test component with validation
const ValidatedInputForm = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setValue(e.target.value);
    setError(e.target.value.length < 3);
  };

  return (
    <div>
      <Input
        label="Required Field"
        value={value}
        onChange={handleChange}
        error={error}
      />
      {error && (
        <div data-testid="error-message">Minimum 3 characters required</div>
      )}
    </div>
  );
};

describe("Input Component Integration", () => {
  test("handles controlled input with state management", async () => {
    const onValueChange = vi.fn();
    render(<TestInputForm onValueChange={onValueChange} />);

    const input = screen.getByLabelText("Test Input");
    const valueDisplay = screen.getByTestId("value-display");
    const focusStatus = screen.getByTestId("focus-status");

    // Initial state
    expect(valueDisplay).toHaveTextContent("");
    expect(focusStatus).toHaveTextContent("blurred");

    // Type in input
    fireEvent.change(input, { target: { value: "test value" } });
    expect(valueDisplay).toHaveTextContent("test value");
    expect(onValueChange).toHaveBeenCalledWith("test value");

    // Focus input
    fireEvent.focus(input);
    expect(focusStatus).toHaveTextContent("focused");

    // Blur input
    fireEvent.blur(input);
    expect(focusStatus).toHaveTextContent("blurred");
  });

  test("handles multiple inputs independently", () => {
    render(<MultiInputForm />);

    const firstNameInput = screen.getByLabelText("First Name");
    const lastNameInput = screen.getByLabelText("Last Name");
    const emailInput = screen.getByLabelText("Email");

    // Type in first input
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    expect(firstNameInput).toHaveValue("John");
    expect(lastNameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");

    // Type in second input
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    expect(firstNameInput).toHaveValue("John");
    expect(lastNameInput).toHaveValue("Doe");
    expect(emailInput).toHaveValue("");

    // Type in third input
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    expect(firstNameInput).toHaveValue("John");
    expect(lastNameInput).toHaveValue("Doe");
    expect(emailInput).toHaveValue("john@example.com");
  });

  test("handles form validation", () => {
    render(<ValidatedInputForm />);

    const input = screen.getByLabelText("Required Field");
    const errorMessage = screen.queryByTestId("error-message");

    // Initial state - no error
    expect(errorMessage).not.toBeInTheDocument();

    // Type short value - should show error
    fireEvent.change(input, { target: { value: "ab" } });
    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(input).toHaveClass(
      "border-[var(--color-border-default-utility-negative)]",
    );

    // Type longer value - should hide error
    fireEvent.change(input, { target: { value: "abc" } });
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });

  test("handles different input types", () => {
    render(
      <div>
        <Input label="Text Input" type="text" />
        <Input label="Email Input" type="email" />
        <Input label="Password Input" type="password" />
        <Input label="Number Input" type="number" />
      </div>,
    );

    const textInput = screen.getByLabelText("Text Input");
    const emailInput = screen.getByLabelText("Email Input");
    const passwordInput = screen.getByLabelText("Password Input");
    const numberInput = screen.getByLabelText("Number Input");

    expect(textInput).toHaveAttribute("type", "text");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(numberInput).toHaveAttribute("type", "number");
  });

  test("handles different sizes and label variants", () => {
    render(
      <div>
        <Input label="Small Default" size="small" labelVariant="default" />
        <Input
          label="Small Horizontal"
          size="small"
          labelVariant="horizontal"
        />
        <Input label="Medium Default" size="medium" labelVariant="default" />
        <Input
          label="Medium Horizontal"
          size="medium"
          labelVariant="horizontal"
        />
        <Input label="Large Default" size="large" labelVariant="default" />
        <Input
          label="Large Horizontal"
          size="large"
          labelVariant="horizontal"
        />
      </div>,
    );

    // All inputs should be present
    expect(screen.getByLabelText("Small Default")).toBeInTheDocument();
    expect(screen.getByLabelText("Small Horizontal")).toBeInTheDocument();
    expect(screen.getByLabelText("Medium Default")).toBeInTheDocument();
    expect(screen.getByLabelText("Medium Horizontal")).toBeInTheDocument();
    expect(screen.getByLabelText("Large Default")).toBeInTheDocument();
    expect(screen.getByLabelText("Large Horizontal")).toBeInTheDocument();
  });

  test("handles disabled state integration", () => {
    const handleChange = vi.fn();
    render(
      <Input
        label="Disabled Input"
        disabled={true}
        onChange={handleChange}
        onFocus={vi.fn()}
        onBlur={vi.fn()}
      />,
    );

    const input = screen.getByLabelText("Disabled Input");

    // Should be disabled
    expect(input).toBeDisabled();

    // Should not call handlers
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(handleChange).not.toHaveBeenCalled();
  });

  test("handles error state integration", () => {
    render(<Input label="Error Input" error={true} />);
    const input = screen.getByLabelText("Error Input");

    expect(input).toHaveClass(
      "border-[var(--color-border-default-utility-negative)]",
    );
    expect(input).not.toBeDisabled();
  });

  test("handles state transitions", async () => {
    const TestStateTransitions = () => {
      const [state, setState] = useState("default");

      return (
        <div>
          <Input
            label="State Test"
            state={state}
            onFocus={() => setState("focus")}
            onBlur={() => setState("default")}
          />
          <button onClick={() => setState("hover")}>Set Hover</button>
          <button onClick={() => setState("active")}>Set Active</button>
        </div>
      );
    };

    render(<TestStateTransitions />);
    const input = screen.getByLabelText("State Test");
    const hoverButton = screen.getByText("Set Hover");
    const activeButton = screen.getByText("Set Active");

    // Initial state
    expect(input).toHaveClass("border-[var(--color-border-default-tertiary)]");

    // Set hover state
    fireEvent.click(hoverButton);
    expect(input).toHaveClass("border-[var(--color-border-default-tertiary)]");
    expect(input).toHaveClass(
      "shadow-[0_0_0_2px_var(--color-border-default-tertiary)]",
    );

    // Set active state
    fireEvent.click(activeButton);
    expect(input).toHaveClass("border-[var(--color-border-default-tertiary)]");

    // Focus state
    fireEvent.focus(input);
    expect(input).toHaveClass(
      "border-[var(--color-border-default-utility-info)]",
    );
    expect(input).toHaveClass("shadow-[0_0_5px_3px_#3281F8]");
  });

  test("handles keyboard navigation between inputs", () => {
    render(
      <div>
        <Input label="First Input" />
        <Input label="Second Input" />
        <Input label="Third Input" />
      </div>,
    );

    const firstInput = screen.getByLabelText("First Input");
    const secondInput = screen.getByLabelText("Second Input");
    const thirdInput = screen.getByLabelText("Third Input");

    // Focus first input
    firstInput.focus();
    expect(firstInput).toHaveFocus();

    // Tab to second input - simulate actual tab behavior
    fireEvent.keyDown(firstInput, { key: "Tab" });
    // Manually focus the second input since tab navigation doesn't work in jsdom
    secondInput.focus();
    expect(secondInput).toHaveFocus();

    // Tab to third input
    fireEvent.keyDown(secondInput, { key: "Tab" });
    // Manually focus the third input
    thirdInput.focus();
    expect(thirdInput).toHaveFocus();

    // Shift+Tab back to second input
    fireEvent.keyDown(thirdInput, { key: "Tab", shiftKey: true });
    // Manually focus the second input
    secondInput.focus();
    expect(secondInput).toHaveFocus();
  });

  test("handles form submission", () => {
    const handleSubmit = vi.fn();

    render(
      <form onSubmit={handleSubmit}>
        <Input label="Test Input" name="testField" />
        <button type="submit">Submit</button>
      </form>,
    );

    const input = screen.getByLabelText("Test Input");
    const submitButton = screen.getByText("Submit");

    // Type in input
    fireEvent.change(input, { target: { value: "test value" } });

    // Submit form
    fireEvent.click(submitButton);
    expect(handleSubmit).toHaveBeenCalled();
  });

  test("handles ref forwarding", () => {
    const TestRefComponent = () => {
      const inputRef = React.useRef();

      const focusInput = () => {
        inputRef.current?.focus();
      };

      return (
        <div>
          <Input ref={inputRef} label="Ref Test" />
          <button onClick={focusInput}>Focus Input</button>
        </div>
      );
    };

    render(<TestRefComponent />);
    const input = screen.getByLabelText("Ref Test");
    const focusButton = screen.getByText("Focus Input");

    // Click button to focus input via ref
    fireEvent.click(focusButton);
    expect(input).toHaveFocus();
  });

  test("handles dynamic prop changes", () => {
    const TestDynamicProps = () => {
      const [disabled, setDisabled] = useState(false);
      const [error, setError] = useState(false);

      return (
        <div>
          <Input label="Dynamic Input" disabled={disabled} error={error} />
          <button onClick={() => setDisabled(!disabled)}>
            Toggle Disabled
          </button>
          <button onClick={() => setError(!error)}>Toggle Error</button>
        </div>
      );
    };

    render(<TestDynamicProps />);
    const input = screen.getByLabelText("Dynamic Input");
    const toggleDisabledButton = screen.getByText("Toggle Disabled");
    const toggleErrorButton = screen.getByText("Toggle Error");

    // Initial state
    expect(input).not.toBeDisabled();
    expect(input).not.toHaveClass(
      "border-[var(--color-border-default-utility-negative)]",
    );

    // Toggle disabled
    fireEvent.click(toggleDisabledButton);
    expect(input).toBeDisabled();

    // Toggle error - but first disable the disabled state so error can be tested
    fireEvent.click(toggleDisabledButton); // Turn off disabled
    fireEvent.click(toggleErrorButton); // Turn on error
    // The error state applies the border color through the stateStyles.input class
    expect(input).toHaveClass(
      "border-[var(--color-border-default-utility-negative)]",
    );
  });
});
