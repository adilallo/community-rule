import CommunityRule from "../../app/components/type/CommunityRule";

const sampleSections = [
  {
    categoryName: "Decision making",
    entries: [
      {
        title: "How proposals pass",
        body: "Short opener line.\n\nImportant decisions require unanimous agreement. Proposals pass only if no serious objections remain.",
      },
      {
        title: "Blocks",
        body: "Anyone with a serious objection may block consensus and require further discussion.",
      },
    ],
  },
  {
    categoryName: "Membership",
    entries: [
      {
        title: "Joining",
        body: "New members are welcomed by consensus of existing members.",
      },
    ],
  },
];

export default {
  title: "Components/Type/CommunityRule",
  component: CommunityRule,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    sections: {
      control: false,
      description: "Rule sections, each with a categoryName and entries.",
    },
    useCardStyle: {
      control: "boolean",
      description: "When true, wraps the rule body in a white card with a teal bar",
    },
  },
};

export const Default = {
  args: {
    sections: sampleSections,
    useCardStyle: false,
  },
};

export const WithLabeledBlocks = {
  args: {
    sections: [
      {
        categoryName: "Membership",
        entries: [
          {
            title: "Consensus or vote-based approval",
            body: "",
            blocks: [
              {
                label: "Eligibility & philosophy",
                body: "Access to critical resources is restricted to safeguard the project.",
              },
              {
                label: "Joining process",
                body: "Volunteers who have completed two full distributions can submit a request.",
              },
            ],
          },
        ],
      },
    ],
    useCardStyle: false,
  },
};

export const CardStyle = {
  args: {
    sections: sampleSections,
    useCardStyle: true,
  },
};
