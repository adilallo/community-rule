import React from "react";
import Toggle from "../../app/components/controls/Toggle";
import { componentTestSuite } from "../utils/componentTestSuite";

type ToggleProps = React.ComponentProps<typeof Toggle>;

componentTestSuite<ToggleProps>({
  component: Toggle,
  name: "Toggle",
  props: {
    label: "Notifications",
    checked: false,
  } as ToggleProps,
  requiredProps: [],
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
