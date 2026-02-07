import Button from "../../app/components/buttons/Button";

export default {
  title: "Components/Buttons/Button",
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
    buttonType: {
      control: { type: "select" },
      options: ["filled", "outline", "ghost", "danger"],
      description: "The button type (Figma prop)",
    },
    palette: {
      control: { type: "select" },
      options: ["default", "inverse"],
      description: "The button palette (Figma prop)",
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
        <Button {..._args} buttonType="filled" palette="default">
          Filled
        </Button>
        <Button {..._args} buttonType="filled" palette="inverse">
          Filled Inverse
        </Button>
        <Button {..._args} buttonType="outline" palette="default">
          Outline
        </Button>
        <Button {..._args} buttonType="outline" palette="inverse">
          Outline Inverse
        </Button>
        <Button {..._args} buttonType="ghost" palette="default">
          Ghost
        </Button>
        <Button {..._args} buttonType="ghost" palette="inverse">
          Ghost Inverse
        </Button>
        <Button {..._args} buttonType="danger" palette="default">
          Danger
        </Button>
        <Button {..._args} buttonType="danger" palette="inverse">
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
    buttonType: "filled",
    palette: "default",
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
    buttonType: "filled",
    palette: "default",
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
          <Button buttonType="filled" palette="default" size="xsmall">
            XSmall
          </Button>
          <Button buttonType="filled" palette="default" size="small">
            Small
          </Button>
          <Button buttonType="filled" palette="default" size="medium">
            Medium
          </Button>
          <Button buttonType="filled" palette="default" size="large">
            Large
          </Button>
          <Button buttonType="filled" palette="default" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Filled Inverse Variant</h3>
        <div className="space-x-4">
          <Button buttonType="filled" palette="inverse" size="xsmall">
            XSmall
          </Button>
          <Button buttonType="filled" palette="inverse" size="small">
            Small
          </Button>
          <Button buttonType="filled" palette="inverse" size="medium">
            Medium
          </Button>
          <Button buttonType="filled" palette="inverse" size="large">
            Large
          </Button>
          <Button buttonType="filled" palette="inverse" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Outline Variant</h3>
        <div className="space-x-4">
          <Button buttonType="outline" palette="default" size="xsmall">
            XSmall
          </Button>
          <Button buttonType="outline" palette="default" size="small">
            Small
          </Button>
          <Button buttonType="outline" palette="default" size="medium">
            Medium
          </Button>
          <Button buttonType="outline" palette="default" size="large">
            Large
          </Button>
          <Button buttonType="outline" palette="default" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Outline Inverse Variant</h3>
        <div className="space-x-4">
          <Button buttonType="outline" palette="inverse" size="xsmall">
            XSmall
          </Button>
          <Button buttonType="outline" palette="inverse" size="small">
            Small
          </Button>
          <Button buttonType="outline" palette="inverse" size="medium">
            Medium
          </Button>
          <Button buttonType="outline" palette="inverse" size="large">
            Large
          </Button>
          <Button buttonType="outline" palette="inverse" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Ghost Variant</h3>
        <div className="space-x-4">
          <Button buttonType="ghost" palette="default" size="xsmall">
            XSmall
          </Button>
          <Button buttonType="ghost" palette="default" size="small">
            Small
          </Button>
          <Button buttonType="ghost" palette="default" size="medium">
            Medium
          </Button>
          <Button buttonType="ghost" palette="default" size="large">
            Large
          </Button>
          <Button buttonType="ghost" palette="default" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Ghost Inverse Variant</h3>
        <div className="space-x-4">
          <Button buttonType="ghost" palette="inverse" size="xsmall">
            XSmall
          </Button>
          <Button buttonType="ghost" palette="inverse" size="small">
            Small
          </Button>
          <Button buttonType="ghost" palette="inverse" size="medium">
            Medium
          </Button>
          <Button buttonType="ghost" palette="inverse" size="large">
            Large
          </Button>
          <Button buttonType="ghost" palette="inverse" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Danger Variant</h3>
        <div className="space-x-4">
          <Button buttonType="danger" palette="default" size="xsmall">
            XSmall
          </Button>
          <Button buttonType="danger" palette="default" size="small">
            Small
          </Button>
          <Button buttonType="danger" palette="default" size="medium">
            Medium
          </Button>
          <Button buttonType="danger" palette="default" size="large">
            Large
          </Button>
          <Button buttonType="danger" palette="default" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Danger Inverse Variant</h3>
        <div className="space-x-4">
          <Button buttonType="danger" palette="inverse" size="xsmall">
            XSmall
          </Button>
          <Button buttonType="danger" palette="inverse" size="small">
            Small
          </Button>
          <Button buttonType="danger" palette="inverse" size="medium">
            Medium
          </Button>
          <Button buttonType="danger" palette="inverse" size="large">
            Large
          </Button>
          <Button buttonType="danger" palette="inverse" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Disabled States</h3>
        <div className="space-x-4">
          <Button buttonType="filled" palette="default" size="large" disabled>
            Filled Disabled
          </Button>
          <Button buttonType="filled" palette="inverse" size="large" disabled>
            Filled Inverse Disabled
          </Button>
          <Button buttonType="outline" palette="default" size="large" disabled>
            Outline Disabled
          </Button>
          <Button buttonType="outline" palette="inverse" size="large" disabled>
            Outline Inverse Disabled
          </Button>
          <Button buttonType="ghost" palette="default" size="large" disabled>
            Ghost Disabled
          </Button>
          <Button buttonType="ghost" palette="inverse" size="large" disabled>
            Ghost Inverse Disabled
          </Button>
          <Button buttonType="danger" palette="default" size="large" disabled>
            Danger Disabled
          </Button>
          <Button buttonType="danger" palette="inverse" size="large" disabled>
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
