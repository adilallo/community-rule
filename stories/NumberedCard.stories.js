import NumberedCard from "../app/components/NumberedCard";

export default {
  title: "Components/NumberedCard",
  component: NumberedCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Individual numbered card component that displays a step in a process with a numbered icon and descriptive text. Supports responsive layouts across different breakpoints.",
      },
    },
  },
  argTypes: {
    number: {
      control: { type: "number", min: 1, max: 9 },
      description: "The number to display on the card",
    },
    text: {
      control: { type: "text" },
      description: "The descriptive text for this step",
    },
    iconShape: {
      control: { type: "select" },
      options: ["blob", "gear", "star"],
      description:
        "The shape of the icon background (currently not used, uses PNG images)",
    },
    iconColor: {
      control: { type: "select" },
      options: ["green", "purple", "orange", "blue"],
      description:
        "The color theme for the icon (currently not used, uses PNG images)",
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    number: 1,
    text: "Document how your community makes decisions",
    iconShape: "blob",
    iconColor: "green",
  },
};

export const AllNumbers = {
  args: {
    number: 1,
    text: "Example card text",
    iconShape: "blob",
    iconColor: "green",
  },
  render: (args) => (
    <div className="space-y-4">
      <NumberedCard {...args} number={1} text="First step in the process" />
      <NumberedCard
        {...args}
        number={2}
        text="Second step with different content"
      />
      <NumberedCard
        {...args}
        number={3}
        text="Third and final step of the workflow"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Shows all three numbered cards with different content to demonstrate the visual hierarchy.",
      },
    },
  },
};

export const LongText = {
  args: {
    number: 1,
    text: "This is a much longer piece of text that demonstrates how the card handles content that spans multiple lines and requires more space to display properly",
    iconShape: "blob",
    iconColor: "green",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates how the card handles longer text content across different breakpoints.",
      },
    },
  },
};
