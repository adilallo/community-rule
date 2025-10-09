import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import RadioGroup from "../../app/components/RadioGroup";

describe("RadioGroup", () => {
  const defaultOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  it("renders with default props", () => {
    render(<RadioGroup options={defaultOptions} />);

    const radioGroup = screen.getByRole("radiogroup");
    expect(radioGroup).toBeInTheDocument();

    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons).toHaveLength(3);
  });

  it("renders all options", () => {
    render(<RadioGroup options={defaultOptions} />);

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("shows selected option", () => {
    render(<RadioGroup options={defaultOptions} value="option2" />);

    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons[0]).toHaveAttribute("aria-checked", "false");
    expect(radioButtons[1]).toHaveAttribute("aria-checked", "true");
    expect(radioButtons[2]).toHaveAttribute("aria-checked", "false");
  });

  it("calls onChange when option is selected", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioGroup
        options={defaultOptions}
        value="option1"
        onChange={handleChange}
      />
    );

    const option2 = screen.getByText("Option 2").closest("label");
    await user.click(option2);

    expect(handleChange).toHaveBeenCalledWith({ value: "option2" });
  });

  it("updates selection when different option is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioGroup
        options={defaultOptions}
        value="option1"
        onChange={handleChange}
      />
    );

    // Click option 3
    const option3 = screen.getByText("Option 3").closest("label");
    await user.click(option3);

    expect(handleChange).toHaveBeenCalledWith({ value: "option3" });
  });

  it("handles keyboard navigation", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioGroup
        options={defaultOptions}
        value="option1"
        onChange={handleChange}
      />
    );

    const radioButtons = screen.getAllByRole("radio");
    radioButtons[1].focus();
    await user.keyboard(" ");

    expect(handleChange).toHaveBeenCalledWith({ value: "option2" });
  });

  it("handles Enter key activation", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioGroup
        options={defaultOptions}
        value="option1"
        onChange={handleChange}
      />
    );

    const radioButtons = screen.getAllByRole("radio");
    await user.click(radioButtons[2]);
    await user.keyboard("{Enter}");

    expect(handleChange).toHaveBeenCalledWith({ value: "option3" });
  });

  it("applies standard mode to all radio buttons", () => {
    render(<RadioGroup options={defaultOptions} mode="standard" />);

    const radioButtons = screen.getAllByRole("radio");
    radioButtons.forEach((button) => {
      expect(button).toHaveClass(
        "outline-[var(--color-border-default-tertiary)]"
      );
    });
  });

  it("applies inverse mode to all radio buttons", () => {
    render(<RadioGroup options={defaultOptions} mode="inverse" />);

    const radioButtons = screen.getAllByRole("radio");
    radioButtons.forEach((button) => {
      expect(button).toHaveClass(
        "outline-[var(--color-border-inverse-primary)]"
      );
    });
  });

  it("applies state to all radio buttons", () => {
    render(<RadioGroup options={defaultOptions} state="focus" />);

    const radioButtons = screen.getAllByRole("radio");
    radioButtons.forEach((button) => {
      expect(button).toHaveClass("focus:outline");
    });
  });

  it("generates unique group name when not provided", () => {
    render(<RadioGroup options={defaultOptions} />);
    render(<RadioGroup options={defaultOptions} />);

    const hiddenInputs = screen.getAllByRole("radio", { hidden: true });
    const names = hiddenInputs.map((input) => input.getAttribute("name"));

    // Should have unique names
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBeGreaterThan(1);
  });

  it("uses provided name for all radio buttons", () => {
    render(<RadioGroup options={defaultOptions} name="test-group" />);

    const hiddenInputs = screen.getAllByDisplayValue("option1");
    hiddenInputs.forEach((input) => {
      expect(input).toHaveAttribute("name", "test-group");
    });
  });

  it("applies custom className to container", () => {
    render(<RadioGroup options={defaultOptions} className="custom-group" />);

    const radioGroup = screen.getByRole("radiogroup");
    expect(radioGroup).toHaveClass("custom-group");
  });

  it("passes aria-label to radiogroup", () => {
    render(
      <RadioGroup options={defaultOptions} aria-label="Test Radio Group" />
    );

    const radioGroup = screen.getByRole("radiogroup");
    expect(radioGroup).toHaveAttribute("aria-label", "Test Radio Group");
  });

  it("handles empty options array", () => {
    render(<RadioGroup options={[]} />);

    const radioGroup = screen.getByRole("radiogroup");
    expect(radioGroup).toBeInTheDocument();

    const radioButtons = screen.queryAllByRole("radio");
    expect(radioButtons).toHaveLength(0);
  });

  it("handles options with ariaLabel", () => {
    const optionsWithAria = [
      { value: "option1", label: "Option 1", ariaLabel: "First Option" },
      { value: "option2", label: "Option 2", ariaLabel: "Second Option" },
    ];

    render(<RadioGroup options={optionsWithAria} />);

    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons[0]).toHaveAttribute("aria-label", "First Option");
    expect(radioButtons[1]).toHaveAttribute("aria-label", "Second Option");
  });

  it("maintains selection state correctly", () => {
    const { rerender } = render(
      <RadioGroup options={defaultOptions} value="option1" />
    );

    let radioButtons = screen.getAllByRole("radio");
    expect(radioButtons[0]).toHaveAttribute("aria-checked", "true");

    rerender(<RadioGroup options={defaultOptions} value="option3" />);

    radioButtons = screen.getAllByRole("radio");
    expect(radioButtons[0]).toHaveAttribute("aria-checked", "false");
    expect(radioButtons[2]).toHaveAttribute("aria-checked", "true");
  });

  it("does not call onChange when clicking already selected option", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioGroup
        options={defaultOptions}
        value="option2"
        onChange={handleChange}
      />
    );

    const option2 = screen.getByText("Option 2").closest("label");
    await user.click(option2);

    // Should not call onChange since it's already selected
    expect(handleChange).not.toHaveBeenCalled();
  });
});
