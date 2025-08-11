import MenuBarItem from "../app/components/MenuBarItem";

export default {
  title: "Components/MenuBarItem",
  component: MenuBarItem,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A navigation menu item component with multiple variants, sizes, and states. Can render as a link or disabled span with full accessibility support. Includes focus states with keyboard navigation - use Tab key to test focus indicators.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "home"],
      description: "The visual style variant of the menu item",
    },
    size: {
      control: { type: "select" },
      options: [
        "xsmall",
        "xsmallUseCases",
        "homeMd",
        "homeUseCases",
        "large",
        "largeUseCases",
        "homeXlarge",
        "xlarge",
      ],
      description: "The size of the menu item",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Whether the menu item is disabled",
    },
    href: {
      control: { type: "text" },
      description: "The link destination",
    },
    onClick: { action: "clicked" },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    children: "Menu Item",
    size: "large",
  },
};

export const Variants = {
  args: {
    children: "Menu Item",
    size: "large",
  },
  render: (args) => (
    <div className="space-y-4">
      <div className="space-x-4">
        <MenuBarItem {...args} variant="default">
          Default
        </MenuBarItem>
        <MenuBarItem {...args} variant="home">
          Home
        </MenuBarItem>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different visual variants of the menu item component.",
      },
    },
  },
};

export const Sizes = {
  args: {
    children: "Menu Item",
    variant: "default",
  },
  render: (args) => (
    <div className="space-y-4">
      <div className="space-x-4">
        <MenuBarItem {...args} size="xsmall">
          XSmall
        </MenuBarItem>
        <MenuBarItem {...args} size="large">
          Large
        </MenuBarItem>
        <MenuBarItem {...args} size="xlarge">
          XLarge
        </MenuBarItem>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different sizes available for the menu item component.",
      },
    },
  },
};

export const States = {
  args: {
    children: "Menu Item",
    size: "large",
    variant: "default",
  },
  render: (args) => (
    <div className="space-y-4">
      <div className="space-x-4">
        <MenuBarItem {...args}>Normal</MenuBarItem>
        <MenuBarItem {...args} disabled>
          Disabled
        </MenuBarItem>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different states of the menu item component.",
      },
    },
  },
};

export const AllVariants = {
  args: {},
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">Default Variant</h3>
        <div className="space-x-4">
          <MenuBarItem size="xsmall">XSmall</MenuBarItem>
          <MenuBarItem size="large">Large</MenuBarItem>
          <MenuBarItem size="xlarge">XLarge</MenuBarItem>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Home Variant</h3>
        <div className="space-x-4">
          <MenuBarItem variant="home" size="xsmall">
            XSmall
          </MenuBarItem>
          <MenuBarItem variant="home" size="large">
            Large
          </MenuBarItem>
          <MenuBarItem variant="home" size="xlarge">
            XLarge
          </MenuBarItem>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Disabled States</h3>
        <div className="space-x-4">
          <MenuBarItem size="large" disabled>
            Default Disabled
          </MenuBarItem>
          <MenuBarItem variant="home" size="large" disabled>
            Home Disabled
          </MenuBarItem>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Complete overview of all menu item variants, sizes, and states.",
      },
    },
  },
};
