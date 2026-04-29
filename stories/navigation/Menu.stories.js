import Menu from "../../app/components/navigation/Menu";
import MenuItem from "../../app/components/navigation/MenuItem";

export default {
  title: "Components/Navigation/Menu",
  component: Menu,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Navigation Menu (`role=\"menubar\"`) groups MenuItem children. Consistent spacing and layout for horizontal nav clusters with multiple size variants.",
      },
    },
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["X Small", "Small", "Medium", "Large", "X Large"],
      description: "The size of the menu and its children",
    },
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    size: "Small",
  },
  render: (args) => (
    <Menu {...args}>
      <MenuItem size="Large">Home</MenuItem>
      <MenuItem size="Large">About</MenuItem>
      <MenuItem size="Large">Contact</MenuItem>
    </Menu>
  ),
};

export const Sizes = {
  args: {},
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">X Small Size</h3>
        <Menu size="X Small">
          <MenuItem size="X Small">Home</MenuItem>
          <MenuItem size="X Small">About</MenuItem>
          <MenuItem size="X Small">Contact</MenuItem>
        </Menu>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Small Size</h3>
        <Menu size="Small">
          <MenuItem size="Large">Home</MenuItem>
          <MenuItem size="Large">About</MenuItem>
          <MenuItem size="Large">Contact</MenuItem>
        </Menu>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Medium Size</h3>
        <Menu size="Medium">
          <MenuItem size="Large">Home</MenuItem>
          <MenuItem size="Large">About</MenuItem>
          <MenuItem size="Large">Contact</MenuItem>
        </Menu>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Large Size</h3>
        <Menu size="Large">
          <MenuItem size="Large">Home</MenuItem>
          <MenuItem size="Large">About</MenuItem>
          <MenuItem size="Large">Contact</MenuItem>
        </Menu>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">X Large Size</h3>
        <Menu size="X Large">
          <MenuItem size="X Large">Home</MenuItem>
          <MenuItem size="X Large">About</MenuItem>
          <MenuItem size="X Large">Contact</MenuItem>
        </Menu>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Different size variants of the menu with consistent spacing and layout.",
      },
    },
  },
};
