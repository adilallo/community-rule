import React from "react";
import RadioGroup from "../app/components/RadioGroup";
import { expect } from "@storybook/test";
import { userEvent, within } from "@storybook/test";

// Interaction functions for Storybook play functions
const DefaultInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioGroup = canvas.getByRole("radiogroup");
    const radioButtons = canvas.getAllByRole("radio");
    await expect(radioGroup).toBeInTheDocument();
    await expect(radioButtons).toHaveLength(3);
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "false");
    await expect(radioButtons[2]).toHaveAttribute("aria-checked", "false");
  },
};

const StandardInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioGroup = canvas.getByRole("radiogroup");
    const radioButtons = canvas.getAllByRole("radio");
    await expect(radioGroup).toBeInTheDocument();
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "false");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons[2]).toHaveAttribute("aria-checked", "false");
    await userEvent.click(radioButtons[0]);
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "false");
    await expect(radioButtons[2]).toHaveAttribute("aria-checked", "false");
  },
};

const InverseInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioGroup = canvas.getByRole("radiogroup");
    const radioButtons = canvas.getAllByRole("radio");
    await expect(radioGroup).toBeInTheDocument();
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "false");
    await expect(radioButtons[2]).toHaveAttribute("aria-checked", "false");
    await userEvent.click(radioButtons[1]);
    await expect(radioButtons[0]).toHaveAttribute("aria-checked", "false");
    await expect(radioButtons[1]).toHaveAttribute("aria-checked", "true");
    await expect(radioButtons[2]).toHaveAttribute("aria-checked", "false");
  },
};

const InteractiveInteraction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radioGroup = canvas.getByRole("radiogroup");
    const radioButtons = canvas.getAllByRole("radio");
    await expect(radioGroup).toBeInTheDocument();
    await expect(canvas.getByText("Selected: option1")).toBeVisible();
    await userEvent.click(radioButtons[1]);
    await expect(canvas.getByText("Selected: option2")).toBeVisible();
    await userEvent.click(radioButtons[2]);
    await expect(canvas.getByText("Selected: option3")).toBeVisible();
  },
};

const meta = {
  title: "Forms/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "black" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: { type: "select" },
      options: ["standard", "inverse"],
    },
    state: {
      control: { type: "select" },
      options: ["default", "hover", "focus"],
    },
    value: { control: "text" },
  },
  args: {
    mode: "standard",
    state: "default",
    value: "option1",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ],
  },
};

export default meta;

export const Default = {
  args: {
    mode: "standard",
    state: "default",
    value: "option1",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ],
  },
  play: DefaultInteraction.play,
  render: (args) => {
    const [value, setValue] = React.useState(args.value);
    return (
      <RadioGroup
        {...args}
        value={value}
        onChange={({ value: newValue }) => setValue(newValue)}
      />
    );
  },
};

export const Standard = {
  render: () => {
    const [value, setValue] = React.useState("option2");

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-white font-medium">Standard Mode</h3>
          <RadioGroup
            name="standard-example"
            value={value}
            mode="standard"
            options={[
              { value: "option1", label: "Option 1" },
              { value: "option2", label: "Option 2" },
              { value: "option3", label: "Option 3" },
            ]}
            onChange={({ value: newValue }) => setValue(newValue)}
          />
        </div>
      </div>
    );
  },
  play: StandardInteraction.play,
};

export const Inverse = {
  render: () => {
    const [value, setValue] = React.useState("option1");

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-white font-medium">Inverse Mode</h3>
          <RadioGroup
            name="inverse-example"
            value={value}
            mode="inverse"
            options={[
              { value: "option1", label: "Option 1" },
              { value: "option2", label: "Option 2" },
              { value: "option3", label: "Option 3" },
            ]}
            onChange={({ value: newValue }) => setValue(newValue)}
          />
        </div>
      </div>
    );
  },
  play: InverseInteraction.play,
};

export const Interactive = {
  render: () => {
    const [value, setValue] = React.useState("option1");

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-white font-medium">Interactive Example</h3>
          <p className="text-gray-400 text-sm">Selected: {value}</p>
          <RadioGroup
            name="interactive-example"
            value={value}
            mode="standard"
            options={[
              { value: "option1", label: "Option 1" },
              { value: "option2", label: "Option 2" },
              { value: "option3", label: "Option 3" },
            ]}
            onChange={({ value }) => setValue(value)}
          />
        </div>
      </div>
    );
  },
  play: InteractiveInteraction.play,
};
