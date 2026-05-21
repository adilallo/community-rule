import type { Meta, StoryObj } from "@storybook/react";
import Accordion from "../../app/components/layout/Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Components/Layout/Accordion",
  component: Accordion,
  parameters: {
    layout: "padded",
    backgrounds: { default: "dark" },
  },
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    title: "What is CommunityRule, and who is it for?",
    children: "CommunityRule helps groups write operating manuals.",
    size: "l",
  },
};

/** FAQ-style: small header below `lg`, medium at `lg` (Figma 22135-890258). */
export const SmallWithMediumAtLg: Story = {
  args: {
    title: "What is CommunityRule, and who is it for?",
    children: "CommunityRule helps groups write operating manuals.",
    size: "s",
    lgSize: "m",
  },
};
