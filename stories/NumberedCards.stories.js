import NumberedCards from "../app/components/NumberedCards";

export default {
  title: "Components/NumberedCards",
  component: NumberedCards,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A component system for visually communicating multi-step workflows, processes, or value propositions. The component's modular design with NumberedCard and SectionNumber sub-components makes it ideal for explaining any sequential process while maintaining brand consistency and accessibility standards across the design system.",
      },
    },
  },
  argTypes: {
    title: {
      control: { type: "text" },
      description: "The main title for the section",
    },
    subtitle: {
      control: { type: "text" },
      description: "The subtitle text below the main title",
    },
    cards: {
      control: { type: "object" },
      description:
        "Array of card objects with text, iconShape, and iconColor properties",
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "How CommunityRule works",
    subtitle: "Here's a quick overview of the process, from start to finish.",
    cards: [
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
    cards: [
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
          "Example with custom content and four cards to show flexibility.",
      },
    },
  },
};

export const ResponsiveBreakpoints = {
  args: {
    title: "Responsive Design Test",
    subtitle:
      "This story demonstrates how the component adapts across different breakpoints: xsm, sm, lg, and xl.",
    cards: [
      {
        text: "Mobile-first design approach",
        iconShape: "blob",
        iconColor: "green",
      },
      {
        text: "Tablet and desktop optimization",
        iconShape: "gear",
        iconColor: "purple",
      },
      {
        text: "Large screen layouts and spacing",
        iconShape: "star",
        iconColor: "orange",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Test the responsive behavior by resizing your browser window or using the viewport controls in Storybook.",
      },
    },
  },
};
