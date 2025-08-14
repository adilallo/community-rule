import Button from "../app/components/Button";

export default {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A versatile button component with multiple variants, sizes, and states. Can render as a button or link with full accessibility support. Includes focus states with keyboard navigation - use Tab key to test focus indicators.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "secondary"],
      description: "The visual style variant of the button",
    },
    size: {
      control: { type: "select" },
      options: ["xsmall", "small", "large", "xlarge"],
      description: "The size of the button",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Whether the button is disabled",
    },
    href: {
      control: { type: "text" },
      description: "If provided, renders as a link instead of a button",
    },
    onClick: { action: "clicked" },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    children: "Button",
  },
};

export const Variants = {
  args: {
    children: "Button",
    size: "large",
  },
  render: (args) => (
    <div className="space-y-4">
      <div className="space-x-4">
        <Button {...args} variant="default">
          Default
        </Button>
        <Button {...args} variant="secondary">
          Secondary
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different visual variants of the button component.",
      },
    },
  },
};

export const Sizes = {
  args: {
    children: "Button",
    variant: "default",
  },
  render: (args) => (
    <div className="space-y-4">
      <div className="space-x-4">
        <Button {...args} size="xsmall">
          XSmall
        </Button>
        <Button {...args} size="small">
          Small
        </Button>
        <Button {...args} size="large">
          Large
        </Button>
        <Button {...args} size="xlarge">
          XLarge
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different sizes available for the button component.",
      },
    },
  },
};

export const States = {
  args: {
    children: "Button",
    size: "large",
    variant: "default",
  },
  render: (args) => (
    <div className="space-y-4">
      <div className="space-x-4">
        <Button {...args}>Normal</Button>
        <Button {...args} disabled>
          Disabled
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different states of the button component.",
      },
    },
  },
};

export const AllVariants = {
  args: {},
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">Default Variant</h3>
        <div className="space-x-4">
          <Button size="xsmall">XSmall</Button>
          <Button size="small">Small</Button>
          <Button size="large">Large</Button>
          <Button size="xlarge">XLarge</Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Secondary Variant</h3>
        <div className="space-x-4">
          <Button variant="secondary" size="xsmall">
            XSmall
          </Button>
          <Button variant="secondary" size="small">
            Small
          </Button>
          <Button variant="secondary" size="large">
            Large
          </Button>
          <Button variant="secondary" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Disabled States</h3>
        <div className="space-x-4">
          <Button size="large" disabled>
            Default Disabled
          </Button>
          <Button variant="secondary" size="large" disabled>
            Secondary Disabled
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Complete overview of all button variants, sizes, and states.",
      },
    },
  },
};
