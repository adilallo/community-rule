import HeroBanner from "../../app/components/sections/HeroBanner";

export default {
  title: "Components/Sections/HeroBanner",
  component: HeroBanner,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A responsive hero banner component that showcases the Community Rule branding and messaging. Adapts across multiple breakpoints with proper spacing, typography, and interactive elements. Includes background decorations and product demo integration.",
      },
    },
  },
  argTypes: {
    title: {
      control: { type: "text" },
      description: "The main title text",
    },
    subtitle: {
      control: { type: "text" },
      description: "The subtitle text",
    },
    description: {
      control: { type: "text" },
      description: "The description text",
    },
    ctaText: {
      control: { type: "text" },
      description: "The call-to-action button text",
    },
    ctaHref: {
      control: { type: "text" },
      description: "The call-to-action button link",
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "Collaborate",
    subtitle: "with clarity",
    description:
      "Help your community make important decisions in a way that reflects its unique values.",
    ctaText: "Learn how Community Rule works",
    ctaHref: "#",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default hero banner with standard Community Rule messaging and branding.",
      },
    },
  },
};
