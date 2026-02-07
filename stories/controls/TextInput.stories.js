import React from "react";
import TextInput from "../../app/components/controls/TextInput";

export default {
  title: "Components/Controls/TextInput",
  component: TextInput,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
    labelVariant: {
      control: { type: "select" },
      options: ["default", "horizontal"],
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
  size: "medium",
  labelVariant: "default",
  state: "default",
};

// Size variants
export const Small = Template.bind({});
Small.args = {
  label: "Small Text Input",
  placeholder: "Small size",
  size: "small",
  labelVariant: "default",
  state: "default",
};

export const Medium = Template.bind({});
Medium.args = {
  label: "Medium Text Input",
  placeholder: "Medium size",
  size: "medium",
  labelVariant: "default",
  state: "default",
};

export const Large = Template.bind({});
Large.args = {
  label: "Large Text Input",
  placeholder: "Large size",
  size: "large",
  labelVariant: "default",
  state: "default",
};

// Label variants
export const DefaultLabel = Template.bind({});
DefaultLabel.args = {
  label: "Default Label (Top)",
  placeholder: "Top label",
  size: "medium",
  labelVariant: "default",
  state: "default",
};

export const HorizontalLabel = Template.bind({});
HorizontalLabel.args = {
  label: "Horizontal Label",
  placeholder: "Left label",
  size: "medium",
  labelVariant: "horizontal",
  state: "default",
};

// States
export const Active = Template.bind({});
Active.args = {
  label: "Active State",
  placeholder: "Active input",
  size: "medium",
  labelVariant: "default",
  state: "active",
};

export const Hover = Template.bind({});
Hover.args = {
  label: "Hover State",
  placeholder: "Hover input",
  size: "medium",
  labelVariant: "default",
  state: "hover",
};

export const Focus = Template.bind({});
Focus.args = {
  label: "Focus State",
  placeholder: "Focused input",
  size: "medium",
  labelVariant: "default",
  state: "focus",
};

export const Error = Template.bind({});
Error.args = {
  label: "Error State",
  placeholder: "Error input",
  size: "medium",
  labelVariant: "default",
  state: "default",
  error: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: "Disabled State",
  placeholder: "Disabled input",
  size: "medium",
  labelVariant: "default",
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
  size: "medium",
  labelVariant: "default",
  state: "default",
};

// All sizes comparison
export const AllSizes = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">Small Size</h3>
      <div className="space-y-4">
        <TextInput
          label="Small Default"
          placeholder="Small with top label"
          size="small"
          labelVariant="default"
        />
      </div>
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-4">Medium Size</h3>
      <div className="space-y-4">
        <TextInput
          label="Medium Default"
          placeholder="Medium with top label"
          size="medium"
          labelVariant="default"
        />
        <TextInput
          label="Medium Horizontal"
          placeholder="Medium with left label"
          size="medium"
          labelVariant="horizontal"
        />
      </div>
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-4">Large Size</h3>
      <div className="space-y-4">
        <TextInput
          label="Large Default"
          placeholder="Large with top label"
          size="large"
          labelVariant="default"
        />
        <TextInput
          label="Large Horizontal"
          placeholder="Large with left label"
          size="large"
          labelVariant="horizontal"
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
          size="medium"
          state="default"
        />
        <TextInput
          label="Active State"
          placeholder="Active input"
          size="medium"
          state="active"
        />
        <TextInput
          label="Hover State"
          placeholder="Hover input"
          size="medium"
          state="hover"
        />
        <TextInput
          label="Focus State"
          placeholder="Focused input"
          size="medium"
          state="focus"
        />
        <TextInput
          label="Error State"
          placeholder="Error input"
          size="medium"
          error={true}
        />
        <TextInput
          label="Disabled State"
          placeholder="Disabled input"
          size="medium"
          disabled={true}
        />
      </div>
    </div>
  </div>
);
