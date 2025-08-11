import { fn } from "storybook/test";
import Button from "../app/components/Button";

export default {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "secondary"],
    },
    size: {
      control: { type: "select" },
      options: ["xsmall", "small", "large", "xlarge"],
    },
    disabled: {
      control: { type: "boolean" },
    },
    onClick: { action: "clicked" },
  },
  args: {
    children: "Button",
    variant: "default",
    size: "small",
    disabled: false,
  },
};

export const Default = {
  args: {
    children: "Default Button",
  },
};

export const Secondary = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

export const Large = {
  args: {
    size: "large",
    children: "Large Button",
  },
};

export const Small = {
  args: {
    size: "small",
    children: "Small Button",
  },
};

export const XSmall = {
  args: {
    size: "xsmall",
    children: "XSmall Button",
  },
};

export const XLarge = {
  args: {
    size: "xlarge",
    children: "XLarge Button",
  },
};

export const Disabled = {
  args: {
    disabled: true,
    children: "Disabled Button",
  },
};

export const AsLink = {
  args: {
    href: "#",
    children: "Button as Link",
  },
};
