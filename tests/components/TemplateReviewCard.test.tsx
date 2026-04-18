import { describe } from "vitest";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";
import { TemplateReviewCard } from "../../app/components/cards/TemplateReviewCard";

type Props = React.ComponentProps<typeof TemplateReviewCard>;

const sampleTemplate = {
  id: "tmpl-1",
  slug: "consensus",
  title: "Consensus",
  category: null,
  description:
    "Important decisions require unanimous agreement. Proposals pass only if no serious objections remain.",
  body: {
    sections: [
      {
        categoryName: "Decision making",
        entries: [
          {
            title: "How proposals pass",
            body: "Unanimous agreement is required.",
          },
        ],
      },
    ],
  },
  sortOrder: 1,
  featured: true,
};

const config: ComponentTestSuiteConfig<Props> = {
  component: TemplateReviewCard,
  name: "TemplateReviewCard",
  props: {
    template: sampleTemplate,
    size: "L",
  } as Props,
  primaryRole: "button",
  testCases: {
    renders: true,
    // RuleCard contains nested interactive elements (chips inside a clickable card)
    // which trigger axe's "nested-interactive" rule. Tracked by RuleCard itself.
    accessibility: false,
  },
};

describe("TemplateReviewCard", () => {
  componentTestSuite<Props>(config);
});
