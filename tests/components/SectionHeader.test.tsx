import React from "react";
import SectionHeader from "../../app/components/SectionHeader";
import { componentTestSuite } from "../utils/componentTestSuite";

type SectionHeaderProps = React.ComponentProps<typeof SectionHeader>;

componentTestSuite<SectionHeaderProps>({
  component: SectionHeader,
  name: "SectionHeader",
  props: {
    title: "Title",
    subtitle: "Subtitle",
  } as SectionHeaderProps,
  requiredProps: ["title", "subtitle"],
  primaryRole: "heading",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false,
    disabledState: false,
    errorState: false,
  },
});

