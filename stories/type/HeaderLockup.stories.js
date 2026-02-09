import HeaderLockup from "../../app/components/type/HeaderLockup";

export default {
  title: "Components/Type/HeaderLockup",
  component: HeaderLockup,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#000000" }],
    },
  },
  argTypes: {
    justification: {
      control: { type: "select" },
      options: ["left", "center", "Left", "Center"],
    },
    size: {
      control: { type: "select" },
      options: ["L", "M", "l", "m"],
    },
  },
};

export const Default = {
  args: {
    title: "How CommunityRule helps groups like yours",
    description:
      "This flow will give you recommendations to improve your community and help you put together a proposal for your group to consider.",
    justification: "left",
    size: "L",
  },
};

export const SizeM = {
  args: {
    title: "What is your community called?",
    description: "This will be the name of your community",
    justification: "left",
    size: "M",
  },
};

export const CenterJustified = {
  args: {
    title: "How should conflicts be resolved?",
    description:
      "You can also combine or add new approaches to the list",
    justification: "center",
    size: "L",
  },
};

export const WithoutDescription = {
  args: {
    title: "Simple header without description",
    justification: "left",
    size: "L",
  },
};
