import CardSteps from "../../app/components/sections/CardSteps";

export default {
  title: "Components/Sections/CardSteps",
  component: CardSteps,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Marketing section (Figma SectionCardSteps) that composes **cards/Step** tiles with a section header and CTA. Use for sequential explainers on the home page and similar surfaces.",
      },
    },
  },
  argTypes: {
    title: {
      control: { type: "text" },
      description: "The main title for the section (mobile single line)",
    },
    subtitle: {
      control: { type: "text" },
      description: "Supporting text beside / below the title on large screens",
    },
    steps: {
      control: { type: "object" },
      description:
        "Items rendered as **Step** cards (text, optional iconShape, iconColor)",
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "How CommunityRule works",
    subtitle: "Here's a quick overview of the process, from start to finish.",
    headingDesktopLines: ["How", "CommunityRule", "helps"],
    steps: [
      {
        text: "Document how your community makes decisions",
        iconShape: "blob",
        iconColor: "green",
      },
      {
        text: "Build an operating manual for a successful community",
        iconShape: "gear",
        iconColor: "purple",
      },
      {
        text: "Get a link to your manual for your group to review and evolve",
        iconShape: "star",
        iconColor: "orange",
      },
    ],
  },
};

export const CustomContent = {
  args: {
    title: "Our Process",
    subtitle: "Follow these simple steps to get started with your project.",
    steps: [
      {
        text: "Define your project requirements and goals",
        iconShape: "blob",
        iconColor: "green",
      },
      {
        text: "Collaborate with our team to create the perfect solution",
        iconShape: "gear",
        iconColor: "purple",
      },
      {
        text: "Launch and iterate based on user feedback",
        iconShape: "star",
        iconColor: "orange",
      },
      {
        text: "Scale and optimize for continued success",
        iconShape: "blob",
        iconColor: "blue",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example with custom content and four **Step** tiles to show flexibility.",
      },
    },
  },
};
