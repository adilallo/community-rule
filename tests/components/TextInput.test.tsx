import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import TextInput from "../../app/components/controls/TextInput";
import { componentTestSuite } from "../utils/componentTestSuite";

type TextInputProps = React.ComponentProps<typeof TextInput>;

componentTestSuite<TextInputProps>({
  component: TextInput,
  name: "TextInput",
  props: {
    label: "Test text input",
  } as TextInputProps,
  requiredProps: ["label"],
  optionalProps: {
    placeholder: "Enter value",
    inputSize: "medium",
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

describe("TextInput (size tests)", () => {
  it("renders with medium size by default", () => {
    const { container } = render(
      <TextInput label="Test" inputSize="medium" />,
    );
    const input = container.querySelector("input");
    expect(input).toHaveClass("h-[40px]");
  });

  it("renders with small size", () => {
    const { container } = render(<TextInput label="Test" inputSize="small" />);
    const input = container.querySelector("input");
    expect(input).toHaveClass("h-[32px]");
  });

  it("accepts PascalCase size prop", () => {
    const { container } = render(<TextInput label="Test" inputSize="Small" />);
    const input = container.querySelector("input");
    expect(input).toHaveClass("h-[32px]");
  });
});
