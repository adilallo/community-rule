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
        "filled",
        "filled-inverse",
        "outline",
        "outline-inverse",
        "ghost",
        "ghost-inverse",
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
        <Button {..._args} variant="filled">
          Filled
        </Button>
        <Button {..._args} variant="filled-inverse">
          Filled Inverse
        </Button>
        <Button {..._args} variant="outline">
          Outline
        </Button>
        <Button {..._args} variant="outline-inverse">
          Outline Inverse
        </Button>
        <Button {..._args} variant="ghost">
          Ghost
        </Button>
        <Button {..._args} variant="ghost-inverse">
          Ghost Inverse
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
    variant: "filled",
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
    variant: "filled",
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
        <h3 className="text-white font-semibold mb-3">Filled Variant</h3>
        <div className="space-x-4">
          <Button variant="filled" size="xsmall">
            XSmall
          </Button>
          <Button variant="filled" size="small">
            Small
          </Button>
          <Button variant="filled" size="medium">
            Medium
          </Button>
          <Button variant="filled" size="large">
            Large
          </Button>
          <Button variant="filled" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Filled Inverse Variant</h3>
        <div className="space-x-4">
          <Button variant="filled-inverse" size="xsmall">
            XSmall
          </Button>
          <Button variant="filled-inverse" size="small">
            Small
          </Button>
          <Button variant="filled-inverse" size="medium">
            Medium
          </Button>
          <Button variant="filled-inverse" size="large">
            Large
          </Button>
          <Button variant="filled-inverse" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Outline Variant</h3>
        <div className="space-x-4">
          <Button variant="outline" size="xsmall">
            XSmall
          </Button>
          <Button variant="outline" size="small">
            Small
          </Button>
          <Button variant="outline" size="medium">
            Medium
          </Button>
          <Button variant="outline" size="large">
            Large
          </Button>
          <Button variant="outline" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Outline Inverse Variant</h3>
        <div className="space-x-4">
          <Button variant="outline-inverse" size="xsmall">
            XSmall
          </Button>
          <Button variant="outline-inverse" size="small">
            Small
          </Button>
          <Button variant="outline-inverse" size="medium">
            Medium
          </Button>
          <Button variant="outline-inverse" size="large">
            Large
          </Button>
          <Button variant="outline-inverse" size="xlarge">
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
        <h3 className="text-white font-semibold mb-3">Ghost Inverse Variant</h3>
        <div className="space-x-4">
          <Button variant="ghost-inverse" size="xsmall">
            XSmall
          </Button>
          <Button variant="ghost-inverse" size="small">
            Small
          </Button>
          <Button variant="ghost-inverse" size="medium">
            Medium
          </Button>
          <Button variant="ghost-inverse" size="large">
            Large
          </Button>
          <Button variant="ghost-inverse" size="xlarge">
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
          <Button variant="filled" size="large" disabled>
            Filled Disabled
          </Button>
          <Button variant="filled-inverse" size="large" disabled>
            Filled Inverse Disabled
          </Button>
          <Button variant="outline" size="large" disabled>
            Outline Disabled
          </Button>
          <Button variant="outline-inverse" size="large" disabled>
            Outline Inverse Disabled
          </Button>
          <Button variant="ghost" size="large" disabled>
            Ghost Disabled
          </Button>
          <Button variant="ghost-inverse" size="large" disabled>
            Ghost Inverse Disabled
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
