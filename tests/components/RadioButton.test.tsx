import React from "react";
import RadioButton from "../../app/components/controls/RadioButton";
import { componentTestSuite } from "../utils/componentTestSuite";

type RadioButtonProps = React.ComponentProps<typeof RadioButton>;

componentTestSuite<RadioButtonProps>({
  component: RadioButton,
  name: "RadioButton",
  props: {
    label: "Option A",
    checked: false,
  } as RadioButtonProps,
  requiredProps: [],
  optionalProps: {
    mode: "inverse",
  },
  primaryRole: "radio",
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
