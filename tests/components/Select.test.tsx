import React from "react";
import Select from "../../app/components/Select";
import { componentTestSuite } from "../utils/componentTestSuite";

type SelectProps = React.ComponentProps<typeof Select>;

componentTestSuite<SelectProps>({
  component: Select,
  name: "Select",
  props: {
    label: "Test Select",
    placeholder: "Select an option",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ],
  } as SelectProps,
  requiredProps: ["options"],
  optionalProps: {
    size: "medium",
  },
  primaryRole: "button",
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
