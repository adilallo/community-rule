import HeaderTab from "../../app/components/navigation/HeaderTab";
import Logo from "../../app/components/icons/Logo";

export default {
  title: "Components/Navigation/HeaderTab",
  component: HeaderTab,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A header tab container with decorative Union images and responsive behavior. Used to wrap content in the header with consistent styling and responsive breakpoint transitions.",
      },
    },
  },
  argTypes: {
    stretch: {
      control: { type: "boolean" },
      description: "Whether the tab should stretch to fill available space",
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
    stretch: false,
  },
  render: (args) => (
    <HeaderTab {...args}>
      <Logo size="homeHeaderMd" />
    </HeaderTab>
  ),
};
