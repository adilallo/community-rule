import FeatureGrid from "../../app/components/sections/FeatureGrid";

export default {
  title: "Components/Sections/FeatureGrid",
  component: FeatureGrid,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A responsive feature grid component that displays organizational tools and services in a clean card-based layout with supportive messaging and categorized feature highlights.

## Features

- **Responsive Layout**: Adapts from 2x2 grid on mobile to 1x4 grid on tablet to horizontal layout on desktop
- **ContentLockup Integration**: Uses the feature variant with "Learn more" link
- **MiniCard Grid**: Four feature cards with color-coded backgrounds and icons
- **Accessibility**: Full keyboard navigation, focus indicators, and ARIA labels
- **Design System**: Uses design tokens for consistent spacing, colors, and typography

## Responsive Behavior

- **Mobile (< 768px)**: 2x2 grid layout with ContentLockup on top
- **Tablet (768px - 1024px)**: 1x4 grid layout with ContentLockup on top  
- **Desktop (> 1024px)**: Horizontal layout with ContentLockup on left, 1x4 grid on right

## Interactive Elements

- **MiniCards**: Hover effects, focus indicators, and keyboard navigation
- **Learn More Link**: Underlined link with focus states
- **Color-coded Features**: Royal, green, pink, and blue backgrounds for categorization

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly with proper ARIA labels
- Focus management with visible indicators
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: { type: "text" },
      description: "Main headline text for the ContentLockup",
    },
    subtitle: {
      control: { type: "text" },
      description: "Supporting subtitle text for the ContentLockup",
    },
    className: {
      control: { type: "text" },
      description: "Additional CSS classes for custom styling",
    },
  },
};

export const Default = {
  args: {
    title: "We've got your back, every step of the way",
    subtitle:
      "Use our toolkit to improve, document, and evolve your organization.",
  },
  parameters: {
    docs: {
      description: {
        story: `
Default FeatureGrid with standard content. This component demonstrates:

- **ContentLockup**: Feature variant with title, subtitle, and "Learn more" link
- **MiniCard Grid**: Four feature cards with different colors and icons
- **Responsive Design**: Layout adapts across mobile, tablet, and desktop breakpoints
- **Interactive States**: Hover effects and focus indicators on all interactive elements

The component uses a dark background (#171717) with rounded corners and proper spacing using design tokens.
        `,
      },
    },
  },
};
