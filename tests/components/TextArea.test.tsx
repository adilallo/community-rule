import React from "react";
import TextArea from "../../app/components/controls/TextArea";
import { componentTestSuite } from "../utils/componentTestSuite";

type TextAreaProps = React.ComponentProps<typeof TextArea>;

componentTestSuite<TextAreaProps>({
  component: TextArea,
  name: "TextArea",
  props: {
    label: "Description",
    value: "",
  } as TextAreaProps,
  requiredProps: ["label"],
  optionalProps: {
    placeholder: "Enter description",
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
