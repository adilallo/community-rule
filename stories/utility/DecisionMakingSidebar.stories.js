import DecisionMakingSidebar from "../../app/components/utility/DecisionMakingSidebar";

export default {
  title: "Components/Utility/DecisionMakingSidebar",
  component: DecisionMakingSidebar,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
    docs: {
      description: {
        component:
          "HeaderLockup + InfoMessageBox for decision-making step sidebars.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-black p-8 max-w-lg w-full">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

const messageItems = [
  { id: "c1", label: "Consensus" },
  { id: "c2", label: "Majority vote" },
];

export const Default = {
  args: {
    title: "How does your group make decisions?",
    description:
      "Choose the approaches that best match how your community operates.",
    messageBoxTitle: "Common approaches",
    messageBoxItems: messageItems,
    size: "L",
    justification: "left",
  },
};

export const Medium = {
  args: {
    title: "Decision-making",
    description: "Short description.",
    messageBoxTitle: "Pick any",
    messageBoxItems: [{ id: "x", label: "Single method" }],
    size: "M",
    justification: "left",
  },
};
