import InfoMessageBox from "../../app/components/utility/InfoMessageBox";

export default {
  title: "Components/Utility/InfoMessageBox",
  component: InfoMessageBox,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
    docs: {
      description: {
        component:
          "Message region with optional exclamation icon and CheckboxGroup items.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-black p-8 max-w-md w-full">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

const sampleItems = [
  { id: "1", label: "First option" },
  { id: "2", label: "Second option" },
];

export const Default = {
  args: {
    title: "Before you continue",
    items: sampleItems,
  },
};

export const SingleItem = {
  args: {
    title: "Select one",
    items: [{ id: "a", label: "Only choice" }],
  },
};
