import React from "react";
import MultiSelect from "../../app/components/controls/MultiSelect";

export default {
  title: "Components/Controls/MultiSelect",
  component: MultiSelect,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    label: {
      control: "text",
      description: "Label displayed above the chip set",
    },
    showHelpIcon: {
      control: "boolean",
      description: "Whether to show the help icon next to the label",
    },
    size: {
      control: "select",
      options: ["s", "m"],
      description: "Size variant of the chips",
    },
    palette: {
      control: "select",
      options: ["default", "inverse"],
      description: "Color palette applied to the chips",
    },
    addButton: {
      control: "boolean",
      description: "Whether to show the add button",
    },
    addButtonText: {
      control: "text",
      description: "Text rendered on the add button",
    },
    formHeader: {
      control: "boolean",
      description: "Whether to show the label/help-icon header",
    },
    onChipClick: { action: "chip-clicked" },
    onAddClick: { action: "add-clicked" },
  },
};

const defaultOptions = [
  { id: "1", label: "Worker cooperative", state: "unselected" },
  { id: "2", label: "Consumer cooperative", state: "selected" },
  { id: "3", label: "Housing cooperative", state: "unselected" },
  { id: "4", label: "Producer cooperative", state: "unselected" },
];

export const Default = {
  args: {
    label: "Organization type",
    showHelpIcon: true,
    size: "m",
    palette: "default",
    options: defaultOptions,
    addButton: true,
    addButtonText: "Add organization type",
    formHeader: true,
  },
};

export const Small = {
  args: {
    ...Default.args,
    size: "s",
  },
};

export const Inverse = {
  args: {
    ...Default.args,
    palette: "inverse",
  },
};

export const NoAddButton = {
  args: {
    ...Default.args,
    addButton: false,
  },
};
