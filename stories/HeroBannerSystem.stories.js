import HeroBanner from "../app/components/sections/HeroBanner";
import ContentLockup from "../app/components/type/ContentLockup";
import HeroDecor from "../app/components/sections/HeroBanner/HeroDecor";

export default {
  title: "Systems/HeroBanner System",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Complete HeroBanner system showcasing all nested components working together. This demonstrates the full responsive behavior and component integration.",
      },
    },
  },
  tags: ["autodocs"],
};

export const CompleteSystem = {
  render: () => (
    <div className="min-h-screen bg-gray-50">
      <HeroBanner
        title="Collaborate"
        subtitle="with clarity"
        description="Help your community make important decisions in a way that reflects its unique values."
        ctaText="Learn how Community Rule works"
        ctaHref="#"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Complete HeroBanner system with all components integrated. Resize your browser to see responsive behavior across all breakpoints.",
      },
    },
  },
};

export const ComponentBreakdown = {
  render: () => (
    <div className="space-y-12 p-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">HeroBanner Components</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              1. ContentLockup Component
            </h3>
            <div className="bg-[var(--color-surface-default-brand-primary)] p-8 rounded-lg">
              <ContentLockup
                title="Collaborate"
                subtitle="with clarity"
                description="Help your community make important decisions in a way that reflects its unique values."
                ctaText="Learn how Community Rule works"
                ctaHref="#"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              2. HeroDecor Component
            </h3>
            <div className="bg-[var(--color-surface-default-brand-primary)] p-8 rounded-lg relative overflow-hidden h-64">
              <HeroDecor className="w-full h-full" />
              <div className="relative z-10 text-white mt-4">
                <p>Decoration appears behind content</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              3. Complete HeroBanner
            </h3>
            <HeroBanner
              title="Collaborate"
              subtitle="with clarity"
              description="Help your community make important decisions in a way that reflects its unique values."
              ctaText="Learn how Community Rule works"
              ctaHref="#"
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Breakdown of individual components that make up the HeroBanner system, showing how they work together.",
      },
    },
  },
};

export const ResponsiveBreakpoints = {
  render: () => (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold">Responsive Breakpoints</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">XSmall (≤429px)</h3>
          <div
            className="border-2 border-gray-300 rounded-lg overflow-hidden"
            style={{ width: "400px" }}
          >
            <HeroBanner
              title="Collaborate"
              subtitle="with clarity"
              description="Help your community make important decisions in a way that reflects its unique values."
              ctaText="Learn how Community Rule works"
              ctaHref="#"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Small (430px+)</h3>
          <div
            className="border-2 border-gray-300 rounded-lg overflow-hidden"
            style={{ width: "600px" }}
          >
            <HeroBanner
              title="Collaborate"
              subtitle="with clarity"
              description="Help your community make important decisions in a way that reflects its unique values."
              ctaText="Learn how Community Rule works"
              ctaHref="#"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Medium (768px+)</h3>
          <div
            className="border-2 border-gray-300 rounded-lg overflow-hidden"
            style={{ width: "900px" }}
          >
            <HeroBanner
              title="Collaborate"
              subtitle="with clarity"
              description="Help your community make important decisions in a way that reflects its unique values."
              ctaText="Learn how Community Rule works"
              ctaHref="#"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Large (1024px+)</h3>
          <div
            className="border-2 border-gray-300 rounded-lg overflow-hidden"
            style={{ width: "1200px" }}
          >
            <HeroBanner
              title="Collaborate"
              subtitle="with clarity"
              description="Help your community make important decisions in a way that reflects its unique values."
              ctaText="Learn how Community Rule works"
              ctaHref="#"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">XLarge (1440px+)</h3>
          <div
            className="border-2 border-gray-300 rounded-lg overflow-hidden"
            style={{ width: "1600px" }}
          >
            <HeroBanner
              title="Collaborate"
              subtitle="with clarity"
              description="Help your community make important decisions in a way that reflects its unique values."
              ctaText="Learn how Community Rule works"
              ctaHref="#"
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "HeroBanner system demonstrating responsive behavior at each breakpoint. Each container simulates a different screen size.",
      },
    },
  },
};

export const ContentVariations = {
  render: () => (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold">Content Variations</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Standard Content</h3>
          <HeroBanner
            title="Collaborate"
            subtitle="with clarity"
            description="Help your community make important decisions in a way that reflects its unique values."
            ctaText="Learn how Community Rule works"
            ctaHref="#"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Alternative Content</h3>
          <HeroBanner
            title="Build"
            subtitle="better communities"
            description="Create operating manuals that help your community thrive and make decisions together."
            ctaText="Get started today"
            ctaHref="/signup"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Long Description</h3>
          <HeroBanner
            title="Collaborate"
            subtitle="with clarity"
            description="Help your community make important decisions in a way that reflects its unique values. Our platform provides the tools and frameworks needed to build successful, sustainable communities that can navigate complex challenges together."
            ctaText="Learn how Community Rule works"
            ctaHref="#"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "HeroBanner system with different content variations to demonstrate flexibility and content handling.",
      },
    },
  },
};
