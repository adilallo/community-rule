import Stat from "../../app/components/cards/Stat";

export default {
  title: "Components/Cards/Stat",
  component: Stat,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    value: { control: "text" },
    label: { control: "text" },
    asOf: { control: "text" },
    shapeVariant: {
      control: { type: "select" },
      options: [1, 2, 3, 4],
    },
  },
};

export const Default = {
  args: {
    value: "420M+",
    label: "open source projects",
    asOf: "as of June 30, 2024",
    shapeVariant: 1,
  },
};
