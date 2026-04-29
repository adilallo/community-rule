import TextBlock from "../../app/components/type/TextBlock";

export default {
  title: "Components/Type/TextBlock",
  component: TextBlock,
  parameters: { layout: "padded" },
  argTypes: {
    title: { control: "text" },
    body: { control: "text" },
    rows: { control: false },
  },
};

export const PlainBody = {
  args: {
    title: "Solidarity Forever",
    body: "First paragraph line.\n\nSecond paragraph with more detail.",
  },
};

export const LabeledRows = {
  args: {
    title: "Consensus or vote-based approval",
    rows: [
      {
        label: "Eligibility & philosophy",
        body: "Access to critical resources is restricted to safeguard the project.",
      },
      {
        label: "Joining process",
        body: "Volunteers who have completed two full distributions can submit a request.",
      },
    ],
  },
};
