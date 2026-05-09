import React from "react";
import Icon from "../../app/components/asset/icon";
import Vertical from "../../app/components/buttons/Vertical";

/** Figma: Community Rule System — Vertical button (`19787:10896`). */
export default {
  title: "Components/Buttons/Vertical",
  component: Vertical,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Tile-style control: vertical stack of icon and label with brand-primary border. Used for field-type pickers and similar compact grids.",
      },
    },
  },
  argTypes: {
    disabled: { control: { type: "boolean" } },
    ariaLabel: { control: { type: "text" } },
    onClick: { action: "clicked" },
  },
  decorators: [
    (Story) => (
      <div className="w-[130px] bg-[var(--color-surface-default-primary)] p-4">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export const Default = {
  render: (args) => (
    <Vertical {...args}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center">
        <Icon
          name="number"
          size={32}
          className="text-[var(--color-content-default-brand-primary,#fefcc9)]"
        />
      </span>
      <span className="w-full text-center font-inter text-[14px] font-medium leading-[18px] text-[var(--color-content-default-brand-primary,#fefcc9)]">
        Number
      </span>
    </Vertical>
  ),
};

export const Disabled = {
  render: (args) => (
    <Vertical {...args} disabled ariaLabel="Number (disabled)">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center">
        <Icon
          name="number"
          size={32}
          className="text-[var(--color-content-default-brand-primary,#fefcc9)]"
        />
      </span>
      <span className="w-full text-center font-inter text-[14px] font-medium leading-[18px] text-[var(--color-content-default-brand-primary,#fefcc9)]">
        Number
      </span>
    </Vertical>
  ),
};
