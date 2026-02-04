import NumberCard from "../app/components/NumberCard";

export default {
  title: "Components/NumberCard",
  component: NumberCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Individual number card component that displays a step in a process with a numbered icon and descriptive text. Supports explicit size variants (Small, Medium, Large, XLarge) matching Figma designs, or responsive layouts when size is not specified.",
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
    size: {
      control: { type: "select" },
      options: ["Small", "Medium", "Large", "XLarge", undefined],
      description:
        "Explicit size variant matching Figma designs. If not specified, uses responsive breakpoints for backward compatibility.",
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

export const Small = {
  args: {
    number: 1,
    text: "Document how your community makes decisions",
    size: "Small",
    iconShape: "blob",
    iconColor: "green",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Small size variant: flex-col layout with items-end, 16px gap, 20px padding, 24px text with 32px line height. Section number positioned top-right.",
      },
    },
  },
};

export const Medium = {
  args: {
    number: 1,
    text: "Document how your community makes decisions",
    size: "Medium",
    iconShape: "blob",
    iconColor: "green",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Medium size variant: flex-row layout with items-center, 32px gap, 32px padding, 24px text with 24px line height. Section number on left side.",
      },
    },
  },
};

export const Large = {
  args: {
    number: 1,
    text: "Document how your community makes decisions",
    size: "Large",
    iconShape: "blob",
    iconColor: "green",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Large size variant: flex-col layout with items-start justify-end, 22px gap, 238px height, 32px padding, 24px text with 24px line height. Section number absolute top-right.",
      },
    },
  },
};

export const XLarge = {
  args: {
    number: 1,
    text: "Document how your community makes decisions",
    size: "XLarge",
    iconShape: "blob",
    iconColor: "green",
  },
  parameters: {
    docs: {
      description: {
        story:
          "XLarge size variant: flex-col layout with items-start justify-end, 22px gap, 238px height, 32px padding, 32px text with 32px line height. Section number absolute top-right.",
      },
    },
  },
};

export const AllSizes = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Small</h3>
        <NumberCard
          number={1}
          text="Document how your community makes decisions"
          size="Small"
        />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Medium</h3>
        <NumberCard
          number={2}
          text="Document how your community makes decisions"
          size="Medium"
        />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Large</h3>
        <NumberCard
          number={3}
          text="Document how your community makes decisions"
          size="Large"
        />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">XLarge</h3>
        <NumberCard
          number={1}
          text="Document how your community makes decisions"
          size="XLarge"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Shows all four size variants side by side to compare the different layouts and typography.",
      },
    },
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
      <NumberCard {...args} number={1} text="First step in the process" />
      <NumberCard
        {...args}
        number={2}
        text="Second step with different content"
      />
      <NumberCard
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
