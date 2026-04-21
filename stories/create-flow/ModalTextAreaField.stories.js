import React from "react";
import ModalTextAreaField from "../../app/(app)/create/components/ModalTextAreaField";

export default {
  title: "Create Flow/ModalTextAreaField",
  component: ModalTextAreaField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shared 'labelled text area' field used by every create-flow modal section. Pairs `InputLabel` (with help icon) with a `TextArea` set to the `embedded` appearance.",
      },
    },
  },
  argTypes: {
    label: { control: { type: "text" } },
    placeholder: { control: { type: "text" } },
    rows: { control: { type: "number" } },
    helpIcon: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
    onChange: { action: "change" },
  },
  tags: ["autodocs"],
};

export const Default = {
  render: (args) => {
    const [value, setValue] = React.useState("");
    return (
      <div className="w-[520px]">
        <ModalTextAreaField {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    label: "Description",
    helpIcon: true,
    placeholder: "What does this rule cover?",
    rows: 4,
  },
};

export const WithValue = {
  render: () => {
    const [value, setValue] = React.useState(
      "We decide together whenever a change would affect more than two teams.",
    );
    return (
      <div className="w-[520px]">
        <ModalTextAreaField
          label="Core principle"
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

export const Disabled = {
  render: () => (
    <div className="w-[520px]">
      <ModalTextAreaField
        label="Description"
        value="Read-only content"
        onChange={() => {}}
        disabled
      />
    </div>
  ),
};
