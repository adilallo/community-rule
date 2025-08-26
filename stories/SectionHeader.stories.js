import SectionHeader from "../app/components/SectionHeader";

export default {
  title: "Components/SectionHeader",
  component: SectionHeader,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A section header component that displays a title and subtitle with responsive typography and layout. Supports different title text for large breakpoints and maintains consistent spacing across all screen sizes. Includes 'default' and 'multi-line' variants with different layout behaviors.",
      },
    },
  },
  argTypes: {
    title: {
      control: { type: "text" },
      description: "The main title text (used for xsm and sm breakpoints)",
    },
    subtitle: {
      control: { type: "text" },
      description: "The subtitle text below the main title",
    },
    titleLg: {
      control: { type: "text" },
      description:
        "The title text for lg and xl breakpoints (optional, falls back to title)",
    },
    variant: {
      control: { type: "select" },
      options: ["default", "multi-line"],
      description:
        "The layout variant - 'default' for traditional layout, 'multi-line' for 50/50 split layout",
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "How CommunityRule works",
    subtitle: "Here's a quick overview of the process, from start to finish.",
    titleLg: "How CommunityRule helps",
    variant: "default",
  },
};

export const MultiLine = {
  args: {
    title: "Popular templates",
    subtitle:
      "These are popular patterns for making decisions in mutual aid and open source communities. You can use them as they are or as a starting place for customizing your own CommunityRule.",
    variant: "multi-line",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The multi-line variant creates a 50/50 split layout at lg and xl breakpoints, with the title on the left and subtitle on the right. This variant is used in the RuleStack component.",
      },
    },
  },
};

export const CustomContent = {
  args: {
    title: "Our Mission",
    subtitle:
      "We're dedicated to helping communities thrive through better decision-making processes and transparent governance structures.",
    titleLg: "Building Better Communities",
    variant: "default",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example with custom content to show the flexibility of the component.",
      },
    },
  },
};

export const LongSubtitle = {
  args: {
    title: "Complex Process",
    subtitle:
      "This is a much longer subtitle that demonstrates how the component handles extended text content across different breakpoints and layout configurations.",
    titleLg: "Complex Process Simplified",
    variant: "default",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates how the component handles longer subtitle text across different breakpoints.",
      },
    },
  },
};

export const ResponsiveTest = {
  args: {
    title: "Responsive Design",
    subtitle:
      "Test the responsive behavior by resizing your browser window or using the viewport controls in Storybook.",
    titleLg: "Responsive Design Test",
    variant: "default",
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

export const WithoutTitleLg = {
  args: {
    title: "Simple Header",
    subtitle:
      "This example doesn't specify a titleLg prop, so it will use the same title text across all breakpoints.",
    variant: "default",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows the component without a titleLg prop, demonstrating the fallback behavior.",
      },
    },
  },
};

export const MultiLineResponsive = {
  args: {
    title: "Multi-line Responsive Test",
    subtitle:
      "This multi-line variant demonstrates the 50/50 split layout at larger breakpoints. Resize your browser to see how the layout adapts from stacked on mobile to side-by-side on desktop.",
    variant: "multi-line",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Test the responsive behavior of the multi-line variant. The layout changes from stacked on mobile to 50/50 split on lg and xl breakpoints.",
      },
    },
  },
};
