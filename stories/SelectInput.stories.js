import React, { useState } from "react";
import SelectInput from "../app/components/SelectInput";

export default {
  title: "Forms/SelectInput",
  component: SelectInput,
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
      options: ["default", "hover", "focus", "error", "disabled"],
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

export const Default = Template.bind({});
Default.args = {
  label: "Default Select Input",
  placeholder: "Select",
};

export const Small = Template.bind({});
Small.args = {
  label: "Small Select Input",
  size: "small",
  placeholder: "Select",
};

export const Medium = Template.bind({});
Medium.args = {
  label: "Medium Select Input",
  size: "medium",
  placeholder: "Select",
};

export const Large = Template.bind({});
Large.args = {
  label: "Large Select Input",
  size: "large",
  placeholder: "Select",
};

export const DefaultLabel = Template.bind({});
DefaultLabel.args = {
  label: "Default (Top Label)",
  labelVariant: "default",
  placeholder: "Select",
};

export const HorizontalLabel = Template.bind({});
HorizontalLabel.args = {
  label: "Horizontal (Left Label)",
  labelVariant: "horizontal",
  placeholder: "Select",
};

export const Active = Template.bind({});
Active.args = {
  label: "Active State",
  state: "default",
  placeholder: "Select",
};

export const Hover = Template.bind({});
Hover.args = {
  label: "Hover State",
  state: "hover",
  placeholder: "Select",
};

export const Focus = Template.bind({});
Focus.args = {
  label: "Focus State",
  state: "focus",
  placeholder: "Select",
};

export const Error = Template.bind({});
Error.args = {
  label: "Error State",
  error: true,
  placeholder: "Select",
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: "Disabled State",
  disabled: true,
  placeholder: "Select",
};

export const Interactive = Template.bind({});
Interactive.args = {
  label: "Interactive Select Input",
  placeholder: "Choose an option",
};

// Comparison stories
export const AllSizes = () => {
  const [smallValue, setSmallValue] = useState("");
  const [mediumValue, setMediumValue] = useState("");
  const [largeValue, setLargeValue] = useState("");

  return (
    <div className="space-y-4">
      <SelectInput
        label="Small"
        size="small"
        value={smallValue}
        onChange={(data) => setSmallValue(data.target.value)}
        placeholder="Select"
        options={[
          { value: "item1", label: "Context Menu Item 1" },
          { value: "item2", label: "Context Menu Item 2" },
          { value: "item3", label: "Context Menu Item 3" },
        ]}
      />
      <SelectInput
        label="Medium"
        size="medium"
        value={mediumValue}
        onChange={(data) => setMediumValue(data.target.value)}
        placeholder="Select"
        options={[
          { value: "item1", label: "Context Menu Item 1" },
          { value: "item2", label: "Context Menu Item 2" },
          { value: "item3", label: "Context Menu Item 3" },
        ]}
      />
      <SelectInput
        label="Large"
        size="large"
        value={largeValue}
        onChange={(data) => setLargeValue(data.target.value)}
        placeholder="Select"
        options={[
          { value: "item1", label: "Context Menu Item 1" },
          { value: "item2", label: "Context Menu Item 2" },
          { value: "item3", label: "Context Menu Item 3" },
        ]}
      />
    </div>
  );
};

export const AllStates = () => {
  const [defaultValue, setDefaultValue] = useState("");
  const [errorValue, setErrorValue] = useState("");
  const [disabledValue, setDisabledValue] = useState("");

  return (
    <div className="space-y-4">
      <SelectInput
        label="Default State"
        value={defaultValue}
        onChange={(data) => setDefaultValue(data.target.value)}
        placeholder="Select"
        options={[
          { value: "item1", label: "Context Menu Item 1" },
          { value: "item2", label: "Context Menu Item 2" },
          { value: "item3", label: "Context Menu Item 3" },
        ]}
      />
      <SelectInput
        label="Error State"
        error={true}
        value={errorValue}
        onChange={(data) => setErrorValue(data.target.value)}
        placeholder="Select"
        options={[
          { value: "item1", label: "Context Menu Item 1" },
          { value: "item2", label: "Context Menu Item 2" },
          { value: "item3", label: "Context Menu Item 3" },
        ]}
      />
      <SelectInput
        label="Disabled State"
        disabled={true}
        value={disabledValue}
        onChange={(data) => setDisabledValue(data.target.value)}
        placeholder="Select"
        options={[
          { value: "item1", label: "Context Menu Item 1" },
          { value: "item2", label: "Context Menu Item 2" },
          { value: "item3", label: "Context Menu Item 3" },
        ]}
      />
    </div>
  );
};
