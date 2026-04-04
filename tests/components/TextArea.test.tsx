import React from "react";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import TextArea from "../../app/components/controls/TextArea";
import { componentTestSuite } from "../utils/componentTestSuite";
import { renderWithProviders } from "../utils/test-utils";

type TextAreaProps = React.ComponentProps<typeof TextArea>;

componentTestSuite<TextAreaProps>({
  component: TextArea,
  name: "TextArea",
  props: {
    label: "Description",
    value: "",
  } as TextAreaProps,
  requiredProps: ["label"],
  optionalProps: {
    placeholder: "Enter description",
  },
  primaryRole: "textbox",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: true,
    disabledState: true,
    errorState: true,
  },
  states: {
    disabledProps: { disabled: true },
    errorProps: { error: true },
  },
});

describe("TextArea appearance", () => {
  it("renders with appearance embedded and applies borderless styling", () => {
    renderWithProviders(
      <TextArea label="Notes" value="Some text" appearance="embedded" />,
    );
    const textarea = screen.getByRole("textbox", { name: /notes/i });
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass("border-0");
  });
});
