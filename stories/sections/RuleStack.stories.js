import RuleStack from "../../app/components/sections/RuleStack";

export default {
  title: "Components/Sections/RuleStack",
  component: RuleStack,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A complete template library component that displays governance patterns in a responsive grid layout. Includes SectionHeader with multi-line variant, interactive RuleCard components, and a call-to-action button. Features comprehensive accessibility, analytics tracking, and responsive design across all breakpoints.\n\n" +
          "**Testing Scenarios:**\n" +
          "- **Responsive Testing**: Resize browser window to test layout adaptation from single column on mobile to 2x2 grid on larger screens\n" +
          "- **Interactive Testing**: Hover over cards to see effects, use Tab to navigate between cards, and click to see analytics events in console\n" +
          "- **Accessibility Testing**: Use screen readers to test ARIA labels, keyboard navigation to move between cards, and verify focus indicators\n" +
          "- **Custom Styling**: Add className prop to customize background or other styling",
      },
    },
  },
  argTypes: {
    className: {
      control: { type: "text" },
      description: "Additional CSS classes for custom styling",
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "The complete RuleStack component with all four governance templates, responsive grid layout, and interactive features. Test hover states, keyboard navigation, and responsive behavior across different screen sizes.",
      },
    },
  },
};
