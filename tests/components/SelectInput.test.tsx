import React from "react";
import SelectInput from "../../app/components/controls/SelectInput";
import { componentTestSuite } from "../utils/componentTestSuite";

type SelectInputProps = React.ComponentProps<typeof SelectInput>;

componentTestSuite<SelectInputProps>({
  component: SelectInput,
  name: "SelectInput",
  props: {
    label: "Test Select Input",
    placeholder: "Select an option",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ],
  } as SelectInputProps,
  requiredProps: ["options"],
  optionalProps: {},
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
