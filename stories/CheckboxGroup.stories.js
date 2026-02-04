import React from "react";
import CheckboxGroup from "../app/components/CheckboxGroup";

export default {
  title: "Forms/CheckboxGroup",
  component: CheckboxGroup,
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
    mode: {
      control: "select",
      options: ["standard", "inverse"],
      description: "Visual mode of the checkbox group",
    },
    disabled: {
      control: "boolean",
      description: "Whether the checkbox group is disabled",
    },
  },
};

export const Default = {
  render: () => {
    const [value, setValue] = React.useState([]);

    return (
      <CheckboxGroup
        name="default-checkbox-group"
        value={value}
        onChange={({ value: newValue }) => setValue(newValue)}
        mode="standard"
        options={[
          { value: "option1", label: "Checkbox label" },
          { value: "option2", label: "Checkbox label" },
        ]}
      />
    );
  },
};

export const WithSubtext = {
  render: () => {
    const [value, setValue] = React.useState([]);

    return (
      <CheckboxGroup
        name="subtext-checkbox-group"
        value={value}
        onChange={({ value: newValue }) => setValue(newValue)}
        mode="standard"
        options={[
          { value: "option1", label: "Checkbox label" },
          {
            value: "option2",
            label: "Checkbox label",
            subtext: "Nunc sed hendrerit consequat.",
          },
        ]}
      />
    );
  },
};

export const Inverse = {
  render: () => {
    const [value, setValue] = React.useState([]);

    return (
      <CheckboxGroup
        name="inverse-checkbox-group"
        value={value}
        onChange={({ value: newValue }) => setValue(newValue)}
        mode="inverse"
        options={[
          { value: "option1", label: "Checkbox label" },
          { value: "option2", label: "Checkbox label" },
        ]}
      />
    );
  },
};

export const InverseWithSubtext = {
  render: () => {
    const [value, setValue] = React.useState([]);

    return (
      <CheckboxGroup
        name="inverse-subtext-checkbox-group"
        value={value}
        onChange={({ value: newValue }) => setValue(newValue)}
        mode="inverse"
        options={[
          { value: "option1", label: "Checkbox label" },
          {
            value: "option2",
            label: "Checkbox label",
            subtext: "Nunc sed hendrerit consequat.",
          },
        ]}
      />
    );
  },
};

export const Disabled = {
  render: () => (
    <CheckboxGroup
      name="disabled-checkbox-group"
      value={[]}
      mode="standard"
      disabled
      options={[
        { value: "option1", label: "Checkbox label" },
        { value: "option2", label: "Checkbox label" },
      ]}
    />
  ),
};

export const AllModes = () => {
  const [standardValue, setStandardValue] = React.useState([]);
  const [inverseValue, setInverseValue] = React.useState([]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Standard Mode</h3>
        <CheckboxGroup
          name="standard-all-checkbox-group"
          value={standardValue}
          onChange={({ value }) => setStandardValue(value)}
          mode="standard"
          options={[
            { value: "option1", label: "Checkbox label" },
            {
              value: "option2",
              label: "Checkbox label",
              subtext: "Nunc sed hendrerit consequat.",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Inverse Mode</h3>
        <CheckboxGroup
          name="inverse-all-checkbox-group"
          value={inverseValue}
          onChange={({ value }) => setInverseValue(value)}
          mode="inverse"
          options={[
            { value: "option3", label: "Checkbox label" },
            {
              value: "option4",
              label: "Checkbox label",
              subtext: "Nunc sed hendrerit consequat.",
            },
          ]}
        />
      </div>
    </div>
  );
};
