import SectionNumber from "../../app/components/sections/SectionNumber";

export default {
  title: "Components/Sections/SectionNumber",
  component: SectionNumber,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A numbered icon component that displays a number overlaid on a PNG background image. The component uses different PNG images for numbers 1, 2, and 3, with the image extending beyond the 40px container size.",
      },
    },
  },
  argTypes: {
    number: {
      control: { type: "number", min: 1, max: 3 },
      description: "The number to display (1, 2, or 3)",
    },
  },
  tags: ["autodocs"],
};

export const NumberOne = {
  args: {
    number: 1,
  },
};

export const NumberTwo = {
  args: {
    number: 2,
  },
};

export const NumberThree = {
  args: {
    number: 3,
  },
};

export const AllNumbers = {
  render: () => (
    <div className="flex space-x-4">
      <SectionNumber number={1} />
      <SectionNumber number={2} />
      <SectionNumber number={3} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Shows all three numbered icons side by side to demonstrate the different PNG backgrounds.",
      },
    },
  },
};

export const WithBackground = {
  render: () => (
    <div className="bg-gray-100 p-8 rounded-lg">
      <div className="flex space-x-4">
        <SectionNumber number={1} />
        <SectionNumber number={2} />
        <SectionNumber number={3} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Shows the numbered icons on a background to demonstrate how the PNG images extend beyond the container.",
      },
    },
  },
};
