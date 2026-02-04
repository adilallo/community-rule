import React from "react";
import TextInput from "../../app/components/TextInput";
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
