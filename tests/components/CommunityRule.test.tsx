import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";
import CommunityRule from "../../app/components/type/CommunityRule";

type Props = React.ComponentProps<typeof CommunityRule>;

const sampleSections = [
  {
    categoryName: "Decision making",
    entries: [
      {
        title: "How proposals pass",
        body: "Important decisions require unanimous agreement.",
      },
    ],
  },
];

const config: ComponentTestSuiteConfig<Props> = {
  component: CommunityRule,
  name: "CommunityRule",
  props: {
    sections: sampleSections,
  } as Props,
  requiredProps: ["sections"],
  testCases: {
    renders: true,
    accessibility: true,
  },
};

describe("CommunityRule", () => {
  componentTestSuite<Props>(config);

  it("uses cardAccentColor for the card left border when useCardStyle is true", () => {
    const { container } = render(
      <CommunityRule
        sections={sampleSections}
        useCardStyle
        cardAccentColor="var(--color-surface-invert-brand-lavender)"
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.boxShadow).toBe(
      "inset 4px 0 0 0 var(--color-surface-invert-brand-lavender)",
    );
    expect(screen.getByText("How proposals pass")).toBeInTheDocument();
  });
});
