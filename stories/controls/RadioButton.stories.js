import React from "react";
import RadioButton from "../../app/components/controls/RadioButton";

export default {
  title: "Components/Controls/RadioButton",
  component: RadioButton,
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
      description: "Whether the radio button is checked",
    },
    mode: {
      control: "select",
      options: ["standard", "inverse", "Standard", "Inverse"],
      description: "Visual mode of the radio button (case-insensitive: accepts both lowercase and PascalCase)",
    },
    state: {
      control: "select",
      options: ["default", "hover", "focus", "selected", "Default", "Hover", "Focus", "Selected"],
      description: "Interaction state for static display (case-insensitive: accepts both lowercase and PascalCase)",
    },
    disabled: {
      control: "boolean",
      description: "Whether the radio button is disabled",
    },
    label: {
      control: "text",
      description: "Label text for the radio button",
    },
  },
};

export const Default = {
  args: {
    checked: false,
    mode: "standard",
    state: "default",
    disabled: false,
    label: "Default radio button",
  },
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
    disabled: false,
    label: "Checked radio button",
  },
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
    const [checked, setChecked] = React.useState(false);

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-white font-medium">Standard Mode</h3>
          <div className="flex flex-col gap-2">
            <RadioButton
              label="Standard Radio Button"
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
            <RadioButton
              label="Inverse Radio Button"
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
    label: "Disabled radio button",
  },
  render: (args) => <RadioButton {...args} />,
};

export const DisabledChecked = {
  args: {
    checked: true,
    mode: "standard",
    state: "default",
    disabled: true,
    label: "Disabled checked radio button",
  },
  render: (args) => <RadioButton {...args} />,
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
          <RadioButton
            label="Standard Radio Button"
            checked={standardChecked}
            mode="standard"
            onChange={({ checked }) => setStandardChecked(checked)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Inverse Mode</h3>
        <div className="space-y-4">
          <RadioButton
            label="Inverse Radio Button"
            checked={inverseChecked}
            mode="inverse"
            onChange={({ checked }) => setInverseChecked(checked)}
          />
        </div>
      </div>
    </div>
  );
};

// All states for standard mode
export const StandardAllStates = () => {
  const [unchecked, setUnchecked] = React.useState(false);
  const [checked, setChecked] = React.useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Standard Mode - Unselected</h3>
        <div className="space-y-4">
          <RadioButton
            label="Unselected (default, hover, focus)"
            checked={unchecked}
            mode="standard"
            onChange={({ checked }) => setUnchecked(checked)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Standard Mode - Selected</h3>
        <div className="space-y-4">
          <RadioButton
            label="Selected (default, hover, focus)"
            checked={checked}
            mode="standard"
            onChange={({ checked }) => setChecked(checked)}
          />
        </div>
      </div>
    </div>
  );
};

// All states for inverse mode
export const InverseAllStates = () => {
  const [unchecked, setUnchecked] = React.useState(false);
  const [checked, setChecked] = React.useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Inverse Mode - Unselected</h3>
        <div className="space-y-4">
          <RadioButton
            label="Unselected (default, hover, focus)"
            checked={unchecked}
            mode="inverse"
            onChange={({ checked }) => setUnchecked(checked)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Inverse Mode - Selected</h3>
        <div className="space-y-4">
          <RadioButton
            label="Selected (default, hover, focus)"
            checked={checked}
            mode="inverse"
            onChange={({ checked }) => setChecked(checked)}
          />
        </div>
      </div>
    </div>
  );
};

// Test PascalCase props from Figma
export const FigmaPascalCase = () => {
  const [standardChecked, setStandardChecked] = React.useState(false);
  const [inverseChecked, setInverseChecked] = React.useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Figma PascalCase Props (Standard/Inverse)</h3>
        <p className="text-sm text-gray-400 mb-4">
          These components accept both PascalCase (from Figma) and lowercase (from codebase) prop values.
        </p>
        <div className="space-y-4">
          <RadioButton
            label="Standard Mode (PascalCase)"
            checked={standardChecked}
            mode="Standard"
            state="Default"
            onChange={({ checked }) => setStandardChecked(checked)}
          />
          <RadioButton
            label="Inverse Mode (PascalCase)"
            checked={inverseChecked}
            mode="Inverse"
            state="Default"
            onChange={({ checked }) => setInverseChecked(checked)}
          />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Mixed Case (backward compatibility)</h3>
        <div className="space-y-4">
          <RadioButton
            label="Standard mode (lowercase) - still works"
            checked={false}
            mode="standard"
            state="default"
          />
          <RadioButton
            label="Inverse Mode (mixed) - still works"
            checked={false}
            mode="inverse"
            state="Default"
          />
        </div>
      </div>
    </div>
  );
};
