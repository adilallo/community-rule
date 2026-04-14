import React from "react";
import RuleStack from "../../app/components/sections/RuleStack";
import { GOVERNANCE_TEMPLATE_CATALOG } from "../../lib/templates/governanceTemplateCatalog";

function buildStoryTemplatesPayload() {
  return GOVERNANCE_TEMPLATE_CATALOG.map((c, i) => ({
    id: `story-${c.slug}`,
    slug: c.slug,
    title: c.title,
    category: "Governance pattern",
    description: c.description,
    body: { sections: [] },
    sortOrder: i,
    featured: i < 4,
  }));
}

function withMockTemplatesApi(Story) {
  React.useLayoutEffect(() => {
    const prev = global.fetch;
    global.fetch = async (input, init) => {
      const url = typeof input === "string" ? input : input.url;
      if (String(url).includes("/api/templates")) {
        return new Response(
          JSON.stringify({ templates: buildStoryTemplatesPayload() }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return prev(input, init);
    };
    return () => {
      global.fetch = prev;
    };
  }, []);
  return <Story />;
}

export default {
  title: "Components/Sections/RuleStack",
  component: RuleStack,
  decorators: [withMockTemplatesApi],
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
