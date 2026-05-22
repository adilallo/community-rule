import SelectOption from "../../app/components/controls/SelectOption";

export default {
  title: "Components/Controls/SelectOption",
  component: SelectOption,
  parameters: { layout: "centered" },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
  },
};

export const Default = {
  args: {
    children: "Consensus",
    size: "medium",
  },
};

export const Selected = {
  args: {
    children: "Liquid democracy",
    selected: true,
    size: "medium",
  },
};

export const Disabled = {
  args: {
    children: "Unavailable option",
    disabled: true,
    size: "medium",
  },
};
