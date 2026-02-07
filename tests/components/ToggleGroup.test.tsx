import React from "react";
import ToggleGroup from "../../app/components/controls/ToggleGroup";
import { componentTestSuite } from "../utils/componentTestSuite";

type ToggleGroupProps = React.ComponentProps<typeof ToggleGroup>;

componentTestSuite<ToggleGroupProps>({
  component: ToggleGroup,
  name: "ToggleGroup",
  props: {
    children: "Option",
  } as ToggleGroupProps,
  requiredProps: [],
  primaryRole: "button",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: true,
    disabledState: false,
    errorState: false,
  },
});
