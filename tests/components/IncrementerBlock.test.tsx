import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import IncrementerBlock from "../../app/components/controls/IncrementerBlock";
import { componentTestSuite } from "../utils/componentTestSuite";
import { renderWithProviders } from "../utils/test-utils";

type IncrementerBlockProps = React.ComponentProps<typeof IncrementerBlock>;

componentTestSuite<IncrementerBlockProps>({
  component: IncrementerBlock,
  name: "IncrementerBlock",
  props: {
    label: "Consensus level",
    value: 50,
    onChange: () => {},
  } as IncrementerBlockProps,
  requiredProps: ["label", "value", "onChange"],
  optionalProps: {
    helperText: "Optional",
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

describe("IncrementerBlock composition", () => {
  it("renders the label above the incrementer", () => {
    renderWithProviders(
      <IncrementerBlock
        label="Consensus level"
        value={75}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText("Consensus level")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /increase/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /decrease/i })).toBeInTheDocument();
  });

  it("forwards incrementer props (step, min, max) to the inner control", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(
      <IncrementerBlock
        label="Quorum"
        value={50}
        step={10}
        min={0}
        max={100}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /increase/i }));
    expect(onChange).toHaveBeenCalledWith(60);
  });

  it("disables both step buttons when disabled is true", () => {
    renderWithProviders(
      <IncrementerBlock
        label="Consensus level"
        value={50}
        onChange={() => {}}
        disabled
      />,
    );

    expect(screen.getByRole("button", { name: /decrease/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /increase/i })).toBeDisabled();
  });

  it("renders helper text when provided", () => {
    renderWithProviders(
      <IncrementerBlock
        label="Quorum"
        helperText="Required for proposal"
        value={50}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText("Required for proposal")).toBeInTheDocument();
  });
});
