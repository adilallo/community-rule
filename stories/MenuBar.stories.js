import MenuBar from "../app/components/MenuBar";
import MenuBarItem from "../app/components/MenuBarItem";

export default {
  title: "Components/MenuBar",
  component: MenuBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["xsmall", "default", "medium", "large"],
    },
  },
  args: {
    size: "default",
  },
};

export const Default = {
  render: (args) => (
    <MenuBar {...args}>
      <MenuBarItem href="#home">Home</MenuBarItem>
      <MenuBarItem href="#about">About</MenuBarItem>
      <MenuBarItem href="#contact">Contact</MenuBarItem>
    </MenuBar>
  ),
};

export const Small = {
  render: (args) => (
    <MenuBar size="xsmall">
      <MenuBarItem href="#home" size="xsmall">
        Home
      </MenuBarItem>
      <MenuBarItem href="#about" size="xsmall">
        About
      </MenuBarItem>
      <MenuBarItem href="#contact" size="xsmall">
        Contact
      </MenuBarItem>
    </MenuBar>
  ),
};

export const Large = {
  render: (args) => (
    <MenuBar size="large">
      <MenuBarItem href="#home" size="large">
        Home
      </MenuBarItem>
      <MenuBarItem href="#about" size="large">
        About
      </MenuBarItem>
      <MenuBarItem href="#contact" size="large">
        Contact
      </MenuBarItem>
    </MenuBar>
  ),
};

export const WithDisabledItem = {
  render: (args) => (
    <MenuBar {...args}>
      <MenuBarItem href="#home">Home</MenuBarItem>
      <MenuBarItem href="#about">About</MenuBarItem>
      <MenuBarItem href="#contact" disabled>
        Contact
      </MenuBarItem>
    </MenuBar>
  ),
};
