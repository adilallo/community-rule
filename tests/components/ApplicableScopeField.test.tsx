import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import ApplicableScopeField from "../../app/(app)/create/components/ApplicableScopeField";
import { componentTestSuite } from "../utils/componentTestSuite";
import { renderWithProviders } from "../utils/test-utils";

type ApplicableScopeFieldProps = React.ComponentProps<
  typeof ApplicableScopeField
>;

componentTestSuite<ApplicableScopeFieldProps>({
  component: ApplicableScopeField,
  name: "ApplicableScopeField",
  props: {
    label: "Applicable Scope",
    addLabel: "Add Applicable Scope",
    scopes: ["Finance", "Operations"],
    selectedScopes: ["Finance"],
    onToggleScope: () => {},
    onAddScope: () => {},
  } as ApplicableScopeFieldProps,
  requiredProps: ["label", "addLabel"],
  optionalProps: {
    inputPlaceholder: "Enter scope",
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

describe("ApplicableScopeField behavior", () => {
  const baseProps: ApplicableScopeFieldProps = {
    label: "Applicable Scope",
    addLabel: "Add Applicable Scope",
    scopes: ["Finance", "Operations", "Product"],
    selectedScopes: ["Finance"],
    onToggleScope: () => {},
    onAddScope: () => {},
  };

  it("renders each scope as a chip", () => {
    renderWithProviders(<ApplicableScopeField {...baseProps} />);

    expect(screen.getByRole("button", { name: /Deselect Finance/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Select Operations/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Select Product/i })).toBeInTheDocument();
  });

  it("calls onToggleScope when a chip is clicked", async () => {
    const user = userEvent.setup();
    const onToggleScope = vi.fn();
    renderWithProviders(
      <ApplicableScopeField {...baseProps} onToggleScope={onToggleScope} />,
    );

    await user.click(screen.getByRole("button", { name: /Select Operations/i }));
    expect(onToggleScope).toHaveBeenCalledWith("Operations");
  });

  it("reveals the inline input when '+ Add' is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ApplicableScopeField {...baseProps} />);

    await user.click(screen.getByRole("button", { name: /Add Applicable Scope/i }));
    expect(
      screen.getByRole("textbox", { name: /Add Applicable Scope/i }),
    ).toBeInTheDocument();
  });

  it("calls onAddScope with trimmed value on Enter", async () => {
    const user = userEvent.setup();
    const onAddScope = vi.fn();
    renderWithProviders(
      <ApplicableScopeField {...baseProps} onAddScope={onAddScope} />,
    );

    await user.click(screen.getByRole("button", { name: /Add Applicable Scope/i }));
    const input = screen.getByRole("textbox", { name: /Add Applicable Scope/i });
    await user.type(input, "  People  {Enter}");

    expect(onAddScope).toHaveBeenCalledWith("People");
  });

  it("does not call onAddScope for duplicates already in scopes", async () => {
    const user = userEvent.setup();
    const onAddScope = vi.fn();
    renderWithProviders(
      <ApplicableScopeField {...baseProps} onAddScope={onAddScope} />,
    );

    await user.click(screen.getByRole("button", { name: /Add Applicable Scope/i }));
    const input = screen.getByRole("textbox", { name: /Add Applicable Scope/i });
    await user.type(input, "Finance{Enter}");

    expect(onAddScope).not.toHaveBeenCalled();
  });

  it("dismisses the inline input on Escape without calling onAddScope", async () => {
    const user = userEvent.setup();
    const onAddScope = vi.fn();
    renderWithProviders(
      <ApplicableScopeField {...baseProps} onAddScope={onAddScope} />,
    );

    await user.click(screen.getByRole("button", { name: /Add Applicable Scope/i }));
    const input = screen.getByRole("textbox", { name: /Add Applicable Scope/i });
    await user.type(input, "People{Escape}");

    expect(onAddScope).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("textbox", { name: /Add Applicable Scope/i }),
    ).not.toBeInTheDocument();
  });
});
