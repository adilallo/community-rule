import Header from "../app/components/Header.js";
import { within, userEvent } from "@storybook/testing-library";

export default {
  title: "Components/Header/Responsive",
  component: Header,
  parameters: {
    // Chromatic configuration for responsive testing
    chromatic: {
      viewports: [360, 640, 768, 1024, 1280],
      // Capture screenshots at each breakpoint
      delay: 100, // Small delay to ensure layout is stable
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
      const useCasesLink = canvas.getByRole("link", { name: /use cases/i });
      await userEvent.click(useCasesLink);

      const learnLink = canvas.getByRole("link", { name: /learn/i });
      await userEvent.click(learnLink);

      const aboutLink = canvas.getByRole("link", { name: /about/i });
      await userEvent.click(aboutLink);
    });

    await step("Click authentication elements", async () => {
      const loginLink = canvas.getByRole("link", {
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
