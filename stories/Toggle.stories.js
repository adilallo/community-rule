import React from "react";
import Toggle from "../app/components/Toggle";

export default {
  title: "Forms/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["default", "hover", "focus"],
    },
    disabled: {
      control: { type: "boolean" },
    },
    checked: {
      control: { type: "boolean" },
    },
    showIcon: {
      control: { type: "boolean" },
    },
    showText: {
      control: { type: "boolean" },
    },
  },
};

const Template = (args) => <Toggle {...args} />;

export const States = () => (
  <div className="space-y-6">
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Toggle States</h3>
      <div className="space-y-4">
        <Toggle label="Default State" checked={false} />
        <Toggle label="Hover State" checked={false} state="hover" />
        <Toggle label="Selected State" checked={true} />
        <Toggle label="Focus State" checked={false} state="focus" />
        <Toggle label="Disabled State" checked={false} disabled />
      </div>
    </div>
  </div>
);

export const WithText = Template.bind({});
WithText.args = {
  label: "Text Toggle",
  checked: false,
  showText: true,
  text: "Toggle",
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  label: "Icon Toggle",
  checked: false,
  showIcon: true,
  icon: "I",
};

export const Interactive = () => {
  const [checked, setChecked] = React.useState(false);
  const [state, setState] = React.useState("default");
  const [disabled, setDisabled] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Interactive Toggle</h3>
        <div className="space-y-4">
          <Toggle
            label="Interactive Toggle"
            checked={checked}
            onChange={() => setChecked(!checked)}
            state={state}
            disabled={disabled}
          />
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="text-md font-semibold">Controls</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="checked"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <label htmlFor="checked" className="text-sm">
              Checked
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State:</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded"
            >
              <option value="default">Default</option>
              <option value="focus">Focus</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="disabled"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
            />
            <label htmlFor="disabled" className="text-sm">
              Disabled
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
