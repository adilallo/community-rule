import Checkbox from "../app/components/Checkbox";
import {
  DefaultInteraction,
  CheckedInteraction,
  StandardInteraction,
  InverseInteraction,
  KeyboardInteraction,
  AccessibilityInteraction,
  FormIntegration,
} from "../tests/storybook/Checkbox.interactions.test";

export default {
  title: "Forms/Checkbox",
  component: Checkbox,
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
    checked: {
      control: "boolean",
      description: "Whether the checkbox is checked",
    },
    mode: {
      control: "select",
      options: ["standard", "inverse"],
      description: "Visual mode of the checkbox",
    },
    state: {
      control: "select",
      options: ["default", "hover", "focus"],
      description: "Interaction state for static display",
    },
    disabled: {
      control: "boolean",
      description: "Whether the checkbox is disabled",
    },
    label: {
      control: "text",
      description: "Label text for the checkbox",
    },
  },
};

export const Default = {
  args: {
    checked: false,
    mode: "standard",
    state: "default",
    disabled: false,
    label: "Default checkbox",
  },
  play: DefaultInteraction.play,
};

export const Checked = {
  args: {
    checked: true,
    mode: "standard",
    state: "default",
    disabled: false,
    label: "Checked checkbox",
  },
  play: CheckedInteraction.play,
};

export const Standard = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-white font-medium">Standard Mode</h3>
        <div className="flex flex-col gap-2">
          <Checkbox label="Unchecked" checked={false} mode="standard" />
          <Checkbox label="Checked" checked={true} mode="standard" />
        </div>
      </div>
    </div>
  ),
  play: StandardInteraction.play,
};

export const Inverse = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-white font-medium">Inverse Mode</h3>
        <div className="flex flex-col gap-2">
          <Checkbox label="Unchecked" checked={false} mode="inverse" />
          <Checkbox label="Checked" checked={true} mode="inverse" />
        </div>
      </div>
    </div>
  ),
  play: InverseInteraction.play,
};
