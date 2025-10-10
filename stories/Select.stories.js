import React, { useState } from "react";
import Select from "../app/components/Select";

export default {
  title: "Forms/Select",
  component: Select,
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
    <Select {...args} value={value} onChange={(e) => setValue(e.target.value)}>
      <option value="item1">Context Menu Item 1</option>
      <option value="item2">Context Menu Item 2</option>
      <option value="item3">Context Menu Item 3</option>
    </Select>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: "Default Select",
  placeholder: "Select",
};

export const Small = Template.bind({});
Small.args = {
  label: "Small Select",
  size: "small",
  placeholder: "Select",
};

export const Medium = Template.bind({});
Medium.args = {
  label: "Medium Select",
  size: "medium",
  placeholder: "Select",
};

export const Large = Template.bind({});
Large.args = {
  label: "Large Select",
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
  label: "Interactive Select",
  placeholder: "Choose an option",
};

// Comparison stories
export const AllSizes = () => {
  const [smallValue, setSmallValue] = useState("");
  const [mediumValue, setMediumValue] = useState("");
  const [largeValue, setLargeValue] = useState("");

  return (
    <div className="space-y-4">
      <Select
        label="Small"
        size="small"
        value={smallValue}
        onChange={(e) => setSmallValue(e.target.value)}
        placeholder="Select"
      >
        <option value="item1">Context Menu Item 1</option>
        <option value="item2">Context Menu Item 2</option>
        <option value="item3">Context Menu Item 3</option>
      </Select>
      <Select
        label="Medium"
        size="medium"
        value={mediumValue}
        onChange={(e) => setMediumValue(e.target.value)}
        placeholder="Select"
      >
        <option value="item1">Context Menu Item 1</option>
        <option value="item2">Context Menu Item 2</option>
        <option value="item3">Context Menu Item 3</option>
      </Select>
      <Select
        label="Large"
        size="large"
        value={largeValue}
        onChange={(e) => setLargeValue(e.target.value)}
        placeholder="Select"
      >
        <option value="item1">Context Menu Item 1</option>
        <option value="item2">Context Menu Item 2</option>
        <option value="item3">Context Menu Item 3</option>
      </Select>
    </div>
  );
};

export const AllStates = () => {
  const [defaultValue, setDefaultValue] = useState("");
  const [errorValue, setErrorValue] = useState("");
  const [disabledValue, setDisabledValue] = useState("");

  return (
    <div className="space-y-4">
      <Select
        label="Default State"
        value={defaultValue}
        onChange={(e) => setDefaultValue(e.target.value)}
        placeholder="Select"
      >
        <option value="item1">Context Menu Item 1</option>
        <option value="item2">Context Menu Item 2</option>
        <option value="item3">Context Menu Item 3</option>
      </Select>
      <Select
        label="Error State"
        error={true}
        value={errorValue}
        onChange={(e) => setErrorValue(e.target.value)}
        placeholder="Select"
      >
        <option value="item1">Context Menu Item 1</option>
        <option value="item2">Context Menu Item 2</option>
        <option value="item3">Context Menu Item 3</option>
      </Select>
      <Select
        label="Disabled State"
        disabled={true}
        value={disabledValue}
        onChange={(e) => setDisabledValue(e.target.value)}
        placeholder="Select"
      >
        <option value="item1">Context Menu Item 1</option>
        <option value="item2">Context Menu Item 2</option>
        <option value="item3">Context Menu Item 3</option>
      </Select>
    </div>
  );
};
