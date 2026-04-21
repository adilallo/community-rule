import React from "react";
import InputWithCounter from "../../app/components/controls/InputWithCounter";

export default {
  title: "Components/Controls/InputWithCounter",
  component: InputWithCounter,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    label: {
      control: "text",
      description: "Label rendered above the input",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text shown when value is empty",
    },
    value: {
      control: "text",
      description: "Current value of the input (controlled)",
    },
    maxLength: {
      control: { type: "number", min: 1, max: 500, step: 1 },
      description: "Maximum number of characters allowed",
    },
    showHelpIcon: {
      control: "boolean",
      description: "Whether to show the help icon next to the label",
    },
    onChange: { action: "changed" },
  },
};

const Template = (args) => {
  const [value, setValue] = React.useState(args.value ?? "");
  return (
    <div style={{ width: 320 }}>
      <InputWithCounter
        {...args}
        value={value}
        onChange={(next) => {
          setValue(next);
          args.onChange?.(next);
        }}
      />
    </div>
  );
};

export const Default = {
  render: Template,
  args: {
    label: "Community name",
    placeholder: "Enter a name",
    value: "",
    maxLength: 50,
    showHelpIcon: false,
  },
};

export const WithHelpIcon = {
  render: Template,
  args: {
    label: "Community name",
    placeholder: "Enter a name",
    value: "",
    maxLength: 50,
    showHelpIcon: true,
  },
};

export const WithInitialValue = {
  render: Template,
  args: {
    label: "Community name",
    placeholder: "Enter a name",
    value: "My community",
    maxLength: 30,
    showHelpIcon: false,
  },
};
