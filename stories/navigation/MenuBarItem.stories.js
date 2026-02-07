import MenuBarItem from "../../app/components/navigation/MenuBarItem";

export default {
  title: "Components/Navigation/MenuBarItem",
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
    mode: {
      control: { type: "select" },
      options: ["default", "inverse"],
      description: "The visual style mode of the menu item",
    },
    size: {
      control: { type: "select" },
      options: ["X Small", "Small", "Medium", "Large", "X Large"],
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
    size: "Large",
  },
};

export const Modes = {
  args: {
    children: "Menu Item",
    size: "Large",
  },
  render: (args) => (
    <div className="space-y-4">
      <div className="space-x-4">
        <MenuBarItem {...args} mode="default">
          Default
        </MenuBarItem>
        <MenuBarItem {...args} mode="inverse">
          Inverse
        </MenuBarItem>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different visual modes of the menu item component.",
      },
    },
  },
};

export const Sizes = {
  args: {
    children: "Menu Item",
    mode: "default",
  },
  render: (args) => (
    <div className="space-y-4">
      <div className="space-x-4">
        <MenuBarItem {...args} size="X Small">
          X Small
        </MenuBarItem>
        <MenuBarItem {...args} size="Small">
          Small
        </MenuBarItem>
        <MenuBarItem {...args} size="Medium">
          Medium
        </MenuBarItem>
        <MenuBarItem {...args} size="Large">
          Large
        </MenuBarItem>
        <MenuBarItem {...args} size="X Large">
          X Large
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
    size: "Large",
    mode: "default",
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

export const AllModes = {
  args: {},
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">Default Mode</h3>
        <div className="space-x-4">
          <MenuBarItem size="X Small" mode="default">X Small</MenuBarItem>
          <MenuBarItem size="Large" mode="default">Large</MenuBarItem>
          <MenuBarItem size="X Large" mode="default">X Large</MenuBarItem>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Inverse Mode</h3>
        <div className="space-x-4">
          <MenuBarItem mode="inverse" size="X Small">
            X Small
          </MenuBarItem>
          <MenuBarItem mode="inverse" size="Large">
            Large
          </MenuBarItem>
          <MenuBarItem mode="inverse" size="X Large">
            X Large
          </MenuBarItem>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Disabled States</h3>
        <div className="space-x-4">
          <MenuBarItem size="Large" mode="default" disabled>
            Default Disabled
          </MenuBarItem>
          <MenuBarItem mode="inverse" size="Large" disabled>
            Inverse Disabled
          </MenuBarItem>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Complete overview of all menu item modes, sizes, and states.",
      },
    },
  },
};
