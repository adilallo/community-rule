import Chip from "../../app/components/controls/Chip";

export default {
  title: "Components/Controls/Chip",
  component: Chip,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    label: {
      control: "text",
      description: "Text displayed inside the chip",
    },
    state: {
      control: "select",
      options: ["unselected", "selected", "disabled", "custom"],
      description: "Visual state of the chip",
    },
    palette: {
      control: "select",
      options: ["default", "inverse"],
      description: "Color palette of the chip",
    },
    size: {
      control: "select",
      options: ["s", "m"],
      description: "Size of the chip",
    },
    disabled: {
      control: "boolean",
      description: "Override the disabled behaviour independently of state",
    },
    onClick: { action: "clicked" },
    onRemove: { action: "removed" },
    onCheck: { action: "checked" },
    onClose: { action: "closed" },
  },
};

export const Default = {
  args: {
    label: "Worker cooperative",
    state: "unselected",
    palette: "default",
    size: "m",
  },
};

export const Selected = {
  args: {
    label: "Worker cooperative",
    state: "selected",
    palette: "default",
    size: "m",
  },
};

export const Disabled = {
  args: {
    label: "Worker cooperative",
    state: "disabled",
    palette: "default",
    size: "m",
  },
};

export const Inverse = {
  args: {
    label: "Worker cooperative",
    state: "selected",
    palette: "inverse",
    size: "m",
  },
};

export const Small = {
  args: {
    label: "Worker cooperative",
    state: "unselected",
    palette: "default",
    size: "s",
  },
};
