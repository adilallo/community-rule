import LanguageSwitcher from "../../app/components/localization/LanguageSwitcher";

export default {
  title: "Components/Localization/LanguageSwitcher",
  component: LanguageSwitcher,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    className: {
      control: "text",
      description: "Optional wrapper className",
    },
  },
};

export const Default = {
  args: {},
};
