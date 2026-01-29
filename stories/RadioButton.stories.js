import React from "react";
import RadioButton from "../app/components/RadioButton";
import { expect } from "@storybook/test";
import { userEvent, within } from "@storybook/test";

// Interaction functions for Storybook play functions
const DefaultInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioButton = canvas.getByRole("radio");
    await expect(radioButton).toHaveAttribute("aria-checked", "false");
    await userEvent.click(radioButton);
    await expect(radioButton).toHaveAttribute("aria-checked", "true");
    await userEvent.click(radioButton);
    await expect(radioButton).toHaveAttribute("aria-checked", "true");
  },
};

const CheckedInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioButton = canvas.getByRole("radio");
    await expect(radioButton).toHaveAttribute("aria-checked", "true");
    await userEvent.click(radioButton);
    await expect(radioButton).toHaveAttribute("aria-checked", "true");
  },
};

const StandardInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioButtons = canvas.getAllByRole("radio");
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "false");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "true");
    await userEvent.click(radioButtons[0]);
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "false");
  },
};

const InverseInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioButtons = canvas.getAllByRole("radio");
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "false");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "true");
    await userEvent.click(radioButtons[0]);
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "false");
  },
};

const meta = {
  title: "Forms/RadioButton",
  component: RadioButton,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "black" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    mode: {
      control: { type: "select" },
      options: ["standard", "inverse"],
    },
    state: {
      control: { type: "select" },
      options: ["default", "hover", "focus"],
    },
    label: { control: "text" },
  },
  args: {
    checked: false,
    mode: "standard",
    state: "default",
    label: "Radio Button Label",
  },
};

export default meta;

export const Default = {
  args: {
    checked: false,
    mode: "standard",
    state: "default",
    label: "Default radio button",
  },
  play: DefaultInteraction.play,
  render: (args) => {
    const [checked, setChecked] = React.useState(args.checked);
    return (
      <RadioButton
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
    label: "Checked radio button",
  },
  play: CheckedInteraction.play,
  render: (args) => {
    const [checked, setChecked] = React.useState(args.checked);
    return (
      <RadioButton
        {...args}
        checked={checked}
        onChange={({ checked: newChecked }) => setChecked(newChecked)}
      />
    );
  },
};

export const Standard = {
  render: () => {
    const [selectedValue, setSelectedValue] = React.useState("checked");

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-white font-medium">Standard Mode</h3>
          <div className="flex flex-col gap-2">
            <RadioButton
              label="Unchecked"
              checked={selectedValue === "unchecked"}
              name="standard-example"
              value="unchecked"
              mode="standard"
              onChange={({ checked }) => {
                if (checked) setSelectedValue("unchecked");
              }}
            />
            <RadioButton
              label="Checked"
              checked={selectedValue === "checked"}
              name="standard-example"
              value="checked"
              mode="standard"
              onChange={({ checked }) => {
                if (checked) setSelectedValue("checked");
              }}
            />
          </div>
        </div>
      </div>
    );
  },
  play: StandardInteraction.play,
};

export const Inverse = {
  render: () => {
    const [selectedValue, setSelectedValue] = React.useState("checked");

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-white font-medium">Inverse Mode</h3>
          <div className="flex flex-col gap-2">
            <RadioButton
              label="Unchecked"
              checked={selectedValue === "unchecked"}
              name="inverse-example"
              value="unchecked"
              mode="inverse"
              onChange={({ checked }) => {
                if (checked) setSelectedValue("unchecked");
              }}
            />
            <RadioButton
              label="Checked"
              checked={selectedValue === "checked"}
              name="inverse-example"
              value="checked"
              mode="inverse"
              onChange={({ checked }) => {
                if (checked) setSelectedValue("checked");
              }}
            />
          </div>
        </div>
      </div>
    );
  },
  play: InverseInteraction.play,
};
