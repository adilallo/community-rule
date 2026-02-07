import React from "react";
import Switch from "../../app/components/controls/Switch";

export default {
  title: "Components/Controls/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    propSwitch: {
      control: "boolean",
      description: "Whether the switch is checked (on) or not (off) (Figma prop)",
    },
    state: {
      control: "select",
      options: ["default", "focus"],
      description: "Visual state of the switch",
    },
    text: {
      control: "text",
      description: "Label text displayed next to the switch (Figma prop)",
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
  propSwitch: false,
  text: "Switch label",
};

export const Checked = Template.bind({});
Checked.args = {
  propSwitch: true,
  text: "Switch label",
};

export const Focus = Template.bind({});
Focus.args = {
  propSwitch: false,
  state: "focus",
  text: "Switch label",
};

export const FocusChecked = Template.bind({});
FocusChecked.args = {
  propSwitch: true,
  state: "focus",
  text: "Switch label",
};

export const States = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Switch States</h3>
      <div className="space-y-4">
        <Switch propSwitch={false} text="Switch label" />
        <Switch propSwitch={true} text="Switch label" />
        <Switch propSwitch={false} state="focus" text="Switch label" />
        <Switch propSwitch={true} state="focus" text="Switch label" />
      </div>
    </div>
  </div>
);

export const Interactive = () => {
  const [propSwitch, setPropSwitch] = React.useState(false);
  const [state, setState] = React.useState("default");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Interactive Switch</h3>
        <Switch
          propSwitch={propSwitch}
          state={state}
          onChange={() => setPropSwitch(!propSwitch)}
          text="Enable notifications"
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
        <Switch propSwitch={false} text="Enable notifications" />
        <Switch propSwitch={true} text="Auto-save documents" />
        <Switch propSwitch={false} text="Dark mode" />
        <Switch propSwitch={true} text="Email updates" />
      </div>
    </div>
  </div>
);
