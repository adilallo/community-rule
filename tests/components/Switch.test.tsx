import React from "react";
import Switch from "../../app/components/controls/Switch";
import { componentTestSuite } from "../utils/componentTestSuite";

type SwitchProps = React.ComponentProps<typeof Switch>;

componentTestSuite<SwitchProps>({
  component: Switch,
  name: "Switch",
  props: {
    text: "Test Switch",
  } as SwitchProps,
  requiredProps: [],
  optionalProps: {
    state: "focus",
  },
  primaryRole: "switch",
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
