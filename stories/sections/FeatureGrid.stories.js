import FeatureGrid from "../../app/components/sections/FeatureGrid";

export default {
  title: "Components/Sections/FeatureGrid",
  component: FeatureGrid,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Feature grid for the home marketing section (Figma 18847:22410).

- **Layout**: 2×2 on mobile, 1×4 on tablet, horizontal lockup + grid on desktop
- **Shell**: \`surface/default/secondary\` content block with responsive spacing tokens
- **ContentLockup**: Feature variant — 18/22 title & 14/20 subtitle (mobile), 24/32 title & 16/24 subtitle (640px+), 16/24 link
- **Mini tiles**: Invert-brand surfaces (royal, lime, rust, teal), 138px panel height, 48px icons
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
Default FeatureGrid — responsive breakpoint layout with Figma styling (invert-brand tiles, secondary surface, updated lockup typography).
        `,
      },
    },
  },
};
