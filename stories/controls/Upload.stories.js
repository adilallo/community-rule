import React from "react";
import Upload from "../../app/components/controls/Upload";

export default {
  title: "Components/Controls/Upload",
  component: Upload,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An upload component with active/inactive states. Displays a label, upload button with icon, and description text.",
      },
    },
  },
  argTypes: {
    active: {
      control: { type: "boolean" },
      description: "Whether the upload component is in active state",
    },
    label: {
      control: { type: "text" },
      description: "Label text displayed above the upload component",
    },
    showHelpIcon: {
      control: { type: "boolean" },
      description: "Whether to show help icon next to label",
    },
    onClick: { action: "clicked" },
  },
  tags: ["autodocs"],
};

const Template = (args) => <Upload {...args} />;

// Default story
export const Default = Template.bind({});
Default.args = {
  label: "Upload",
  active: true,
  showHelpIcon: true,
};

// Active state
export const Active = Template.bind({});
Active.args = {
  label: "Upload",
  active: true,
  showHelpIcon: true,
};
Active.parameters = {
  docs: {
    description: {
      story: "Upload component in active state with white button and black text.",
    },
  },
};

// Inactive state
export const Inactive = Template.bind({});
Inactive.args = {
  label: "Upload",
  active: false,
  showHelpIcon: true,
};
Inactive.parameters = {
  docs: {
    description: {
      story: "Upload component in inactive state with dark button and gray text.",
    },
  },
};

// Without help icon
export const WithoutHelpIcon = Template.bind({});
WithoutHelpIcon.args = {
  label: "Upload",
  active: true,
  showHelpIcon: false,
};
WithoutHelpIcon.parameters = {
  docs: {
    description: {
      story: "Upload component without help icon.",
    },
  },
};

// Without label
export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
  active: true,
  showHelpIcon: false,
};
WithoutLabel.parameters = {
  docs: {
    description: {
      story: "Upload component without label.",
    },
  },
};

// Custom label
export const CustomLabel = Template.bind({});
CustomLabel.args = {
  label: "Upload Files",
  active: true,
  showHelpIcon: true,
};
CustomLabel.parameters = {
  docs: {
    description: {
      story: "Upload component with custom label text.",
    },
  },
};

// All states comparison
export const AllStates = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">Upload States</h3>
      <div className="space-y-4">
        <Upload label="Active State" active={true} showHelpIcon={true} />
        <Upload label="Inactive State" active={false} showHelpIcon={true} />
      </div>
    </div>
  </div>
);
