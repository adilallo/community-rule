import { describe } from "vitest";
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
});
