import NavigationItem from "../../app/components/navigation/NavigationItem";

export default {
  title: "Components/Navigation/NavigationItem",
  component: NavigationItem,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    href: {
      control: "text",
      description: "Anchor href",
    },
    variant: {
      control: "select",
      options: ["default"],
      description: "Visual variant",
    },
    size: {
      control: "select",
      options: ["default", "xsmall"],
      description: "Size variant",
    },
    disabled: {
      control: "boolean",
      description: "Disable interaction (renders as span)",
    },
    isActive: {
      control: "boolean",
      description: "Mark the item as currently active",
    },
    children: {
      control: "text",
      description: "Item label",
    },
  },
};

export const Default = {
  args: {
    children: "Templates",
    href: "#",
    variant: "default",
    size: "default",
  },
};

export const Active = {
  args: {
    children: "Templates",
    href: "#",
    variant: "default",
    size: "default",
    isActive: true,
  },
};

export const Disabled = {
  args: {
    children: "Templates",
    href: "#",
    variant: "default",
    size: "default",
    disabled: true,
  },
};

export const XSmall = {
  args: {
    children: "Templates",
    href: "#",
    variant: "default",
    size: "xsmall",
  },
};
