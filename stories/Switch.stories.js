import React from "react";
import Switch from "../app/components/Switch";

export default {
  title: "Forms/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "Whether the switch is checked (on) or not (off)",
    },
    state: {
      control: "select",
      options: ["default", "focus"],
      description: "Visual state of the switch",
    },
    label: {
      control: "text",
      description: "Label text displayed next to the switch",
    },
    onChange: {
      action: "changed",
      description: "Callback fired when the switch is toggled",
    },
    onFocus: {
      action: "focused",
      description: "Callback fired when the switch receives focus",
    },
    onBlur: {
      action: "blurred",
      description: "Callback fired when the switch loses focus",
    },
  },
};

const Template = (args) => <Switch {...args} />;

export const Default = Template.bind({});
Default.args = {
  checked: false,
  label: "Switch label",
};

export const Checked = Template.bind({});
Checked.args = {
  checked: true,
  label: "Switch label",
};

export const Focus = Template.bind({});
Focus.args = {
  checked: false,
  state: "focus",
  label: "Switch label",
};

export const FocusChecked = Template.bind({});
FocusChecked.args = {
  checked: true,
  state: "focus",
  label: "Switch label",
};

export const States = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Switch States</h3>
      <div className="space-y-4">
        <Switch checked={false} label="Switch label" />
        <Switch checked={true} label="Switch label" />
        <Switch checked={false} state="focus" label="Switch label" />
        <Switch checked={true} state="focus" label="Switch label" />
      </div>
    </div>
  </div>
);

export const Interactive = () => {
  const [checked, setChecked] = React.useState(false);
  const [state, setState] = React.useState("default");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Interactive Switch</h3>
        <Switch
          checked={checked}
          state={state}
          onChange={() => setChecked(!checked)}
          label="Enable notifications"
        />
      </div>
      <div className="space-y-4">
        <h4 className="text-md font-semibold">Controls</h4>
        <div className="space-y-2">
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
        </div>
      </div>
    </div>
  );
};

export const WithText = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Switch with Different Labels</h3>
      <div className="space-y-4">
        <Switch checked={false} label="Enable notifications" />
        <Switch checked={true} label="Auto-save documents" />
        <Switch checked={false} label="Dark mode" />
        <Switch checked={true} label="Email updates" />
      </div>
    </div>
  </div>
);
