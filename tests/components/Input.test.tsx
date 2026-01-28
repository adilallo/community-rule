import React from "react";
import Input from "../../app/components/Input";
import { componentTestSuite } from "../utils/componentTestSuite";

type InputProps = React.ComponentProps<typeof Input>;

componentTestSuite<InputProps>({
  component: Input,
  name: "Input",
  props: {
    label: "Test input",
  } as InputProps,
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

