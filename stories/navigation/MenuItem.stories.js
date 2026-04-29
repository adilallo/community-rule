import MenuItem from "../../app/components/navigation/MenuItem";

export default {
  title: "Components/Navigation/MenuItem",
  component: MenuItem,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A navigation menu item with multiple variants, sizes, and states. Renders as a link or button (or disabled span) with accessibility support. Use Tab to test focus indicators.",
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
        <MenuItem {...args} mode="default">
          Default
        </MenuItem>
        <MenuItem {...args} mode="inverse">
          Inverse
        </MenuItem>
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
        <MenuItem {...args} size="X Small">
          X Small
        </MenuItem>
        <MenuItem {...args} size="Small">
          Small
        </MenuItem>
        <MenuItem {...args} size="Medium">
          Medium
        </MenuItem>
        <MenuItem {...args} size="Large">
          Large
        </MenuItem>
        <MenuItem {...args} size="X Large">
          X Large
        </MenuItem>
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
        <MenuItem {...args}>Normal</MenuItem>
        <MenuItem {...args} disabled>
          Disabled
        </MenuItem>
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
          <MenuItem size="X Small" mode="default">
            X Small
          </MenuItem>
          <MenuItem size="Large" mode="default">
            Large
          </MenuItem>
          <MenuItem size="X Large" mode="default">
            X Large
          </MenuItem>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Inverse Mode</h3>
        <div className="space-x-4">
          <MenuItem mode="inverse" size="X Small">
            X Small
          </MenuItem>
          <MenuItem mode="inverse" size="Large">
            Large
          </MenuItem>
          <MenuItem mode="inverse" size="X Large">
            X Large
          </MenuItem>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Disabled States</h3>
        <div className="space-x-4">
          <MenuItem size="Large" mode="default" disabled>
            Default Disabled
          </MenuItem>
          <MenuItem mode="inverse" size="Large" disabled>
            Inverse Disabled
          </MenuItem>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Complete overview of all menu item modes, sizes, and states.",
      },
    },
  },
};
