import React from "react";
import Header from "../../app/components/navigation/Header";
import { componentTestSuite } from "../utils/componentTestSuite";

type HeaderProps = React.ComponentProps<typeof Header>;

componentTestSuite<HeaderProps>({
  component: Header,
  name: "Header",
  // Header has no props; it reads from routing and config.
  props: {} as HeaderProps,
  requiredProps: [],
  primaryRole: "banner",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false,
    disabledState: false,
    errorState: false,
  },
});
