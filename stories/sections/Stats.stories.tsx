import type { Meta, StoryObj } from "@storybook/react";
import Stats from "../../app/components/sections/Stats";

const meta: Meta<typeof Stats> = {
  title: "Components/Sections/Stats",
  component: Stats,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};

export default meta;

type Story = StoryObj<typeof Stats>;

export const Default: Story = {
  args: {
    titlePrefix: "From",
    titleEmphasis: "projects",
    titleSuffix: "to communities",
    items: [
      {
        value: "420M+",
        label: "open source projects",
        asOf: "as of June 30, 2024",
        shapeVariant: "yellow",
      },
      {
        value: "27%",
        label: "year over year growth in open source",
        asOf: "as of June 30, 2024",
        shapeVariant: "purple",
      },
    ],
  },
};
