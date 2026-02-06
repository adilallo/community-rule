import Header from "../../app/components/navigation/Header";

export default {
  title: "Components/Navigation/Header/Responsive",
  component: Header,
  parameters: {
    // Chromatic configuration for responsive testing
    chromatic: {
      viewports: [320, 360, 480, 640, 768, 1024, 1280, 1440, 1920],
      // Capture screenshots at each breakpoint
      delay: 200, // Increased delay to ensure layout is stable
      // Capture both light and dark themes if available
      modes: {
        light: {},
        dark: {
          // This will be used if dark mode is implemented
          colorScheme: "dark",
        },
      },
    },
    // Storybook viewport configuration
    viewport: {
      viewports: {
        xs: {
          name: "Extra Small (xs)",
          styles: {
            width: "360px",
            height: "700px",
          },
        },
        sm: {
          name: "Small (sm)",
          styles: {
            width: "640px",
            height: "700px",
          },
        },
        md: {
          name: "Medium (md)",
          styles: {
            width: "768px",
            height: "700px",
          },
        },
        lg: {
          name: "Large (lg)",
          styles: {
            width: "1024px",
            height: "700px",
          },
        },
        xl: {
          name: "Extra Large (xl)",
          styles: {
            width: "1280px",
            height: "700px",
          },
        },
        xxl: {
          name: "2XL (xxl)",
          styles: {
            width: "1440px",
            height: "700px",
          },
        },
        full: {
          name: "Full HD (full)",
          styles: {
            width: "1920px",
            height: "700px",
          },
        },
      },
    },
  },
  argTypes: {
    onToggle: { action: "toggled" },
  },
};

// Default story - will be captured at all viewports by Chromatic
export const Default = {
  args: {
    onToggle: () => console.log("Navigation toggled"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Header component at different breakpoints. Chromatic will capture screenshots at 360px, 640px, 768px, 1024px, and 1280px viewport widths to test responsive behavior.",
      },
    },
  },
};

// Story for each breakpoint to make testing easier
export const ExtraSmall = {
  args: {
    onToggle: () => console.log("Navigation toggled"),
  },
  parameters: {
    viewport: {
      defaultViewport: "xs",
    },
    docs: {
      description: {
        story:
          "Header at extra small breakpoint (360px). Navigation items are moved to the right section.",
      },
    },
  },
};

export const Small = {
  args: {
    onToggle: () => console.log("Navigation toggled"),
  },
  parameters: {
    viewport: {
      defaultViewport: "sm",
    },
    docs: {
      description: {
        story:
          "Header at small breakpoint (640px). All navigation items are grouped together in the center.",
      },
    },
  },
};

export const Medium = {
  args: {
    onToggle: () => console.log("Navigation toggled"),
  },
  parameters: {
    viewport: {
      defaultViewport: "md",
    },
    docs: {
      description: {
        story:
          "Header at medium breakpoint (768px). Navigation items are in the center, login and create rule buttons on the right.",
      },
    },
  },
};

export const Large = {
  args: {
    onToggle: () => console.log("Navigation toggled"),
  },
  parameters: {
    viewport: {
      defaultViewport: "lg",
    },
    docs: {
      description: {
        story:
          "Header at large breakpoint (1024px). Full navigation layout with larger elements.",
      },
    },
  },
};

export const ExtraLarge = {
  args: {
    onToggle: () => console.log("Navigation toggled"),
  },
  parameters: {
    viewport: {
      defaultViewport: "xl",
    },
    docs: {
      description: {
        story:
          "Header at extra large breakpoint (1280px). Maximum size layout with largest elements.",
      },
    },
  },
};

// Story for testing with long content
export const WithLongContent = {
  args: {
    onToggle: () => console.log("Navigation toggled"),
  },
  render: () => (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)]">
      <Header onToggle={() => console.log("Navigation toggled")} />
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">
            Header with Long Content
          </h1>
          <p className="text-white mb-4">
            This story tests how the header looks with a lot of content below
            it. This helps ensure the header maintains its visual integrity in
            real-world scenarios.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="bg-[var(--color-surface-default-secondary)] p-4 rounded-lg"
              >
                <h3 className="text-white font-semibold mb-2">
                  Content Block {i + 1}
                </h3>
                <p className="text-[var(--color-content-default-secondary)] text-sm">
                  This is example content to show how the header integrates with
                  page content. This block contains enough text to test layout
                  behavior.
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
          "Header with long content below to test visual integration and layout stability.",
      },
    },
  },
};

// Story for testing edge cases
export const EdgeCases = {
  args: {
    onToggle: () => console.log("Navigation toggled"),
  },
  parameters: {
    viewport: {
      defaultViewport: "xs",
    },
    docs: {
      description: {
        story:
          "Header at the smallest breakpoint to test edge case behavior and ensure no layout issues.",
      },
    },
  },
};
