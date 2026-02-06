import Header from "../../app/components/navigation/Header";

export default {
  title: "Components/Navigation/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The main navigation header with responsive behavior across different breakpoints. Features sticky positioning and active state highlighting for current page navigation.",
      },
    },
  },
  argTypes: {},
  tags: ["autodocs"],
};

export const Default = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "Use the Viewport toolbar to change the iframe width and see how the header adapts to different screen sizes. The header shows different layouts for mobile, tablet, and desktop breakpoints.",
      },
    },
  },
};

// Story to show the header in a realistic page context
export const InPageContext = {
  args: {},
  render: () => (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)]">
      <Header />
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">
            Example Page Content
          </h1>
          <p className="text-white mb-4">
            This demonstrates how the header looks in a realistic page context.
            The header maintains its responsive behavior while providing
            navigation for the page content.
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
                  This is example content to show how the header integrates with
                  page content.
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
          "The header integrated into a full page layout to show how it works in context.",
      },
    },
  },
};
