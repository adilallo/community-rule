import React from "react";
import InlineTextButton from "../../app/components/buttons/InlineTextButton";

export default {
  title: "Components/Buttons/InlineTextButton",
  component: InlineTextButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Small text-styled button for mid-paragraph 'link'-like controls (expand, add, …). Inherits parent typography and renders with a tertiary-colored underline. Use `Button` for primary/secondary actions.",
      },
    },
  },
  argTypes: {
    children: {
      control: { type: "text" },
      description: "Button label content.",
    },
    disabled: { control: { type: "boolean" } },
    ariaLabel: { control: { type: "text" } },
    onClick: { action: "clicked" },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    children: "Expand",
  },
};

export const InParagraph = {
  render: () => (
    <p className="max-w-md font-inter text-[14px] leading-[20px] text-[color:var(--color-content-default-primary,#fff)]">
      Share a bit more detail so the group can weigh in. You can always{" "}
      <InlineTextButton onClick={() => {}}>expand this later</InlineTextButton>{" "}
      if you need more room.
    </p>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Typography is inherited from the parent, so the button sits naturally inside body copy.",
      },
    },
  },
};

export const Disabled = {
  args: {
    children: "Expand",
    disabled: true,
  },
};
