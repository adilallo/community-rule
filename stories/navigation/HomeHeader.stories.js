import HomeHeader from "../../app/components/navigation/HomeHeader";

export default {
  title: "Components/Navigation/HomeHeader",
  component: HomeHeader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The home page header with transparent background, HeaderTab wrapper, and responsive behavior. Features active state highlighting for current page navigation.",
      },
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
          "Use the Viewport toolbar to see how the home header adapts to different screen sizes. The header has a transparent background and uses HeaderTab for the left section.",
      },
    },
  },
};

// Story to show the home header in a realistic home page context
export const InHomePageContext = {
  args: {},
  render: () => (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-surface-default-primary)] to-[var(--color-surface-default-secondary)]">
      <HomeHeader />
      <main className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to CommunityRule
          </h1>
          <p className="text-xl text-[var(--color-content-default-secondary)] mb-8">
            This demonstrates how the home header looks in a realistic home page
            context. The header maintains its transparent background and
            responsive behavior.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[var(--color-surface-default-secondary)] p-6 rounded-lg border border-[var(--border-color-default-tertiary)]"
              >
                <h3 className="text-white font-semibold mb-3">Feature {i}</h3>
                <p className="text-[var(--color-content-default-secondary)]">
                  This is example content to show how the home header integrates
                  with home page content.
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The home header integrated into a full home page layout with gradient background to show the transparent header effect.",
      },
    },
  },
};
