import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import InlineTextButton from "../../app/components/buttons/InlineTextButton";
import { componentTestSuite } from "../utils/componentTestSuite";
import { renderWithProviders } from "../utils/test-utils";

type InlineTextButtonProps = React.ComponentProps<typeof InlineTextButton>;

componentTestSuite<InlineTextButtonProps>({
  component: InlineTextButton,
  name: "InlineTextButton",
  props: {
    children: "Expand",
  } as InlineTextButtonProps,
  requiredProps: ["children"],
  optionalProps: {
    ariaLabel: "Expand description",
  },
  primaryRole: "button",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: true,
    disabledState: true,
    errorState: false,
  },
  states: {
    disabledProps: { disabled: true },
  },
});

describe("InlineTextButton behavior", () => {
  it("fires onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProviders(
      <InlineTextButton onClick={onClick}>Expand</InlineTextButton>,
    );

    await user.click(screen.getByRole("button", { name: /expand/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProviders(
      <InlineTextButton onClick={onClick} disabled>
        Expand
      </InlineTextButton>,
    );

    await user.click(screen.getByRole("button", { name: /expand/i }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("uses ariaLabel when provided", () => {
    renderWithProviders(
      <InlineTextButton ariaLabel="Expand description">Expand</InlineTextButton>,
    );

    expect(
      screen.getByRole("button", { name: "Expand description" }),
    ).toBeInTheDocument();
  });

  it("defaults to type='button' to avoid accidental form submits", () => {
    renderWithProviders(<InlineTextButton>Expand</InlineTextButton>);
    expect(screen.getByRole("button", { name: /expand/i })).toHaveAttribute(
      "type",
      "button",
    );
  });
});
