import Header from "../app/components/Header.js";
import { within, userEvent } from "@storybook/test";

export default {
  title: "Components/Header/Responsive",
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

// Interactive story for testing user interactions
export const Interactive = {
  args: {
    onToggle: () => console.log("Navigation toggled"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive header for testing user interactions. Check the Actions panel to see triggered events.",
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Click navigation items", async () => {
      const useCasesLink = canvas.getByRole("menuitem", { name: /Use cases/i });
      await userEvent.click(useCasesLink);

      const learnLink = canvas.getByRole("menuitem", { name: /Learn/i });
      await userEvent.click(learnLink);

      const aboutLink = canvas.getByRole("menuitem", { name: /About/i });
      await userEvent.click(aboutLink);
    });

    await step("Click authentication elements", async () => {
      const loginLink = canvas.getByRole("menuitem", {
        name: /log in to your account/i,
      });
      await userEvent.click(loginLink);

      const createRuleButton = canvas.getByRole("button", {
        name: /create a new rule with avatar decoration/i,
      });
      await userEvent.click(createRuleButton);
    });
  },
};

// Story for testing hover states
export const HoverStates = {
  args: {
    onToggle: () => console.log("Navigation toggled"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Header with hover states visible. This story captures the visual appearance when elements are hovered.",
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Hover over navigation items", async () => {
      const useCasesLink = canvas.getByRole("menuitem", { name: /Use cases/i });
      await userEvent.hover(useCasesLink);
      // Wait for hover state to be visible
      await new Promise((resolve) => setTimeout(resolve, 100));

      const learnLink = canvas.getByRole("menuitem", { name: /Learn/i });
      await userEvent.hover(learnLink);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const aboutLink = canvas.getByRole("menuitem", { name: /About/i });
      await userEvent.hover(aboutLink);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await step("Hover over authentication elements", async () => {
      const loginLink = canvas.getByRole("menuitem", {
        name: /log in to your account/i,
      });
      await userEvent.hover(loginLink);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const createRuleButton = canvas.getByRole("button", {
        name: /create a new rule with avatar decoration/i,
      });
      await userEvent.hover(createRuleButton);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
  },
};

// Story for testing focus states
export const FocusStates = {
  args: {
    onToggle: () => console.log("Navigation toggled"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Header with focus states visible. This story captures the visual appearance when elements are focused.",
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Focus on navigation items", async () => {
      const useCasesLink = canvas.getByRole("menuitem", { name: /Use cases/i });
      useCasesLink.focus();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const learnLink = canvas.getByRole("menuitem", { name: /Learn/i });
      learnLink.focus();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const aboutLink = canvas.getByRole("menuitem", { name: /About/i });
      aboutLink.focus();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await step("Focus on authentication elements", async () => {
      const loginLink = canvas.getByRole("menuitem", {
        name: /log in to your account/i,
      });
      loginLink.focus();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const createRuleButton = canvas.getByRole("button", {
        name: /create a new rule with avatar decoration/i,
      });
      createRuleButton.focus();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
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
