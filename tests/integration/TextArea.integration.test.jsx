import React from "react";
import { expect, test, describe, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TextArea from "../../app/components/TextArea";

// Test form component for integration testing
const TestForm = () => {
  const [formData, setFormData] = React.useState({
    textarea1: "",
    textarea2: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextArea
        label="First TextArea"
        name="textarea1"
        value={formData.textarea1}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, textarea1: e.target.value }))
        }
        placeholder="Enter first text..."
      />
      <TextArea
        label="Second TextArea"
        name="textarea2"
        value={formData.textarea2}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, textarea2: e.target.value }))
        }
        placeholder="Enter second text..."
      />
      <button type="submit">Submit</button>
    </form>
  );
};

// Dynamic TextArea component for prop changes testing
const DynamicTextArea = ({ size, labelVariant, state, disabled, error }) => {
  const [value, setValue] = React.useState("");

  return (
    <TextArea
      label="Dynamic TextArea"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      size={size}
      labelVariant={labelVariant}
      state={state}
      disabled={disabled}
      error={error}
      placeholder="Enter text..."
    />
  );
};

describe("TextArea Integration Tests", () => {
  test("handles form submission with multiple textareas", async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const firstTextarea = screen.getByPlaceholderText("Enter first text...");
    const secondTextarea = screen.getByPlaceholderText("Enter second text...");
    const submitButton = screen.getByRole("button", { name: /Submit/ });

    await user.type(firstTextarea, "First content");
    await user.type(secondTextarea, "Second content");

    expect(firstTextarea).toHaveValue("First content");
    expect(secondTextarea).toHaveValue("Second content");

    await user.click(submitButton);
    // Form submission should not cause errors
  });

  test("handles keyboard navigation between textareas", async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const firstTextarea = screen.getByPlaceholderText("Enter first text...");
    const secondTextarea = screen.getByPlaceholderText("Enter second text...");

    await user.click(firstTextarea);
    expect(firstTextarea).toHaveFocus();

    await user.tab();
    expect(secondTextarea).toHaveFocus();
  });

  test("handles dynamic prop changes", () => {
    const { rerender } = render(<DynamicTextArea size="small" />);
    let textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("h-[60px]");

    rerender(<DynamicTextArea size="medium" />);
    textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("h-[100px]");

    rerender(<DynamicTextArea size="large" />);
    textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("h-[150px]");
  });

  test("handles state changes", () => {
    const { rerender } = render(<DynamicTextArea state="default" />);
    let textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass(
      "border-[var(--color-border-default-tertiary)]"
    );

    rerender(<DynamicTextArea state="hover" />);
    textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass(
      "shadow-[0_0_0_2px_var(--color-border-default-tertiary)]"
    );

    rerender(<DynamicTextArea state="focus" />);
    textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass(
      "border-[var(--color-border-default-utility-info)]",
      "shadow-[0_0_5px_3px_#3281F8]"
    );
  });

  test("handles disabled state changes", () => {
    const { rerender } = render(<DynamicTextArea disabled={false} />);
    let textarea = screen.getByRole("textbox");
    expect(textarea).not.toBeDisabled();

    rerender(<DynamicTextArea disabled={true} />);
    textarea = screen.getByRole("textbox");
    expect(textarea).toBeDisabled();
  });

  test("handles error state changes", () => {
    const { rerender } = render(<DynamicTextArea error={false} />);
    let textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass(
      "border-[var(--color-border-default-tertiary)]"
    );

    rerender(<DynamicTextArea error={true} />);
    textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass(
      "border-[var(--color-border-default-utility-negative)]"
    );
  });

  test("handles label variant changes", () => {
    const { rerender } = render(<DynamicTextArea labelVariant="default" />);
    let container = screen.getByRole("textbox").closest("div").parentElement;
    expect(container).toHaveClass("flex", "flex-col");

    rerender(<DynamicTextArea labelVariant="horizontal" />);
    container = screen.getByRole("textbox").closest("div").parentElement;
    expect(container).toHaveClass("flex", "items-center", "gap-[12px]");
  });

  test("handles text input and changes", async () => {
    const user = userEvent.setup();
    render(<DynamicTextArea />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Hello World");

    expect(textarea).toHaveValue("Hello World");
  });

  test("handles focus and blur events", async () => {
    const user = userEvent.setup();
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    render(
      <TextArea
        label="Test TextArea"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );

    const textarea = screen.getByRole("textbox");

    await user.click(textarea);
    expect(handleFocus).toHaveBeenCalled();

    await user.tab();
    expect(handleBlur).toHaveBeenCalled();
  });

  test("handles multiple textareas with different configurations", () => {
    render(
      <div>
        <TextArea
          size="small"
          label="Small TextArea"
          placeholder="Small placeholder"
        />
        <TextArea
          size="medium"
          labelVariant="horizontal"
          label="Medium Horizontal"
          placeholder="Medium placeholder"
        />
        <TextArea
          size="large"
          label="Large TextArea"
          placeholder="Large placeholder"
        />
      </div>
    );

    expect(
      screen.getByPlaceholderText("Small placeholder")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Medium placeholder")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Large placeholder")
    ).toBeInTheDocument();
  });

  test("handles form validation with error states", () => {
    render(
      <div>
        <TextArea label="Valid TextArea" placeholder="Valid input" />
        <TextArea label="Invalid TextArea" placeholder="Invalid input" error />
        <TextArea
          label="Disabled TextArea"
          placeholder="Disabled input"
          disabled
        />
      </div>
    );

    const validTextarea = screen.getByPlaceholderText("Valid input");
    const invalidTextarea = screen.getByPlaceholderText("Invalid input");
    const disabledTextarea = screen.getByPlaceholderText("Disabled input");

    expect(validTextarea).toHaveClass(
      "border-[var(--color-border-default-tertiary)]"
    );
    expect(invalidTextarea).toHaveClass(
      "border-[var(--color-border-default-utility-negative)]"
    );
    expect(disabledTextarea).toBeDisabled();
  });

  test("handles performance with multiple re-renders", () => {
    const { rerender } = render(<DynamicTextArea />);

    // Simulate multiple re-renders
    for (let i = 0; i < 10; i++) {
      rerender(<DynamicTextArea size={i % 2 === 0 ? "small" : "large"} />);
    }

    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
  });

  test("handles accessibility with screen readers", async () => {
    const user = userEvent.setup();
    render(<TextArea label="Accessible TextArea" />);

    const textarea = screen.getByRole("textbox");
    const label = screen.getByText("Accessible TextArea");

    expect(textarea).toHaveAttribute("id");
    expect(label).toHaveAttribute("for", textarea.id);

    await user.click(textarea);
    expect(textarea).toHaveFocus();
  });
});
