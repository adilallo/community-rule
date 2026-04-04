import NumberedList from "../../app/components/type/NumberedList";

export default {
  title: "Components/Type/NumberedList",
  component: NumberedList,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#000000" }],
    },
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["M", "S", "m", "s"],
    },
  },
};

const defaultItems = [
  {
    title: "Tell us about your organization",
    description:
      "Start by providing your group's name, description, and profile image.",
  },
  {
    title: "Define your group's CommunityRule.",
    description:
      "Outline decision-making processes, conflict resolution methods, and membership practices. Get recommendations.",
  },
  {
    title: "Share and evolve over time",
    description:
      "Review and refine your community framework before putting it into action and adapting it over time.",
  },
];

export const Default = {
  args: {
    items: defaultItems,
    size: "M",
  },
};

export const SizeS = {
  args: {
    items: defaultItems,
    size: "S",
  },
};

export const SingleItem = {
  args: {
    items: [
      {
        title: "First step",
        description: "This is a single item example.",
      },
    ],
    size: "M",
  },
};
