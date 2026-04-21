import CommunityRuleDocument from "../../app/components/sections/CommunityRuleDocument";

const sampleSections = [
  {
    categoryName: "Decision making",
    entries: [
      {
        title: "How proposals pass",
        body: "Important decisions require unanimous agreement. Proposals pass only if no serious objections remain.",
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
  title: "Components/Sections/CommunityRuleDocument",
  component: CommunityRuleDocument,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    sections: {
      control: false,
      description: "Document sections, each with a categoryName and entries.",
    },
    useCardStyle: {
      control: "boolean",
      description: "When true, wraps the document in a white card with a teal bar",
    },
  },
};

export const Default = {
  args: {
    sections: sampleSections,
    useCardStyle: false,
  },
};

export const CardStyle = {
  args: {
    sections: sampleSections,
    useCardStyle: true,
  },
};
