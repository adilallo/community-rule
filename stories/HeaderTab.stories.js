import HeaderTab from "../app/components/HeaderTab";

export default {
  title: "Components/HeaderTab",
  component: HeaderTab,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    stretch: {
      control: { type: "boolean" },
    },
  },
  args: {
    children: "Header Tab Content",
    stretch: false,
  },
};

export const Default = {
  args: {},
};

export const Stretched = {
  args: {
    stretch: true,
    children: "Stretched Header Tab",
  },
};

export const WithContent = {
  render: () => (
    <div className="w-full max-w-2xl">
      <HeaderTab>
        <div className="flex items-center h-full">
          <span className="text-white font-medium">Tab Content</span>
        </div>
      </HeaderTab>
    </div>
  ),
};
