import React from "react";
import IncrementerBlock from "../../app/components/controls/IncrementerBlock";

export default {
  title: "Components/Controls/IncrementerBlock",
  component: IncrementerBlock,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Labelled incrementer: pairs `InputLabel` with `Incrementer`. Figma: `Control / Incrementer Block` (19883:13283). Matches the grouped-field pattern used by `CheckboxGroup` / `RadioGroup`.",
      },
    },
  },
  argTypes: {
    label: {
      control: { type: "text" },
      description: "Label rendered above the incrementer.",
    },
    helpIcon: {
      control: { type: "boolean" },
      description: "Show the help (?) icon next to the label.",
    },
    asterisk: {
      control: { type: "boolean" },
      description: "Show an asterisk indicating a required field.",
    },
    helperText: {
      control: { type: "text" },
      description:
        "Helper text shown to the right of the label. Pass `true` to render the default 'Optional text'.",
    },
    labelSize: {
      control: { type: "select" },
      options: ["s", "m"],
      description: "Size of the label (Figma prop).",
    },
    palette: {
      control: { type: "select" },
      options: ["default", "inverse"],
      description: "Label palette.",
    },
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    step: { control: { type: "number" } },
    disabled: { control: { type: "boolean" } },
    onChange: { action: "change" },
  },
  tags: ["autodocs"],
};

export const Default = {
  render: (args) => {
    const [value, setValue] = React.useState(args.value ?? 75);
    return <IncrementerBlock {...args} value={value} onChange={setValue} />;
  },
  args: {
    label: "Consensus level",
    helpIcon: true,
    value: 75,
    min: 0,
    max: 100,
    step: 5,
  },
};

export const Required = {
  render: () => {
    const [value, setValue] = React.useState(50);
    return (
      <IncrementerBlock
        label="Quorum percentage"
        asterisk
        helperText="Required"
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        step={5}
      />
    );
  },
};

export const WithFormattedValue = {
  render: () => {
    const [value, setValue] = React.useState(75);
    return (
      <IncrementerBlock
        label="Consensus level"
        helperText="Optional"
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        step={5}
        formatValue={(n) => `${n}%`}
      />
    );
  },
};

export const Disabled = {
  render: () => (
    <IncrementerBlock
      label="Consensus level"
      value={75}
      onChange={() => {}}
      disabled
    />
  ),
};
