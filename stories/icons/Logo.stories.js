import Logo from "../../app/components/icons/Logo";

export default {
  title: "Components/Icons/Logo",
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
    showText: false,
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

export const TopNavContext = {
  args: {},
  render: () => (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-surface-default-primary)] to-[var(--color-surface-default-secondary)] p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-white font-semibold mb-6">
          TopNav Context (Responsive)
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-32">FolderTop:</span>
            <Logo size="topNavFolderTop" showText={true} />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-32">Header:</span>
            <Logo size="topNavHeader" showText={true} />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "TopNav context showing responsive logo sizes. Text hides on smallest breakpoint, shows on larger breakpoints.",
      },
    },
  },
};

export const CreateFlowContext = {
  args: {},
  render: () => (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-white font-semibold mb-6">
          Create Flow Context
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-32">CreateFlow:</span>
            <Logo size="createFlow" showText={true} />
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
