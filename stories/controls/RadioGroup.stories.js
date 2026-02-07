import React from "react";
import RadioGroup from "../../app/components/controls/RadioGroup";

export default {
  title: "Components/Controls/RadioGroup",
  component: RadioGroup,
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
      description: "Visual mode of the radio group",
    },
    disabled: {
      control: "boolean",
      description: "Whether the radio group is disabled",
    },
  },
};

export const Default = {
  render: () => {
    const [value, setValue] = React.useState("");

    return (
      <RadioGroup
        name="default-radio-group"
        value={value}
        onChange={({ value: newValue }) => setValue(newValue)}
        mode="standard"
        options={[
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
          { value: "option3", label: "Option 3" },
        ]}
      />
    );
  },
};

export const WithSubtext = {
  render: () => {
    const [value, setValue] = React.useState("");

    return (
      <RadioGroup
        name="subtext-radio-group"
        value={value}
        onChange={({ value: newValue }) => setValue(newValue)}
        mode="standard"
        options={[
          { value: "option1", label: "Option 1" },
          {
            value: "option2",
            label: "Option 2",
            subtext: "Lorem ipsum dolor sit amet consectetur",
          },
        ]}
      />
    );
  },
};

export const Inverse = {
  render: () => {
    const [value, setValue] = React.useState("");

    return (
      <RadioGroup
        name="inverse-radio-group"
        value={value}
        onChange={({ value: newValue }) => setValue(newValue)}
        mode="inverse"
        options={[
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
          { value: "option3", label: "Option 3" },
        ]}
      />
    );
  },
};

export const InverseWithSubtext = {
  render: () => {
    const [value, setValue] = React.useState("");

    return (
      <RadioGroup
        name="inverse-subtext-radio-group"
        value={value}
        onChange={({ value: newValue }) => setValue(newValue)}
        mode="inverse"
        options={[
          { value: "option1", label: "Option 1" },
          {
            value: "option2",
            label: "Option 2",
            subtext: "Lorem ipsum dolor sit amet consectetur",
          },
        ]}
      />
    );
  },
};

export const Disabled = {
  render: () => (
    <RadioGroup
      name="disabled-radio-group"
      value=""
      mode="standard"
      disabled
      options={[
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
      ]}
    />
  ),
};

export const AllModes = () => {
  const [standardValue, setStandardValue] = React.useState("");
  const [inverseValue, setInverseValue] = React.useState("");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Standard Mode</h3>
        <RadioGroup
          name="standard-all-radio-group"
          value={standardValue}
          onChange={({ value }) => setStandardValue(value)}
          mode="standard"
          options={[
            { value: "option1", label: "Option 1" },
            {
              value: "option2",
              label: "Option 2",
              subtext: "Lorem ipsum dolor sit amet consectetur",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Inverse Mode</h3>
        <RadioGroup
          name="inverse-all-radio-group"
          value={inverseValue}
          onChange={({ value }) => setInverseValue(value)}
          mode="inverse"
          options={[
            { value: "option3", label: "Option 1" },
            {
              value: "option4",
              label: "Option 2",
              subtext: "Lorem ipsum dolor sit amet consectetur",
            },
          ]}
        />
      </div>
    </div>
  );
};
