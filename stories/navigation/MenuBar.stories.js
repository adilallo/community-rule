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
      options: ["xsmall", "default", "medium", "large"],
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
    size: "default",
  },
  render: (args) => (
    <MenuBar {...args}>
      <MenuBarItem size="large">Home</MenuBarItem>
      <MenuBarItem size="large">About</MenuBarItem>
      <MenuBarItem size="large">Contact</MenuBarItem>
    </MenuBar>
  ),
};

export const Sizes = {
  args: {},
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">XSmall Size</h3>
        <MenuBar size="xsmall">
          <MenuBarItem size="xsmall">Home</MenuBarItem>
          <MenuBarItem size="xsmall">About</MenuBarItem>
          <MenuBarItem size="xsmall">Contact</MenuBarItem>
        </MenuBar>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Default Size</h3>
        <MenuBar size="default">
          <MenuBarItem size="large">Home</MenuBarItem>
          <MenuBarItem size="large">About</MenuBarItem>
          <MenuBarItem size="large">Contact</MenuBarItem>
        </MenuBar>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Medium Size</h3>
        <MenuBar size="medium">
          <MenuBarItem size="large">Home</MenuBarItem>
          <MenuBarItem size="large">About</MenuBarItem>
          <MenuBarItem size="large">Contact</MenuBarItem>
        </MenuBar>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Large Size</h3>
        <MenuBar size="large">
          <MenuBarItem size="large">Home</MenuBarItem>
          <MenuBarItem size="large">About</MenuBarItem>
          <MenuBarItem size="large">Contact</MenuBarItem>
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
