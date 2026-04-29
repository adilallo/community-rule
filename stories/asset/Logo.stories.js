import Logo from "../../app/components/asset/Logo";

export default {
  title: "Components/Asset/Logo",
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
        "footer",
        "createFlow",
        "topNavFolderTop",
        "topNavHeader",
      ],
      description: "The size variant of the logo",
    },
    palette: {
      control: { type: "select" },
      options: ["default", "inverse"],
      description:
        "Visual style: default (dark on light) or inverse (e.g. on teal)",
    },
    wordmark: {
      control: { type: "boolean" },
      description: "Whether to show the CommunityRule wordmark",
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    size: "default",
    wordmark: true,
  },
};

export const Sizes = {
  args: {
    wordmark: true,
  },
  render: (args) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">Standard Sizes</h3>
        <div className="space-x-4">
          <Logo {...args} size="default" />
          <Logo {...args} size="footer" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Responsive Sizes</h3>
        <div className="space-x-4">
          <Logo {...args} size="createFlow" />
          <Logo {...args} size="topNavFolderTop" />
          <Logo {...args} size="topNavHeader" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Different size variants available for the logo component. Responsive sizes adapt to breakpoints.",
      },
    },
  },
};

export const IconOnly = {
  args: {
    size: "default",
    wordmark: false,
  },
  render: (args) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">
          Icon Only - Standard Sizes
        </h3>
        <div className="space-x-4">
          <Logo {...args} size="default" />
          <Logo {...args} size="footer" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">
          Icon Only - Responsive Sizes
        </h3>
        <div className="space-x-4">
          <Logo {...args} size="createFlow" />
          <Logo {...args} size="topNavFolderTop" />
          <Logo {...args} size="topNavHeader" />
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

export const TopContext = {
  args: {},
  render: () => (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-surface-default-primary)] to-[var(--color-surface-default-secondary)] p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-white font-semibold mb-6">
          Top (navigation) — responsive
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-32">FolderTop:</span>
            <Logo size="topNavFolderTop" wordmark palette="inverse" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-32">Header:</span>
            <Logo size="topNavHeader" wordmark />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`Top` (Figma Navigation / Top) logo sizes: folder-top vs header variants.",
      },
    },
  },
};

export const CreateFlowContext = {
  args: {},
  render: () => (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-white font-semibold mb-6">Create Flow Context</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-32">CreateFlow:</span>
            <Logo size="createFlow" wordmark />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Create flow context showing responsive logo. Used in CreateFlowTopNav component.",
      },
    },
  },
};

export const CreateFlowCompletedInverse = {
  args: {},
  render: () => (
    <div
      className="min-h-screen p-8"
      style={{ background: "var(--color-teal-teal50, #c9fef9)" }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="font-semibold mb-6 text-[var(--color-content-invert-primary)]">
          Completed page (inverse on teal)
        </h2>
        <div className="space-y-4">
          <Logo size="createFlow" wordmark palette="inverse" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Same size as CreateFlowTopNav with inverse palette, as used on the completed page.",
      },
    },
  },
};
