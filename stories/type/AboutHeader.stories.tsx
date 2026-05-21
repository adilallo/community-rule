import type { Meta, StoryObj } from "@storybook/react";
import AboutHeader from "../../app/components/type/AboutHeader";

const meta: Meta<typeof AboutHeader> = {
  title: "Components/Type/AboutHeader",
  component: AboutHeader,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};

export default meta;

type Story = StoryObj<typeof AboutHeader>;

export const Default: Story = {
  args: {
    segments: [
      { type: "word", text: "CommunityRule" },
      { type: "icon", icon: "arrow" },
      { type: "word", text: "is" },
      { type: "word", text: "a" },
      { type: "word", text: "tool" },
      { type: "word", text: "that" },
      { type: "word", text: "helps" },
      { type: "word", text: "groups" },
      { type: "icon", icon: "about" },
      { type: "word", text: "define" },
      { type: "word", text: "who" },
      { type: "word", text: "they" },
      { type: "word", text: "want" },
      { type: "word", text: "to" },
      { type: "word", text: "be" },
    ],
  },
};
