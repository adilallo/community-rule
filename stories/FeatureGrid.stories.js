import FeatureGrid from "../app/components/FeatureGrid";

export default {
  title: "Components/FeatureGrid",
  component: FeatureGrid,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A responsive component that displays a collection of organizational tools and services in a clean card-based grid layout with supportive messaging and categorized feature highlights.

## Features
- **Three grid variants**: 1x4, 2x2, and 2x4 configurations
- **Responsive design**: Adapts from single column to multi-column grid
- **Color coding**: Purple, green, pink, and blue brand colors for categorization
- **Interactive elements**: Hover states and keyboard navigation
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels
- **Design system integration**: Uses design tokens for consistent styling

## Usage
\`\`\`jsx
<FeatureGrid 
  variant="2x2"
  headline="Your headline here"
  description="Your description here"
  features={[
    {
      id: "feature-1",
      label: "Feature Name",
      description: "Feature description",
      icon: "path/to/icon.svg",
      color: "purple"
    }
  ]}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["1x4", "2x2", "2x4"],
      description: "Grid layout variant",
    },
    headline: {
      control: { type: "text" },
      description: "Main headline text",
    },
    description: {
      control: { type: "text" },
      description: "Supporting description text",
    },
    ctaText: {
      control: { type: "text" },
      description: "Call-to-action button text",
    },
    ctaHref: {
      control: { type: "text" },
      description: "Call-to-action link URL",
    },
    features: {
      control: { type: "object" },
      description: "Array of feature objects",
    },
    onFeatureClick: {
      action: "feature-click",
      description: "Callback when feature card is clicked",
    },
    onCtaClick: {
      action: "cta-click",
      description: "Callback when CTA is clicked",
    },
  },
};

// Sample feature data
const sampleFeatures = [
  {
    id: "consensus",
    label: "Consensus Decision Making",
    description: "Build agreement through collaborative processes",
    icon: "assets/Icon_Consensus.svg",
    color: "purple",
  },
  {
    id: "governance",
    label: "Governance Structures",
    description: "Create clear roles and responsibilities",
    icon: "assets/Icon_ElectedBoard.svg",
    color: "green",
  },
  {
    id: "communication",
    label: "Communication Tools",
    description: "Facilitate transparent information sharing",
    icon: "assets/Icon_Sociocracy.svg",
    color: "pink",
  },
  {
    id: "resources",
    label: "Resource Management",
    description: "Efficiently allocate and track resources",
    icon: "assets/Icon_Petition.svg",
    color: "blue",
  },
];

// Default story
export const Default = {
  args: {
    variant: "2x2",
    headline: "Everything you need to build better communities",
    description: "Our comprehensive toolkit provides the tools, resources, and guidance to help your organization thrive.",
    ctaText: "Learn more",
    ctaHref: "#",
    features: sampleFeatures,
  },
};

// 1x4 Grid Variant
export const OneByFour = {
  args: {
    variant: "1x4",
    headline: "Core organizational tools",
    description: "Essential features for effective community governance and decision-making.",
    ctaText: "Explore tools",
    ctaHref: "#",
    features: sampleFeatures,
  },
  parameters: {
    docs: {
      description: {
        story: "1x4 grid layout optimized for showcasing four key features in a single row on desktop.",
      },
    },
  },
};

// 2x4 Grid Variant
export const TwoByFour = {
  args: {
    variant: "2x4",
    headline: "Complete toolkit for organizations",
    description: "Eight essential tools and services to support your community's growth and success.",
    ctaText: "Get started",
    ctaHref: "#",
    features: [
      ...sampleFeatures,
      {
        id: "analytics",
        label: "Analytics & Insights",
        description: "Track progress and measure impact",
        icon: "assets/Icon_Consensus.svg",
        color: "purple",
      },
      {
        id: "training",
        label: "Training & Education",
        description: "Build skills and knowledge",
        icon: "assets/Icon_ElectedBoard.svg",
        color: "green",
      },
      {
        id: "support",
        label: "Community Support",
        description: "Connect with peers and experts",
        icon: "assets/Icon_Sociocracy.svg",
        color: "pink",
      },
      {
        id: "integration",
        label: "System Integration",
        description: "Connect with existing tools",
        icon: "assets/Icon_Petition.svg",
        color: "blue",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "2x4 grid layout for comprehensive feature showcases with eight tools.",
      },
    },
  },
};

// All Variants Comparison
export const AllVariants = {
  render: () => (
    <div className="space-y-16 p-4">
      <div>
        <h3 className="text-lg font-bold mb-4">1x4 Grid Variant</h3>
        <FeatureGrid
          variant="1x4"
          headline="Core organizational tools"
          description="Essential features for effective community governance."
          ctaText="Explore tools"
          ctaHref="#"
          features={sampleFeatures}
        />
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">2x2 Grid Variant</h3>
        <FeatureGrid
          variant="2x2"
          headline="Everything you need to build better communities"
          description="Our comprehensive toolkit provides the tools, resources, and guidance to help your organization thrive."
          ctaText="Learn more"
          ctaHref="#"
          features={sampleFeatures}
        />
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">2x4 Grid Variant</h3>
        <FeatureGrid
          variant="2x4"
          headline="Complete toolkit for organizations"
          description="Eight essential tools and services to support your community's growth and success."
          ctaText="Get started"
          ctaHref="#"
          features={[
            ...sampleFeatures,
            {
              id: "analytics",
              label: "Analytics & Insights",
              description: "Track progress and measure impact",
              icon: "assets/Icon_Consensus.svg",
              color: "purple",
            },
            {
              id: "training",
              label: "Training & Education",
              description: "Build skills and knowledge",
              icon: "assets/Icon_ElectedBoard.svg",
              color: "green",
            },
            {
              id: "support",
              label: "Community Support",
              description: "Connect with peers and experts",
              icon: "assets/Icon_Sociocracy.svg",
              color: "pink",
            },
            {
              id: "integration",
              label: "System Integration",
              description: "Connect with existing tools",
              icon: "assets/Icon_Petition.svg",
              color: "blue",
            },
          ]}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Side-by-side comparison of all three grid variants to show the differences in layout and content density.",
      },
    },
  },
};

// Interactive States
export const InteractiveStates = {
  args: {
    variant: "2x2",
    headline: "Interactive feature showcase",
    description: "Hover over cards and use keyboard navigation to test interactive states.",
    ctaText: "Try it out",
    ctaHref: "#",
    features: sampleFeatures,
  },
  parameters: {
    docs: {
      description: {
        story: "Test hover states, focus indicators, and keyboard navigation for accessibility compliance.",
      },
    },
  },
};

// Empty State
export const EmptyState = {
  args: {
    variant: "2x2",
    headline: "No features available",
    description: "This is how the component looks when no features are provided.",
    ctaText: "Add features",
    ctaHref: "#",
    features: [],
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state when no features are provided, showing graceful fallback messaging.",
      },
    },
  },
};
