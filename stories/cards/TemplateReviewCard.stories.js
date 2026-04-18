import { TemplateReviewCard } from "../../app/components/cards/TemplateReviewCard";

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
          { title: "How proposals pass", body: "Unanimous agreement is required." },
          { title: "Blocks", body: "Anyone with a serious objection may block." },
        ],
      },
      {
        categoryName: "Membership",
        entries: [
          { title: "Joining", body: "New members are welcomed by consensus." },
        ],
      },
    ],
  },
  sortOrder: 1,
  featured: true,
};

export default {
  title: "Components/Cards/TemplateReviewCard",
  component: TemplateReviewCard,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    template: {
      control: false,
      description: "RuleTemplateDto used to populate the card",
    },
    size: {
      control: "select",
      options: ["XS", "S", "M", "L"],
      description: "RuleCard size variant",
    },
    ruleCardClassName: {
      control: "text",
      description: "Class names merged onto the inner RuleCard",
    },
  },
};

export const Default = {
  args: {
    template: sampleTemplate,
    size: "L",
  },
};

export const Medium = {
  args: {
    template: sampleTemplate,
    size: "M",
  },
};
