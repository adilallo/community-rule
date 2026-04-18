import { describe } from "vitest";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";
import CommunityRuleDocument from "../../app/components/sections/CommunityRuleDocument";

type Props = React.ComponentProps<typeof CommunityRuleDocument>;

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
  component: CommunityRuleDocument,
  name: "CommunityRuleDocument",
  props: {
    sections: sampleSections,
  } as Props,
  requiredProps: ["sections"],
  testCases: {
    renders: true,
    accessibility: true,
  },
};

describe("CommunityRuleDocument", () => {
  componentTestSuite<Props>(config);
});
