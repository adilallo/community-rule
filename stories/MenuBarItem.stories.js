import MenuBarItem from "../app/components/MenuBarItem";

export default {
  title: "Components/MenuBarItem",
  component: MenuBarItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "home"],
    },
    size: {
      control: { type: "select" },
      options: [
        "default",
        "xsmall",
        "xsmallUseCases",
        "homeMd",
        "homeUseCases",
        "large",
        "largeUseCases",
        "homeXlarge",
        "xlarge",
      ],
    },
    disabled: {
      control: { type: "boolean" },
    },
    href: {
      control: { type: "text" },
    },
  },
  args: {
    children: "Menu Item",
    variant: "default",
    size: "default",
    disabled: false,
    href: "#",
  },
};

export const Default = {
  args: {},
};

export const Home = {
  args: {
    variant: "home",
    children: "Home Menu Item",
  },
};

export const Small = {
  args: {
    size: "xsmall",
    children: "Small Menu Item",
  },
};

export const Large = {
  args: {
    size: "large",
    children: "Large Menu Item",
  },
};

export const XLarge = {
  args: {
    size: "xlarge",
    children: "XLarge Menu Item",
  },
};

export const Disabled = {
  args: {
    disabled: true,
    children: "Disabled Menu Item",
  },
};

export const MultipleItems = {
  render: () => (
    <div className="flex gap-2">
      <MenuBarItem href="#home">Home</MenuBarItem>
      <MenuBarItem href="#about">About</MenuBarItem>
      <MenuBarItem href="#contact">Contact</MenuBarItem>
      <MenuBarItem href="#help" disabled>
        Help
      </MenuBarItem>
    </div>
  ),
};
