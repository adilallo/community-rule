import React from "react";
import Incrementer from "../../app/components/controls/Incrementer";

export default {
  title: "Components/Controls/Incrementer",
  component: Incrementer,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Compact `[ - value + ]` row for numeric step input. Figma: `Control / Incrementer` (17857:30943). Pair with `IncrementerBlock` when you need a label above.",
      },
    },
  },
  argTypes: {
    value: {
      control: { type: "number" },
      description: "Current numeric value.",
    },
    min: {
      control: { type: "number" },
      description: "Minimum value (default -Infinity).",
    },
    max: {
      control: { type: "number" },
      description: "Maximum value (default Infinity).",
    },
    step: {
      control: { type: "number" },
      description: "Amount added/subtracted per click.",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disable both step buttons.",
    },
    onChange: { action: "change" },
  },
  tags: ["autodocs"],
};

export const Default = {
  render: (args) => {
    const [value, setValue] = React.useState(args.value ?? 50);
    return <Incrementer {...args} value={value} onChange={setValue} />;
  },
  args: {
    value: 50,
  },
};

export const WithBounds = {
  render: (args) => {
    const [value, setValue] = React.useState(50);
    return <Incrementer {...args} value={value} onChange={setValue} />;
  },
  args: {
    min: 0,
    max: 100,
    step: 10,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Clamped to `min`/`max`; the corresponding step button auto-disables at the bounds.",
      },
    },
  },
};

export const PercentageFormatter = {
  render: (args) => {
    const [value, setValue] = React.useState(75);
    return (
      <Incrementer
        {...args}
        value={value}
        onChange={setValue}
        formatValue={(n) => `${n}%`}
      />
    );
  },
  args: {
    min: 0,
    max: 100,
    step: 5,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `formatValue` to render units alongside the number (e.g. `%`, `px`).",
      },
    },
  },
};

export const Disabled = {
  render: () => <Incrementer value={50} onChange={() => {}} disabled />,
};
