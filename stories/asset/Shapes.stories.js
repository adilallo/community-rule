import Shapes from "../../app/components/asset/Shapes";

export default {
  title: "Components/Asset/Shapes",
  component: Shapes,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["yellow", "purple", "green", "orange"],
    },
  },
};

export const Yellow = { args: { variant: "yellow" } };
export const Purple = { args: { variant: "purple" } };
export const Green = { args: { variant: "green" } };
export const Orange = { args: { variant: "orange" } };
