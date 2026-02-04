import React from "react";
import Checkbox from "../app/components/Checkbox";
import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";

// Interaction functions for Storybook play functions
const DefaultInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  },
};

const CheckedInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  },
};

export default {
  title: "Forms/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#000000" },
      ],
    },
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "Whether the checkbox is checked",
    },
    mode: {
      control: "select",
      options: ["standard", "inverse"],
      description: "Visual mode of the checkbox",
    },
    state: {
      control: "select",
      options: ["default", "hover", "focus"],
      description: "Interaction state for static display",
    },
    disabled: {
      control: "boolean",
      description: "Whether the checkbox is disabled",
    },
    label: {
      control: "text",
      description: "Label text for the checkbox",
    },
  },
};

export const Default = {
  args: {
    checked: false,
    mode: "standard",
    state: "default",
    disabled: false,
    label: "Default checkbox",
  },
  play: DefaultInteraction.play,
  render: (args) => {
    const [checked, setChecked] = React.useState(args.checked);
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={({ checked: newChecked }) => setChecked(newChecked)}
      />
    );
  },
};

export const Checked = {
  args: {
    checked: true,
    mode: "standard",
    state: "default",
    disabled: false,
    label: "Checked checkbox",
  },
  play: CheckedInteraction.play,
  render: (args) => {
    const [checked, setChecked] = React.useState(args.checked);
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={({ checked: newChecked }) => setChecked(newChecked)}
      />
    );
  },
};

export const Standard = {
  render: () => {
    const [checked, setChecked] = React.useState(false);

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-white font-medium">Standard Mode</h3>
          <div className="flex flex-col gap-2">
            <Checkbox
              label="Standard Checkbox"
              checked={checked}
              mode="standard"
              onChange={({ checked: newChecked }) => setChecked(newChecked)}
            />
          </div>
        </div>
      </div>
    );
  },
};

export const Inverse = {
  render: () => {
    const [checked, setChecked] = React.useState(false);

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-white font-medium">Inverse Mode</h3>
          <div className="flex flex-col gap-2">
            <Checkbox
              label="Inverse Checkbox"
              checked={checked}
              mode="inverse"
              onChange={({ checked: newChecked }) => setChecked(newChecked)}
            />
          </div>
        </div>
      </div>
    );
  },
};

export const Disabled = {
  args: {
    checked: false,
    mode: "standard",
    state: "default",
    disabled: true,
    label: "Disabled checkbox",
  },
  render: (args) => <Checkbox {...args} />,
};

export const DisabledChecked = {
  args: {
    checked: true,
    mode: "standard",
    state: "default",
    disabled: true,
    label: "Disabled checked checkbox",
  },
  render: (args) => <Checkbox {...args} />,
};

// All modes comparison
export const AllModes = () => {
  const [standardChecked, setStandardChecked] = React.useState(false);
  const [inverseChecked, setInverseChecked] = React.useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Standard Mode</h3>
        <div className="space-y-4">
          <Checkbox
            label="Standard Checkbox"
            checked={standardChecked}
            mode="standard"
            onChange={({ checked }) => setStandardChecked(checked)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Inverse Mode</h3>
        <div className="space-y-4">
          <Checkbox
            label="Inverse Checkbox"
            checked={inverseChecked}
            mode="inverse"
            onChange={({ checked }) => setInverseChecked(checked)}
          />
        </div>
      </div>
    </div>
  );
};
