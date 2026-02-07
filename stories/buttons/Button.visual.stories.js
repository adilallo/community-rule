import Button from "../../app/components/buttons/Button";
import { within, userEvent } from "@storybook/test";

export default {
  title: "Components/Buttons/Button/Visual Regression",
  component: Button,
  parameters: {
    // Chromatic configuration for visual testing
    chromatic: {
      viewports: [320, 640, 1024, 1280],
      delay: 200,
      modes: {
        light: {},
        dark: {
          colorScheme: "dark",
        },
      },
    },
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["xsmall", "small", "medium", "large", "xlarge"],
    },
    buttonType: {
      control: { type: "select" },
      options: ["filled", "outline", "ghost", "danger"],
    },
    palette: {
      control: { type: "select" },
      options: ["default", "inverse"],
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
};

// Default button states
export const Default = {
  args: {
    children: "Default Button",
  },
  parameters: {
    docs: {
      description: {
        story: "Default button state for visual regression testing.",
      },
    },
  },
};

export const Hover = {
  args: {
    children: "Hover Button",
  },
  parameters: {
    docs: {
      description: {
        story: "Button in hover state for visual regression testing.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await userEvent.hover(button);
    await new Promise((resolve) => setTimeout(resolve, 100));
  },
};

export const Focus = {
  args: {
    children: "Focus Button",
  },
  parameters: {
    docs: {
      description: {
        story: "Button in focus state for visual regression testing.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    button.focus();
    await new Promise((resolve) => setTimeout(resolve, 100));
  },
};

export const Active = {
  args: {
    children: "Active Button",
  },
  parameters: {
    docs: {
      description: {
        story: "Button in active/pressed state for visual regression testing.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await userEvent.click(button);
    await new Promise((resolve) => setTimeout(resolve, 100));
  },
};

export const Disabled = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Disabled button state for visual regression testing.",
      },
    },
  },
};

// Size variants
export const XSmall = {
  args: {
    children: "XSmall Button",
    size: "xsmall",
  },
  parameters: {
    docs: {
      description: {
        story: "Extra small button size for visual regression testing.",
      },
    },
  },
};

export const Small = {
  args: {
    children: "Small Button",
    size: "small",
  },
  parameters: {
    docs: {
      description: {
        story: "Small button size for visual regression testing.",
      },
    },
  },
};

export const Medium = {
  args: {
    children: "Medium Button",
    size: "medium",
  },
  parameters: {
    docs: {
      description: {
        story: "Medium button size for visual regression testing.",
      },
    },
  },
};

export const Large = {
  args: {
    children: "Large Button",
    size: "large",
  },
  parameters: {
    docs: {
      description: {
        story: "Large button size for visual regression testing.",
      },
    },
  },
};

export const XLarge = {
  args: {
    children: "XLarge Button",
    size: "xlarge",
  },
  parameters: {
    docs: {
      description: {
        story: "Extra large button size for visual regression testing.",
      },
    },
  },
};

// Variant styles
export const HomeVariant = {
  args: {
    children: "Home Button",
    buttonType: "filled",
    palette: "default",
  },
  parameters: {
    docs: {
      description: {
        story: "Home variant button for visual regression testing.",
      },
    },
  },
};

// Button with icon/content
export const WithIcon = {
  args: {
    children: (
      <>
        <span>Button with Icon</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Button with icon for visual regression testing.",
      },
    },
  },
};

export const LongText = {
  args: {
    children:
      "This is a button with very long text content that might wrap or overflow",
  },
  parameters: {
    docs: {
      description: {
        story: "Button with long text for visual regression testing.",
      },
    },
  },
};

// Button grid for comparison
export const SizeComparison = {
  render: () => (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap gap-4 items-center">
        <Button size="xsmall">XSmall</Button>
        <Button size="small">Small</Button>
        <Button size="medium">Medium</Button>
        <Button size="large">Large</Button>
        <Button size="xlarge">XLarge</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All button sizes for comparison and visual regression testing.",
      },
    },
  },
};

export const StateComparison = {
  render: () => (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap gap-4 items-center">
        <Button>Default</Button>
        <Button disabled>Disabled</Button>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <Button buttonType="filled" palette="default">Home Default</Button>
        <Button buttonType="filled" palette="default" disabled>
          Home Disabled
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Button states for comparison and visual regression testing.",
      },
    },
  },
};

// Interactive states
export const InteractiveStates = {
  render: () => (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap gap-4 items-center">
        <Button id="hover-test">Hover Me</Button>
        <Button id="focus-test">Focus Me</Button>
        <Button id="click-test">Click Me</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Interactive button states for visual regression testing.",
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Test hover state", async () => {
      const hoverButton = canvas.getByRole("button", { name: "Hover Me" });
      await userEvent.hover(hoverButton);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await step("Test focus state", async () => {
      const focusButton = canvas.getByRole("button", { name: "Focus Me" });
      focusButton.focus();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await step("Test click state", async () => {
      const clickButton = canvas.getByRole("button", { name: "Click Me" });
      await userEvent.click(clickButton);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
  },
};

// Edge cases
export const EdgeCases = {
  render: () => (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap gap-4 items-center">
        <Button size="xsmall">Very Small</Button>
        <Button size="xlarge">Very Large</Button>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <Button>Normal</Button>
        <Button disabled>Disabled</Button>
        <Button buttonType="filled" palette="default">Home</Button>
        <Button buttonType="filled" palette="default" disabled>
          Home Disabled
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Edge cases for button visual regression testing.",
      },
    },
  },
};
