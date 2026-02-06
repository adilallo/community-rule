import React from "react";
import ToggleGroup from "../../app/components/controls/ToggleGroup";

export default {
  title: "Components/Controls/ToggleGroup",
  component: ToggleGroup,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    position: {
      control: { type: "select" },
      options: ["left", "middle", "right"],
    },
    state: {
      control: { type: "select" },
      options: ["default", "hover", "focus", "selected"],
    },
    showText: {
      control: { type: "boolean" },
    },
  },
};

const Template = (args) => <ToggleGroup {...args}>Toggle Item</ToggleGroup>;

export const Default = Template.bind({});
Default.args = {
  position: "left",
  state: "default",
  showText: true,
};

export const Middle = Template.bind({});
Middle.args = {
  position: "middle",
  state: "default",
  showText: true,
};

export const Right = Template.bind({});
Right.args = {
  position: "right",
  state: "default",
  showText: true,
};

export const States = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Toggle Group States</h3>
      <div className="flex space-x-4">
        <ToggleGroup position="left" state="default">
          Default
        </ToggleGroup>
        <ToggleGroup position="middle" state="hover">
          Hover
        </ToggleGroup>
        <ToggleGroup position="middle" state="focus">
          Focus
        </ToggleGroup>
        <ToggleGroup position="right" state="selected">
          Selected
        </ToggleGroup>
      </div>
    </div>
  </div>
);

export const Positions = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Toggle Group Positions</h3>
      <div className="flex">
        <ToggleGroup position="left" state="default">
          Left
        </ToggleGroup>
        <ToggleGroup position="middle" state="default">
          Middle
        </ToggleGroup>
        <ToggleGroup position="middle" state="default">
          Middle
        </ToggleGroup>
        <ToggleGroup position="right" state="default">
          Right
        </ToggleGroup>
      </div>
    </div>
  </div>
);

export const WithText = Template.bind({});
WithText.args = {
  position: "left",
  state: "default",
  showText: true,
  children: "Active Deals",
};

export const WithoutText = Template.bind({});
WithoutText.args = {
  position: "left",
  state: "default",
  showText: false,
  children: "☰",
};

export const WithIcons = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Toggle Group with Icons</h3>
      <div className="flex">
        <ToggleGroup
          position="left"
          state="default"
          showText={false}
          ariaLabel="Menu"
        >
          ☰
        </ToggleGroup>
        <ToggleGroup
          position="middle"
          state="selected"
          showText={false}
          ariaLabel="Menu"
        >
          ☰
        </ToggleGroup>
        <ToggleGroup
          position="right"
          state="default"
          showText={false}
          ariaLabel="Menu"
        >
          ☰
        </ToggleGroup>
      </div>
    </div>
  </div>
);

export const Interactive = () => {
  const [selectedPosition, setSelectedPosition] = React.useState("left");
  const [state, setState] = React.useState("default");
  const [showText, setShowText] = React.useState(true);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Interactive Toggle Group</h3>
        <div className="flex">
          <ToggleGroup
            position="left"
            state={selectedPosition === "left" ? "selected" : state}
            showText={showText}
            onChange={() => setSelectedPosition("left")}
            ariaLabel={!showText ? "Active Deals" : undefined}
          >
            {showText ? "Active Deals" : "☰"}
          </ToggleGroup>
          <ToggleGroup
            position="middle"
            state={selectedPosition === "middle" ? "selected" : state}
            showText={showText}
            onChange={() => setSelectedPosition("middle")}
            ariaLabel={!showText ? "Inactive Deals" : undefined}
          >
            {showText ? "Inactive Deals" : "☰"}
          </ToggleGroup>
          <ToggleGroup
            position="right"
            state={selectedPosition === "right" ? "selected" : state}
            showText={showText}
            onChange={() => setSelectedPosition("right")}
            ariaLabel={!showText ? "Pending Deals" : undefined}
          >
            {showText ? "Pending Deals" : "☰"}
          </ToggleGroup>
        </div>
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
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showText"
              checked={showText}
              onChange={(e) => setShowText(e.target.checked)}
            />
            <label htmlFor="showText" className="text-sm">
              Show Text
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
