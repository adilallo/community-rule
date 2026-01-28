import { expect, test, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TextArea from "../../app/components/TextArea";

describe("TextArea", () => {
  test("renders with default props", () => {
    render(<TextArea />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
  });

  test("renders with label", () => {
    render(<TextArea label="Test Label" />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
  });

  test("renders with placeholder", () => {
    render(<TextArea placeholder="Enter text..." />);
    expect(screen.getByPlaceholderText("Enter text...")).toBeInTheDocument();
  });

  test("renders with value", () => {
    render(<TextArea value="Test value" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("Test value");
  });

  test("renders with different sizes", () => {
    const { rerender } = render(<TextArea size="small" label="Small" />);
    let textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("h-[60px]");

    rerender(<TextArea size="medium" label="Medium" />);
    textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("h-[100px]");

    rerender(<TextArea size="large" label="Large" />);
    textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("h-[150px]");
  });

  test("renders with horizontal label variant", () => {
    render(<TextArea labelVariant="horizontal" label="Horizontal Label" />);
    const container = screen.getByRole("textbox").closest("div").parentElement;
    expect(container).toHaveClass("flex", "items-center", "gap-[12px]");
  });

  test("renders with default label variant", () => {
    render(<TextArea labelVariant="default" label="Default Label" />);
    const container = screen.getByRole("textbox").closest("div").parentElement;
    expect(container).toHaveClass("flex", "flex-col");
  });

  test("applies disabled state", () => {
    render(<TextArea disabled />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeDisabled();
  });

  test("applies error state", () => {
    render(<TextArea error />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass(
      "border-[var(--color-border-default-utility-negative)]",
    );
  });

  test("applies different states", () => {
    const { rerender } = render(<TextArea state="active" />);
    let textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass(
      "border-[var(--color-border-default-tertiary)]",
    );

    rerender(<TextArea state="hover" />);
    textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass(
      "shadow-[0_0_0_2px_var(--color-border-default-tertiary)]",
    );

    rerender(<TextArea state="focus" />);
    textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass(
      "border-[var(--color-border-default-utility-info)]",
      "shadow-[0_0_5px_3px_#3281F8]",
    );
  });

  test("calls onChange when text changes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<TextArea onChange={handleChange} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "test");

    expect(handleChange).toHaveBeenCalledTimes(4);
  });

  test("calls onFocus when focused", async () => {
    const user = userEvent.setup();
    const handleFocus = vi.fn();
    render(<TextArea onFocus={handleFocus} />);

    const textarea = screen.getByRole("textbox");
    await user.click(textarea);

    expect(handleFocus).toHaveBeenCalled();
  });

  test("calls onBlur when blurred", async () => {
    const user = userEvent.setup();
    const handleBlur = vi.fn();
    render(<TextArea onBlur={handleBlur} />);

    const textarea = screen.getByRole("textbox");
    await user.click(textarea);
    await user.tab();

    expect(handleBlur).toHaveBeenCalled();
  });

  test("does not call onChange when disabled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<TextArea disabled onChange={handleChange} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "test");

    expect(handleChange).not.toHaveBeenCalled();
  });

  test("applies custom className", () => {
    render(<TextArea className="custom-class" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("custom-class");
  });

  test("forwards ref", () => {
    const ref = vi.fn();
    render(<TextArea ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  test("applies correct height for small horizontal label", () => {
    render(
      <TextArea
        size="small"
        labelVariant="horizontal"
        label="Small Horizontal"
      />,
    );
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("h-[60px]");
  });

  test("applies correct height for medium horizontal label", () => {
    render(
      <TextArea
        size="medium"
        labelVariant="horizontal"
        label="Medium Horizontal"
      />,
    );
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("h-[110px]");
  });

  test("applies correct border radius for different sizes", () => {
    const { rerender } = render(<TextArea size="small" />);
    let textarea = screen.getByRole("textbox");
    expect(textarea).toHaveStyle({
      borderRadius: "var(--measures-radius-xsmall)",
    });

    rerender(<TextArea size="medium" />);
    textarea = screen.getByRole("textbox");
    expect(textarea).toHaveStyle({
      borderRadius: "var(--measures-radius-xsmall)",
    });

    rerender(<TextArea size="large" />);
    textarea = screen.getByRole("textbox");
    expect(textarea).toHaveStyle({
      borderRadius: "var(--measures-radius-small)",
    });
  });

  test("applies correct text color", () => {
    render(<TextArea />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("text-[var(--color-content-default-primary)]");
  });

  test("applies correct label color", () => {
    render(<TextArea label="Test Label" />);
    const label = screen.getByText("Test Label");
    expect(label).toHaveClass("text-[var(--color-content-default-secondary)]");
  });
});
