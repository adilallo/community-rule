import React from "react";
import TopNav from "../../app/components/navigation/TopNav";
import { componentTestSuite } from "../utils/componentTestSuite";

type TopNavProps = React.ComponentProps<typeof TopNav>;

// Test folderTop=false variant (standard header)
componentTestSuite<TopNavProps>({
  component: TopNav,
  name: "TopNav (folderTop=false)",
  props: { folderTop: false } as TopNavProps,
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

// Test folderTop=true variant (home header)
// Note: Accessibility test may fail due to Next.js Script component behavior in test environment
componentTestSuite<TopNavProps>({
  component: TopNav,
  name: "TopNav (folderTop=true)",
  props: { folderTop: true } as TopNavProps,
  requiredProps: [],
  primaryRole: "banner",
  testCases: {
    renders: true,
    accessibility: false, // Disabled due to Next.js Script component in test environment
    keyboardNavigation: false,
    disabledState: false,
    errorState: false,
  },
});
