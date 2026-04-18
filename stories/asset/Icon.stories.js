import { Icon } from "../../app/components/asset";

export default {
  title: "Components/Asset/Icon",
  component: Icon,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    name: {
      control: "select",
      options: ["exclamation"],
      description: "Name of the icon to render",
    },
    size: {
      control: { type: "number", min: 12, max: 96, step: 4 },
      description: "Width and height in pixels",
    },
    className: {
      control: "text",
      description: "Optional className applied to the SVG",
    },
    "aria-hidden": {
      control: "boolean",
      description: "Whether to mark the icon as aria-hidden",
    },
  },
};

export const Default = {
  args: {
    name: "exclamation",
    size: 24,
  },
};

export const Large = {
  args: {
    name: "exclamation",
    size: 48,
  },
};
