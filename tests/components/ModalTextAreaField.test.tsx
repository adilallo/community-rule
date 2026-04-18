import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import ModalTextAreaField from "../../app/create/components/ModalTextAreaField";
import { componentTestSuite } from "../utils/componentTestSuite";
import { renderWithProviders } from "../utils/test-utils";

type ModalTextAreaFieldProps = React.ComponentProps<typeof ModalTextAreaField>;

componentTestSuite<ModalTextAreaFieldProps>({
  component: ModalTextAreaField,
  name: "ModalTextAreaField",
  props: {
    label: "Description",
    value: "",
    onChange: () => {},
  } as ModalTextAreaFieldProps,
  requiredProps: ["label"],
  optionalProps: {
    placeholder: "What does this cover?",
  },
  primaryRole: "textbox",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false,
    disabledState: true,
    errorState: false,
  },
  states: {
    disabledProps: { disabled: true },
  },
});

describe("ModalTextAreaField behavior", () => {
  it("renders the label and a textbox wired together", () => {
    renderWithProviders(
      <ModalTextAreaField
        label="Core principle"
        value=""
        onChange={() => {}}
      />,
    );

    expect(screen.getByText("Core principle")).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /Core principle/i }),
    ).toBeInTheDocument();
  });

  it("calls onChange with the new value string (not the event)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(
      <ModalTextAreaField label="Notes" value="" onChange={onChange} />,
    );

    const textbox = screen.getByRole("textbox", { name: /Notes/i });
    await user.type(textbox, "A");

    expect(onChange).toHaveBeenCalledWith("A");
  });

  it("forwards placeholder and current value", () => {
    renderWithProviders(
      <ModalTextAreaField
        label="Notes"
        value="hello"
        onChange={() => {}}
        placeholder="Type here"
      />,
    );

    const textbox = screen.getByRole("textbox", { name: /Notes/i });
    expect(textbox).toHaveValue("hello");
    expect(textbox).toHaveAttribute("placeholder", "Type here");
  });

  it("disables the textarea when disabled is true", () => {
    renderWithProviders(
      <ModalTextAreaField label="Notes" value="" onChange={() => {}} disabled />,
    );

    expect(screen.getByRole("textbox", { name: /Notes/i })).toBeDisabled();
  });
});
