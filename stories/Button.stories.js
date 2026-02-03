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
      options: [
        "default",
        "secondary",
        "primary",
        "outlined",
        "dark",
        "inverse",
        "ghost",
        "danger",
        "danger-inverse",
      ],
      description: "The visual style variant of the button",
    },
    size: {
      control: { type: "select" },
      options: ["xsmall", "small", "medium", "large", "xlarge"],
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
  render: (_args) => (
    <div className="space-y-4">
      <div className="space-x-4">
        <Button {..._args} variant="default">
          Default
        </Button>
        <Button {..._args} variant="secondary">
          Secondary
        </Button>
        <Button {..._args} variant="primary">
          Primary
        </Button>
        <Button {..._args} variant="outlined">
          Outlined
        </Button>
        <Button {..._args} variant="dark">
          Dark
        </Button>
        <Button {..._args} variant="inverse">
          Inverse
        </Button>
        <Button {..._args} variant="ghost">
          Ghost
        </Button>
        <Button {..._args} variant="danger">
          Danger
        </Button>
        <Button {..._args} variant="danger-inverse">
          Danger Inverse
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
  render: (_args) => (
    <div className="space-y-4">
      <div className="space-x-4">
        <Button {..._args} size="xsmall">
          XSmall
        </Button>
        <Button {..._args} size="small">
          Small
        </Button>
        <Button {..._args} size="medium">
          Medium
        </Button>
        <Button {..._args} size="large">
          Large
        </Button>
        <Button {..._args} size="xlarge">
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
  render: (_args) => (
    <div className="space-y-4">
      <div className="space-x-4">
        <Button {..._args}>Normal</Button>
        <Button {..._args} disabled>
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
          <Button size="medium">Medium</Button>
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
          <Button variant="secondary" size="medium">
            Medium
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
        <h3 className="text-white font-semibold mb-3">Primary Variant</h3>
        <div className="space-x-4">
          <Button variant="primary" size="xsmall">
            XSmall
          </Button>
          <Button variant="primary" size="small">
            Small
          </Button>
          <Button variant="primary" size="medium">
            Medium
          </Button>
          <Button variant="primary" size="large">
            Large
          </Button>
          <Button variant="primary" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Outlined Variant</h3>
        <div className="space-x-4">
          <Button variant="outlined" size="xsmall">
            XSmall
          </Button>
          <Button variant="outlined" size="small">
            Small
          </Button>
          <Button variant="outlined" size="medium">
            Medium
          </Button>
          <Button variant="outlined" size="large">
            Large
          </Button>
          <Button variant="outlined" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Dark Variant</h3>
        <div className="space-x-4">
          <Button variant="dark" size="xsmall">
            XSmall
          </Button>
          <Button variant="dark" size="small">
            Small
          </Button>
          <Button variant="dark" size="medium">
            Medium
          </Button>
          <Button variant="dark" size="large">
            Large
          </Button>
          <Button variant="dark" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Inverse Variant</h3>
        <div className="space-x-4">
          <Button variant="inverse" size="xsmall">
            XSmall
          </Button>
          <Button variant="inverse" size="small">
            Small
          </Button>
          <Button variant="inverse" size="medium">
            Medium
          </Button>
          <Button variant="inverse" size="large">
            Large
          </Button>
          <Button variant="inverse" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Ghost Variant</h3>
        <div className="space-x-4">
          <Button variant="ghost" size="xsmall">
            XSmall
          </Button>
          <Button variant="ghost" size="small">
            Small
          </Button>
          <Button variant="ghost" size="medium">
            Medium
          </Button>
          <Button variant="ghost" size="large">
            Large
          </Button>
          <Button variant="ghost" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Danger Variant</h3>
        <div className="space-x-4">
          <Button variant="danger" size="xsmall">
            XSmall
          </Button>
          <Button variant="danger" size="small">
            Small
          </Button>
          <Button variant="danger" size="medium">
            Medium
          </Button>
          <Button variant="danger" size="large">
            Large
          </Button>
          <Button variant="danger" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Danger Inverse Variant</h3>
        <div className="space-x-4">
          <Button variant="danger-inverse" size="xsmall">
            XSmall
          </Button>
          <Button variant="danger-inverse" size="small">
            Small
          </Button>
          <Button variant="danger-inverse" size="medium">
            Medium
          </Button>
          <Button variant="danger-inverse" size="large">
            Large
          </Button>
          <Button variant="danger-inverse" size="xlarge">
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
          <Button variant="primary" size="large" disabled>
            Primary Disabled
          </Button>
          <Button variant="outlined" size="large" disabled>
            Outlined Disabled
          </Button>
          <Button variant="dark" size="large" disabled>
            Dark Disabled
          </Button>
          <Button variant="inverse" size="large" disabled>
            Inverse Disabled
          </Button>
          <Button variant="ghost" size="large" disabled>
            Ghost Disabled
          </Button>
          <Button variant="danger" size="large" disabled>
            Danger Disabled
          </Button>
          <Button variant="danger-inverse" size="large" disabled>
            Danger Inverse Disabled
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
