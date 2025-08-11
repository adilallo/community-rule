import Footer from "../app/components/Footer";

export default {
  title: "Components/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The main footer with responsive layout, branding section, navigation links, and legal information. Features different logo sizes and layout changes across breakpoints.",
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
          "Use the Viewport toolbar to see how the footer adapts to different screen sizes. The layout changes from stacked to side-by-side and logo sizes adjust.",
      },
    },
  },
};

// Story to show the footer in a realistic page context
export const InPageContext = {
  args: {},
  render: () => (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)]">
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">
            Example Page Content
          </h1>
          <p className="text-white mb-4">
            This demonstrates how the footer looks in a realistic page context.
            The footer maintains its responsive behavior while providing
            navigation and branding information.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-[var(--color-surface-default-secondary)] p-4 rounded-lg"
              >
                <h3 className="text-white font-semibold mb-2">
                  Content Block {i}
                </h3>
                <p className="text-[var(--color-content-default-secondary)] text-sm">
                  This is example content to show how the footer integrates with
                  page content.
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The footer integrated into a full page layout to show how it works in context.",
      },
    },
  },
};
