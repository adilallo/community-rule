import Logo from "../app/components/Logo";

export default {
  title: "Components/Logo",
  component: Logo,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The CommunityRule logo component with multiple size variants for different contexts (header, footer, home header). Can display with or without text and adapts colors based on context.",
      },
    },
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: [
        "default",
        "homeHeaderXsmall",
        "homeHeaderSm",
        "homeHeaderMd",
        "homeHeaderLg",
        "homeHeaderXl",
        "header",
        "headerMd",
        "headerLg",
        "headerXl",
        "footer",
        "footerLg",
      ],
      description: "The size variant of the logo",
    },
    showText: {
      control: { type: "boolean" },
      description: "Whether to show the text portion of the logo",
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    size: "default",
    showText: true,
  },
};

export const Sizes = {
  args: {
    showText: true,
  },
  render: (args) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">Default Sizes</h3>
        <div className="space-x-4">
          <Logo {...args} size="default" />
          <Logo {...args} size="header" />
          <Logo {...args} size="footer" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Header Sizes</h3>
        <div className="space-x-4">
          <Logo {...args} size="header" />
          <Logo {...args} size="headerMd" />
          <Logo {...args} size="headerLg" />
          <Logo {...args} size="headerXl" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Home Header Sizes</h3>
        <div className="space-x-4">
          <Logo {...args} size="homeHeaderXsmall" />
          <Logo {...args} size="homeHeaderSm" />
          <Logo {...args} size="homeHeaderMd" />
          <Logo {...args} size="homeHeaderLg" />
          <Logo {...args} size="homeHeaderXl" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Footer Sizes</h3>
        <div className="space-x-4">
          <Logo {...args} size="footer" />
          <Logo {...args} size="footerLg" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Different size variants available for the logo component across different contexts.",
      },
    },
  },
};

export const IconOnly = {
  args: {
    size: "default",
    showText: false,
  },
  render: (args) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">
          Icon Only - Default Sizes
        </h3>
        <div className="space-x-4">
          <Logo {...args} size="default" />
          <Logo {...args} size="header" />
          <Logo {...args} size="footer" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">
          Icon Only - Header Sizes
        </h3>
        <div className="space-x-4">
          <Logo {...args} size="header" />
          <Logo {...args} size="headerMd" />
          <Logo {...args} size="headerLg" />
          <Logo {...args} size="headerXl" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">
          Icon Only - Home Header Sizes
        </h3>
        <div className="space-x-4">
          <Logo {...args} size="homeHeaderXsmall" />
          <Logo {...args} size="homeHeaderSm" />
          <Logo {...args} size="homeHeaderMd" />
          <Logo {...args} size="homeHeaderLg" />
          <Logo {...args} size="homeHeaderXl" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Logo variants with only the icon, no text. Useful for compact spaces.",
      },
    },
  },
};

export const HomeHeaderContext = {
  args: {},
  render: () => (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-surface-default-primary)] to-[var(--color-surface-default-secondary)] p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-white font-semibold mb-6">
          Home Header Context (White Text)
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">XSmall:</span>
            <Logo size="homeHeaderXsmall" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">Small:</span>
            <Logo size="homeHeaderSm" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">Medium:</span>
            <Logo size="homeHeaderMd" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">Large:</span>
            <Logo size="homeHeaderLg" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">XLarge:</span>
            <Logo size="homeHeaderXl" />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Home header context showing white text variants. These are used on dark/transparent backgrounds.",
      },
    },
  },
};

export const HeaderContext = {
  args: {},
  render: () => (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)] p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-white font-semibold mb-6">
          Header Context (Dark Text)
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">Default:</span>
            <Logo size="header" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">Medium:</span>
            <Logo size="headerMd" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">Large:</span>
            <Logo size="headerLg" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">XLarge:</span>
            <Logo size="headerXl" />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Header context showing dark text variants. These are used on light backgrounds.",
      },
    },
  },
};

export const FooterContext = {
  args: {},
  render: () => (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)] p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-white font-semibold mb-6">
          Footer Context (Larger Sizes)
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">Default:</span>
            <Logo size="footer" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">Large:</span>
            <Logo size="footerLg" />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Footer context showing larger size variants for footer placement.",
      },
    },
  },
};
