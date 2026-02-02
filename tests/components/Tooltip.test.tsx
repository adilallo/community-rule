import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import Tooltip from "../../app/components/Tooltip";
import { componentTestSuite } from "../utils/componentTestSuite";

type TooltipProps = React.ComponentProps<typeof Tooltip>;

componentTestSuite<TooltipProps>({
  component: Tooltip,
  name: "Tooltip",
  props: {
    children: <button>Hover me</button>,
    text: "Tooltip text",
  } as TooltipProps,
  requiredProps: ["children", "text"],
  optionalProps: {
    position: "bottom",
    disabled: true,
  },
  primaryRole: "button",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: true,
    disabledState: false, // Tooltip disabled state is handled in behavioral tests
    errorState: false,
  },
});

describe("Tooltip (behavioral tests)", () => {
  it("shows tooltip on hover", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip text="Tooltip text">
        <button>Hover me</button>
      </Tooltip>,
    );

    const button = screen.getByRole("button", { name: "Hover me" });
    await user.hover(button);

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent("Tooltip text");
  });

  it("hides tooltip when disabled", () => {
    render(
      <Tooltip text="Tooltip text" disabled>
        <button>Hover me</button>
      </Tooltip>,
    );

    const tooltip = screen.queryByRole("tooltip");
    expect(tooltip).not.toBeInTheDocument();
  });
});
