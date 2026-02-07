import React from "react";
import RadioGroup from "../../app/components/controls/RadioGroup";
import { componentTestSuite } from "../utils/componentTestSuite";

type RadioGroupProps = React.ComponentProps<typeof RadioGroup>;

componentTestSuite<RadioGroupProps>({
  component: RadioGroup,
  name: "RadioGroup",
  props: {
    name: "example",
    value: "a",
    options: [
      { value: "a", label: "Option A" },
      { value: "b", label: "Option B" },
    ],
  } as RadioGroupProps,
  requiredProps: [],
  primaryRole: "radiogroup",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false,
    disabledState: false,
    errorState: false,
  },
});
