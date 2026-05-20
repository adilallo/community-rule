import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SectionHeader from "../../app/components/type/SectionHeader";
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

describe("SectionHeader twoColumnsFromMd", () => {
  it("splits rule stack header at md when twoColumnsFromMd is set", () => {
    const { container } = render(
      <SectionHeader
        title="Popular templates"
        subtitle="Start from a proven pattern."
        variant="multi-line"
        ruleStackDesktopTypeScale
        twoColumnsFromMd
      />,
    );

    expect(
      screen.getByRole("heading", { name: /popular templates/i }),
    ).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass("md:flex-row");
  });
});
