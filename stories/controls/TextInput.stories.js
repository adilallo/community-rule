import React from "react";
import TextInput from "../../app/components/controls/TextInput";

export default {
  title: "Components/Controls/TextInput",
  component: TextInput,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    inputSize: {
      control: { type: "select" },
      options: ["small", "medium", "Small", "Medium"],
    },
    state: {
      control: { type: "select" },
      options: ["default", "active", "hover", "focus", "error", "disabled"],
    },
    disabled: {
      control: { type: "boolean" },
    },
    error: {
      control: { type: "boolean" },
    },
    label: {
      control: { type: "text" },
    },
    placeholder: {
      control: { type: "text" },
    },
    value: {
      control: { type: "text" },
    },
  },
};

const Template = (args) => <TextInput {...args} />;

// Default story
export const Default = Template.bind({});
Default.args = {
  label: "Default Text Input",
  placeholder: "Enter text...",
  inputSize: "medium",
  state: "default",
};

// Size variants
export const Small = Template.bind({});
Small.args = {
  label: "Small Text Input",
  placeholder: "Small size",
  inputSize: "small",
  state: "default",
};

export const Medium = Template.bind({});
Medium.args = {
  label: "Medium Text Input",
  placeholder: "Medium size",
  inputSize: "medium",
  state: "default",
};

// States
export const Active = Template.bind({});
Active.args = {
  label: "Active State",
  placeholder: "Active input",
  inputSize: "medium",
  state: "active",
};

export const Hover = Template.bind({});
Hover.args = {
  label: "Hover State",
  placeholder: "Hover input",
  inputSize: "medium",
  state: "hover",
};

export const Focus = Template.bind({});
Focus.args = {
  label: "Focus State",
  placeholder: "Focused input",
  inputSize: "medium",
  state: "focus",
};

export const Error = Template.bind({});
Error.args = {
  label: "Error State",
  placeholder: "Error input",
  inputSize: "medium",
  state: "default",
  error: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: "Disabled State",
  placeholder: "Disabled input",
  inputSize: "medium",
  state: "default",
  disabled: true,
};

// Interactive example
export const Interactive = (args) => {
  const [value, setValue] = React.useState("");

  return (
    <div className="space-y-4">
      <TextInput
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <p className="text-sm text-gray-600">Current value: "{value}"</p>
    </div>
  );
};
Interactive.args = {
  label: "Interactive Text Input",
  placeholder: "Type something...",
  inputSize: "medium",
  state: "default",
};

// All sizes comparison
export const AllSizes = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">Small Size</h3>
      <div className="space-y-4">
        <TextInput
          label="Small Text Input"
          placeholder="Small size input"
          inputSize="small"
        />
      </div>
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-4">Medium Size</h3>
      <div className="space-y-4">
        <TextInput
          label="Medium Text Input"
          placeholder="Medium size input"
          inputSize="medium"
        />
      </div>
    </div>
  </div>
);

// All states comparison
export const AllStates = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">Text Input States</h3>
      <div className="space-y-4">
        <TextInput
          label="Default State"
          placeholder="Default input"
          inputSize="medium"
          state="default"
        />
        <TextInput
          label="Active State"
          placeholder="Active input"
          inputSize="medium"
          state="active"
        />
        <TextInput
          label="Hover State"
          placeholder="Hover input"
          inputSize="medium"
          state="hover"
        />
        <TextInput
          label="Focus State"
          placeholder="Focused input"
          inputSize="medium"
          state="focus"
        />
        <TextInput
          label="Error State"
          placeholder="Error input"
          inputSize="medium"
          error={true}
        />
        <TextInput
          label="Disabled State"
          placeholder="Disabled input"
          inputSize="medium"
          disabled={true}
        />
      </div>
    </div>
  </div>
);
