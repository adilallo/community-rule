import MenuBar from "../../app/components/navigation/MenuBar";
import MenuBarItem from "../../app/components/navigation/MenuBarItem";

export default {
  title: "Components/Navigation/MenuBar",
  component: MenuBar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A navigation menu bar container that groups MenuBarItem components together. Provides consistent spacing and layout for navigation menus with multiple size variants.",
      },
    },
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["X Small", "Small", "Medium", "Large", "X Large"],
      description: "The size of the menu bar and its children",
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
    <MenuBar {...args}>
      <MenuBarItem size="Large">Home</MenuBarItem>
      <MenuBarItem size="Large">About</MenuBarItem>
      <MenuBarItem size="Large">Contact</MenuBarItem>
    </MenuBar>
  ),
};

export const Sizes = {
  args: {},
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">X Small Size</h3>
        <MenuBar size="X Small">
          <MenuBarItem size="X Small">Home</MenuBarItem>
          <MenuBarItem size="X Small">About</MenuBarItem>
          <MenuBarItem size="X Small">Contact</MenuBarItem>
        </MenuBar>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Small Size</h3>
        <MenuBar size="Small">
          <MenuBarItem size="Large">Home</MenuBarItem>
          <MenuBarItem size="Large">About</MenuBarItem>
          <MenuBarItem size="Large">Contact</MenuBarItem>
        </MenuBar>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Medium Size</h3>
        <MenuBar size="Medium">
          <MenuBarItem size="Large">Home</MenuBarItem>
          <MenuBarItem size="Large">About</MenuBarItem>
          <MenuBarItem size="Large">Contact</MenuBarItem>
        </MenuBar>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Large Size</h3>
        <MenuBar size="Large">
          <MenuBarItem size="Large">Home</MenuBarItem>
          <MenuBarItem size="Large">About</MenuBarItem>
          <MenuBarItem size="Large">Contact</MenuBarItem>
        </MenuBar>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">X Large Size</h3>
        <MenuBar size="X Large">
          <MenuBarItem size="X Large">Home</MenuBarItem>
          <MenuBarItem size="X Large">About</MenuBarItem>
          <MenuBarItem size="X Large">Contact</MenuBarItem>
        </MenuBar>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Different size variants of the menu bar with consistent spacing and layout.",
      },
    },
  },
};
