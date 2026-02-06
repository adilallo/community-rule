import React from "react";
import TextArea from "../../app/components/controls/TextArea";

export default {
  title: "Components/Controls/TextArea",
  component: TextArea,
  parameters: {
    layout: "centered",
  },
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
      options: ["default", "active", "hover", "focus", "error"],
    },
    disabled: {
      control: { type: "boolean" },
    },
    error: {
      control: { type: "boolean" },
    },
  },
};

const Template = (args) => <TextArea {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: "Text Area",
  placeholder: "Enter text...",
  value: "",
};

export const WithValue = Template.bind({});
WithValue.args = {
  label: "Text Area",
  placeholder: "Enter text...",
  value:
    "This is some sample text content that demonstrates how the text area looks with content.",
};

export const Small = Template.bind({});
Small.args = {
  size: "small",
  label: "Small Text Area",
  placeholder: "Enter text...",
  value: "",
};

export const Medium = Template.bind({});
Medium.args = {
  size: "medium",
  label: "Medium Text Area",
  placeholder: "Enter text...",
  value: "",
};

export const Large = Template.bind({});
Large.args = {
  size: "large",
  label: "Large Text Area",
  placeholder: "Enter text...",
  value: "",
};

export const HorizontalLabel = Template.bind({});
HorizontalLabel.args = {
  labelVariant: "horizontal",
  label: "Horizontal Label",
  placeholder: "Enter text...",
  value: "",
};

export const AllSizes = () => (
  <div className="space-y-6">
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Default Label Variant</h3>
      <div className="space-y-4">
        <TextArea
          size="small"
          label="Small Text Area"
          placeholder="Enter text..."
          value=""
        />
        <TextArea
          size="medium"
          label="Medium Text Area"
          placeholder="Enter text..."
          value=""
        />
        <TextArea
          size="large"
          label="Large Text Area"
          placeholder="Enter text..."
          value=""
        />
      </div>
    </div>
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Horizontal Label Variant</h3>
      <div className="space-y-4">
        <TextArea
          size="small"
          labelVariant="horizontal"
          label="Small Text Area"
          placeholder="Enter text..."
          value=""
        />
        <TextArea
          size="medium"
          labelVariant="horizontal"
          label="Medium Text Area"
          placeholder="Enter text..."
          value=""
        />
        <TextArea
          size="large"
          labelVariant="horizontal"
          label="Large Text Area"
          placeholder="Enter text..."
          value=""
        />
      </div>
    </div>
  </div>
);

export const States = () => (
  <div className="space-y-6">
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Default Label Variant</h3>
      <div className="space-y-4">
        <TextArea label="Default State" placeholder="Enter text..." value="" />
        <TextArea
          label="Active State"
          placeholder="Enter text..."
          value=""
          state="active"
        />
        <TextArea
          label="Hover State"
          placeholder="Enter text..."
          value=""
          state="hover"
        />
        <TextArea
          label="Focus State"
          placeholder="Enter text..."
          value=""
          state="focus"
        />
        <TextArea
          label="Error State"
          placeholder="Enter text..."
          value=""
          error
        />
        <TextArea
          label="Disabled State"
          placeholder="Enter text..."
          value=""
          disabled
        />
      </div>
    </div>
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Horizontal Label Variant</h3>
      <div className="space-y-4">
        <TextArea
          labelVariant="horizontal"
          label="Default State"
          placeholder="Enter text..."
          value=""
        />
        <TextArea
          labelVariant="horizontal"
          label="Active State"
          placeholder="Enter text..."
          value=""
          state="active"
        />
        <TextArea
          labelVariant="horizontal"
          label="Hover State"
          placeholder="Enter text..."
          value=""
          state="hover"
        />
        <TextArea
          labelVariant="horizontal"
          label="Focus State"
          placeholder="Enter text..."
          value=""
          state="focus"
        />
        <TextArea
          labelVariant="horizontal"
          label="Error State"
          placeholder="Enter text..."
          value=""
          error
        />
        <TextArea
          labelVariant="horizontal"
          label="Disabled State"
          placeholder="Enter text..."
          value=""
          disabled
        />
      </div>
    </div>
  </div>
);

export const Interactive = () => {
  const [value, setValue] = React.useState("");
  const [state, setState] = React.useState("default");
  const [disabled, setDisabled] = React.useState(false);
  const [error, setError] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Interactive TextArea</h3>
        <div className="space-y-4">
          <TextArea
            label="Interactive Text Area"
            placeholder="Type something..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            state={state}
            disabled={disabled}
            error={error}
          />
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
              <option value="active">Active</option>
              <option value="hover">Hover</option>
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
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="error"
              checked={error}
              onChange={(e) => setError(e.target.checked)}
            />
            <label htmlFor="error" className="text-sm">
              Error
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
