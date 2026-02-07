import React from "react";
import Alert from "../../app/components/modals/Alert";
import { componentTestSuite } from "../utils/componentTestSuite";

type AlertProps = React.ComponentProps<typeof Alert>;

componentTestSuite<AlertProps>({
  component: Alert,
  name: "Alert",
  props: {
    title: "Alert title",
    description: "Alert description",
  } as AlertProps,
  requiredProps: ["title"],
  optionalProps: {
    description: "Optional description",
    status: "positive",
    type: "banner",
  },
  primaryRole: "alert",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false, // Alert is not directly keyboard navigable
    disabledState: false,
    errorState: false,
  },
});
