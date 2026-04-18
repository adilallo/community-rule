import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import Incrementer from "../../app/components/controls/Incrementer";
import { componentTestSuite } from "../utils/componentTestSuite";
import { renderWithProviders } from "../utils/test-utils";

type IncrementerProps = React.ComponentProps<typeof Incrementer>;

componentTestSuite<IncrementerProps>({
  component: Incrementer,
  name: "Incrementer",
  props: {
    value: 5,
    onChange: () => {},
  } as IncrementerProps,
  requiredProps: ["value", "onChange"],
  optionalProps: {
    step: 1,
  },
  primaryRole: "button",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false,
    disabledState: false,
    errorState: false,
  },
});

describe("Incrementer behavior", () => {
  it("calls onChange with value + step when increment is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(
      <Incrementer value={5} step={2} onChange={onChange} />,
    );

    await user.click(screen.getByRole("button", { name: /increase/i }));
    expect(onChange).toHaveBeenCalledWith(7);
  });

  it("calls onChange with value - step when decrement is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(
      <Incrementer value={5} step={2} onChange={onChange} />,
    );

    await user.click(screen.getByRole("button", { name: /decrease/i }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("disables the decrement button when value is at min", () => {
    renderWithProviders(
      <Incrementer value={0} min={0} max={10} onChange={() => {}} />,
    );

    expect(screen.getByRole("button", { name: /decrease/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /increase/i })).not.toBeDisabled();
  });

  it("disables the increment button when value is at max", () => {
    renderWithProviders(
      <Incrementer value={10} min={0} max={10} onChange={() => {}} />,
    );

    expect(screen.getByRole("button", { name: /increase/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /decrease/i })).not.toBeDisabled();
  });

  it("clamps the next value to min/max bounds", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(
      <Incrementer
        value={9}
        step={5}
        min={0}
        max={10}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /increase/i }));
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it("renders the formatted value when formatValue is provided", () => {
    renderWithProviders(
      <Incrementer
        value={75}
        onChange={() => {}}
        formatValue={(n) => `${n}%`}
      />,
    );

    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("disables both step buttons when disabled is true", () => {
    renderWithProviders(
      <Incrementer value={5} onChange={() => {}} disabled />,
    );

    expect(screen.getByRole("button", { name: /decrease/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /increase/i })).toBeDisabled();
  });

  it("respects custom aria-labels", () => {
    renderWithProviders(
      <Incrementer
        value={5}
        onChange={() => {}}
        decrementAriaLabel="Remove one"
        incrementAriaLabel="Add one"
      />,
    );

    expect(screen.getByRole("button", { name: "Remove one" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add one" })).toBeInTheDocument();
  });
});
