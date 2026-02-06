import React, { useState } from "react";
import SelectInput from "../../app/components/controls/SelectInput";

export default {
  title: "Components/Controls/SelectInput",
  component: SelectInput,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["default", "active", "focus"],
    },
    disabled: {
      control: { type: "boolean" },
    },
    error: {
      control: { type: "boolean" },
    },
    placeholder: {
      control: { type: "text" },
    },
    label: {
      control: { type: "text" },
    },
  },
};

const Template = (args) => {
  const [value, setValue] = useState("");
  return (
    <SelectInput
      {...args}
      value={value}
      onChange={(data) => setValue(data.target.value)}
      options={[
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
      ]}
    />
  );
};

// Default story
export const Default = Template.bind({});
Default.args = {
  label: "Default Select Input",
  placeholder: "Choose an option",
  state: "default",
};

// States
export const Active = Template.bind({});
Active.args = {
  label: "Active State",
  placeholder: "Choose an option",
  state: "active",
};

export const Focus = Template.bind({});
Focus.args = {
  label: "Focus State",
  placeholder: "Choose an option",
  state: "focus",
};

export const Error = Template.bind({});
Error.args = {
  label: "Error State",
  placeholder: "Choose an option",
  error: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: "Disabled State",
  placeholder: "Choose an option",
  disabled: true,
};

// Interactive example
export const Interactive = (args) => {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-4">
      <SelectInput
        {...args}
        value={value}
        onChange={(data) => setValue(data.target.value)}
        options={[
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
          { value: "option3", label: "Option 3" },
        ]}
      />
      <p className="text-sm text-gray-600">Current value: "{value}"</p>
    </div>
  );
};
Interactive.args = {
  label: "Interactive Select Input",
  placeholder: "Choose an option",
  state: "default",
};

// All states comparison
export const AllStates = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">Select Input States</h3>
      <div className="space-y-4">
        <SelectInput
          label="Default State"
          placeholder="Choose an option"
          value=""
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ]}
        />
        <SelectInput
          label="Active State"
          placeholder="Choose an option"
          state="active"
          value=""
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ]}
        />
        <SelectInput
          label="Focus State"
          placeholder="Choose an option"
          state="focus"
          value=""
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ]}
        />
        <SelectInput
          label="Error State"
          placeholder="Choose an option"
          error={true}
          value=""
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ]}
        />
        <SelectInput
          label="Disabled State"
          placeholder="Choose an option"
          disabled={true}
          value=""
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ]}
        />
      </div>
    </div>
  </div>
);
