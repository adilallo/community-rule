import Footer from "../../app/components/navigation/Footer";
import { within, userEvent } from "@storybook/test";

export default {
  title: "Components/Navigation/Footer/Responsive",
  component: Footer,
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
};

// Default story - will be captured at all viewports by Chromatic
export const Default = {
  parameters: {
    docs: {
      description: {
        story:
          "Footer component at different breakpoints. Chromatic will capture screenshots at 320px, 360px, 480px, 640px, 768px, 1024px, 1280px, 1440px, and 1920px viewport widths to test responsive behavior.",
      },
    },
  },
};

// Story for each breakpoint to make testing easier
export const ExtraSmall = {
  parameters: {
    viewport: {
      defaultViewport: "xs",
    },
    docs: {
      description: {
        story:
          "Footer at extra small breakpoint (360px). Tests mobile layout and stacking behavior.",
      },
    },
  },
};

export const Small = {
  parameters: {
    viewport: {
      defaultViewport: "sm",
    },
    docs: {
      description: {
        story:
          "Footer at small breakpoint (640px). Tests tablet layout and responsive behavior.",
      },
    },
  },
};

export const Medium = {
  parameters: {
    viewport: {
      defaultViewport: "md",
    },
    docs: {
      description: {
        story:
          "Footer at medium breakpoint (768px). Tests small desktop layout.",
      },
    },
  },
};

export const Large = {
  parameters: {
    viewport: {
      defaultViewport: "lg",
    },
    docs: {
      description: {
        story: "Footer at large breakpoint (1024px). Tests desktop layout.",
      },
    },
  },
};

export const ExtraLarge = {
  parameters: {
    viewport: {
      defaultViewport: "xl",
    },
    docs: {
      description: {
        story:
          "Footer at extra large breakpoint (1280px). Tests large desktop layout.",
      },
    },
  },
};

export const TwoXL = {
  parameters: {
    viewport: {
      defaultViewport: "xxl",
    },
    docs: {
      description: {
        story:
          "Footer at 2XL breakpoint (1440px). Tests very large desktop layout.",
      },
    },
  },
};

export const FullHD = {
  parameters: {
    viewport: {
      defaultViewport: "full",
    },
    docs: {
      description: {
        story:
          "Footer at Full HD breakpoint (1920px). Tests maximum desktop layout.",
      },
    },
  },
};

// Interactive story for testing user interactions
export const Interactive = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive footer for testing user interactions. Check the Actions panel to see triggered events.",
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Click footer links", async () => {
      const useCasesLink = canvas.getByRole("link", { name: /use cases/i });
      await userEvent.click(useCasesLink);

      const learnLink = canvas.getByRole("link", { name: /learn/i });
      await userEvent.click(learnLink);

      const aboutLink = canvas.getByRole("link", { name: /about/i });
      await userEvent.click(aboutLink);

      const privacyLink = canvas.getByRole("link", { name: /privacy policy/i });
      await userEvent.click(privacyLink);

      const termsLink = canvas.getByRole("link", { name: /terms of service/i });
      await userEvent.click(termsLink);
    });

    await step("Click social media links", async () => {
      const blueskyLink = canvas.getByRole("link", {
        name: /follow us on bluesky/i,
      });
      await userEvent.click(blueskyLink);

      const gitlabLink = canvas.getByRole("link", {
        name: /follow us on gitlab/i,
      });
      await userEvent.click(gitlabLink);
    });
  },
};

// Story for testing hover states
export const HoverStates = {
  parameters: {
    docs: {
      description: {
        story:
          "Footer with hover states visible. This story captures the visual appearance when elements are hovered.",
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Hover over footer links", async () => {
      const useCasesLink = canvas.getByRole("link", { name: /use cases/i });
      await userEvent.hover(useCasesLink);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const learnLink = canvas.getByRole("link", { name: /learn/i });
      await userEvent.hover(learnLink);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const aboutLink = canvas.getByRole("link", { name: /about/i });
      await userEvent.hover(aboutLink);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await step("Hover over social media links", async () => {
      const blueskyLink = canvas.getByRole("link", {
        name: /follow us on bluesky/i,
      });
      await userEvent.hover(blueskyLink);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const gitlabLink = canvas.getByRole("link", {
        name: /follow us on gitlab/i,
      });
      await userEvent.hover(gitlabLink);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
  },
};

// Story for testing with long content above
export const WithLongContent = {
  render: () => (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)]">
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">
            Footer with Long Content Above
          </h1>
          <p className="text-white mb-4">
            This story tests how the footer looks with a lot of content above
            it. This helps ensure the footer maintains its visual integrity in
            real-world scenarios.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="bg-[var(--color-surface-default-secondary)] p-4 rounded-lg"
              >
                <h3 className="text-white font-semibold mb-2">
                  Content Block {i + 1}
                </h3>
                <p className="text-[var(--color-content-default-secondary)] text-sm">
                  This is example content to show how the footer integrates with
                  page content. This block contains enough text to test layout
                  behavior.
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
          "Footer with long content above to test visual integration and layout stability.",
      },
    },
  },
};

// Story for testing edge cases
export const EdgeCases = {
  parameters: {
    viewport: {
      defaultViewport: "xs",
    },
    docs: {
      description: {
        story:
          "Footer at the smallest breakpoint to test edge case behavior and ensure no layout issues.",
      },
    },
  },
};
