import React from "react";
import Checkbox from "../../app/components/Checkbox";
import { componentTestSuite } from "../utils/componentTestSuite";

type CheckboxProps = React.ComponentProps<typeof Checkbox>;

componentTestSuite<CheckboxProps>({
  component: Checkbox,
  name: "Checkbox",
  props: {
    label: "Test checkbox",
  } as CheckboxProps,
  requiredProps: ["label"],
  optionalProps: {
    value: "test",
  },
  primaryRole: "checkbox",
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
