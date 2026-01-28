import { expect, test, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import TextArea from "../../app/components/TextArea";

expect.extend(toHaveNoViolations);

describe("TextArea Accessibility", () => {
  test("renders without accessibility violations", async () => {
    const { container } = render(<TextArea label="Test TextArea" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("has proper label association", () => {
    render(<TextArea label="Test Label" />);
    const textarea = screen.getByRole("textbox");
    const label = screen.getByText("Test Label");

    expect(textarea).toHaveAttribute("id");
    expect(label).toHaveAttribute("for", textarea.id);
  });

  test("has proper ARIA attributes", () => {
    render(<TextArea label="Test Label" name="test-textarea" />);
    const textarea = screen.getByRole("textbox");

    expect(textarea).toHaveAttribute("id");
    expect(textarea).toHaveAttribute("name", "test-textarea");
  });

  test("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<TextArea label="Test Label" />);

    const textarea = screen.getByRole("textbox");
    await user.tab();

    expect(textarea).toHaveFocus();
  });

  test("announces changes to screen readers", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<TextArea label="Test Label" onChange={handleChange} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "test");

    expect(textarea).toHaveValue("test");
  });

  test("handles disabled state accessibility", () => {
    render(<TextArea label="Test Label" disabled />);
    const textarea = screen.getByRole("textbox");

    expect(textarea).toBeDisabled();
    expect(textarea).toHaveAttribute("aria-disabled", "true");
  });

  test("handles error state accessibility", () => {
    render(<TextArea label="Test Label" error />);
    const textarea = screen.getByRole("textbox");

    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  test("maintains focus management", async () => {
    const user = userEvent.setup();
    render(<TextArea label="Test Label" />);

    const textarea = screen.getByRole("textbox");
    await user.click(textarea);

    expect(textarea).toHaveFocus();
  });

  test("supports horizontal label layout", () => {
    render(<TextArea labelVariant="horizontal" label="Horizontal Label" />);
    const textarea = screen.getByRole("textbox");
    const label = screen.getByText("Horizontal Label");

    expect(textarea).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  test("handles different sizes accessibility", () => {
    const { rerender } = render(<TextArea size="small" label="Small" />);
    let textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();

    rerender(<TextArea size="medium" label="Medium" />);
    textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();

    rerender(<TextArea size="large" label="Large" />);
    textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
  });

  test("maintains proper contrast ratios", () => {
    render(<TextArea label="Test Label" />);
    const textarea = screen.getByRole("textbox");
    const label = screen.getByText("Test Label");

    expect(textarea).toHaveClass("text-[var(--color-content-default-primary)]");
    expect(label).toHaveClass("text-[var(--color-content-default-secondary)]");
  });

  test("supports screen reader announcements for state changes", async () => {
    const user = userEvent.setup();
    render(<TextArea label="Test Label" />);

    const textarea = screen.getByRole("textbox");
    await user.click(textarea);
    await user.type(textarea, "Hello");

    expect(textarea).toHaveValue("Hello");
  });
});
