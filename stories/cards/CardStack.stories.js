import CardStack from "../../app/components/cards/CardStack";

const SAMPLE_CARDS = [
  {
    id: "1",
    label: "Label",
    supportText:
      "Collaborative work to reach a resolution that all parties can agree upon.",
    recommended: true,
  },
  {
    id: "2",
    label: "Label",
    supportText:
      "Structured sessions where parties collaboratively resolve disputes.",
    recommended: true,
  },
  {
    id: "3",
    label: "Label",
    supportText: "Members vote to resolve a dispute democratically.",
    recommended: true,
  },
  {
    id: "4",
    label: "Label",
    supportText: "Arbitrators are chosen specifically for a particular case.",
    recommended: true,
  },
  {
    id: "5",
    label: "Label",
    supportText:
      "Encouraging direct, respectful dialogue between those involved.",
    recommended: true,
  },
  {
    id: "6",
    label: "Label",
    supportText: "Invite-only",
    recommended: true,
  },
];

export default {
  title: "Components/Cards/CardStack",
  component: CardStack,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Card stack for the create flow: compact grid or expanded list with toggle. Uses Selection tiles; toggle visible only when hasMore is true.",
      },
    },
  },
  argTypes: {
    expanded: {
      control: { type: "boolean" },
      description: "Expanded (list) vs compact (grid) mode",
    },
    hasMore: {
      control: { type: "boolean" },
      description: "Whether to show the See all / Show less toggle",
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    cards: SAMPLE_CARDS,
    hasMore: true,
    title: "How should this community communicate with each-other?",
    description:
      "You can select multiple methods for different needs or add your own",
  },
  parameters: {
    docs: {
      description: {
        story: "Compact grid with sample cards and See all toggle.",
      },
    },
  },
};

export const Expanded = {
  args: {
    cards: SAMPLE_CARDS,
    expanded: true,
    hasMore: true,
    title:
      "What method should this community use to communicate with eachother?",
    description:
      "You can select multiple methods for different needs or add your own",
  },
  parameters: {
    docs: {
      description: {
        story: "Expanded list layout with vertical cards and Show less toggle.",
      },
    },
  },
};

export const WithSelection = {
  args: {
    cards: SAMPLE_CARDS,
    selectedId: "2",
    hasMore: true,
    title: "How should this community communicate with each-other?",
    description:
      "You can select multiple methods for different needs or add your own",
  },
  parameters: {
    docs: {
      description: {
        story: "Second card is selected; click cards to change selection.",
      },
    },
  },
};

export const NoToggle = {
  args: {
    cards: SAMPLE_CARDS.slice(0, 3),
    hasMore: false,
    title: "How should this community communicate with each-other?",
    description:
      "You can select multiple methods for different needs or add your own",
  },
  parameters: {
    docs: {
      description: {
        story: "When hasMore is false, the See all toggle is hidden.",
      },
    },
  },
};
