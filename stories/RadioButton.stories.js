import RadioButton from "../app/components/RadioButton";
import {
  DefaultInteraction,
  CheckedInteraction,
  StandardInteraction,
  InverseInteraction,
  KeyboardInteraction,
  AccessibilityInteraction,
  FormIntegration,
} from "../tests/storybook/RadioButton.interactions.test";

const meta = {
  title: "Forms/RadioButton",
  component: RadioButton,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "black" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    mode: {
      control: { type: "select" },
      options: ["standard", "inverse"],
    },
    state: {
      control: { type: "select" },
      options: ["default", "hover", "focus"],
    },
    label: { control: "text" },
  },
  args: {
    checked: false,
    mode: "standard",
    state: "default",
    label: "Radio Button Label",
  },
};

export default meta;

export const Default = {
  args: {
    checked: false,
    mode: "standard",
    state: "default",
    label: "Default radio button",
  },
  play: DefaultInteraction.play,
};

export const Checked = {
  args: {
    checked: true,
    mode: "standard",
    state: "default",
    label: "Checked radio button",
  },
  play: CheckedInteraction.play,
};

export const Standard = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-white font-medium">Standard Mode</h3>
        <div className="flex flex-col gap-2">
          <RadioButton label="Unchecked" checked={false} mode="standard" />
          <RadioButton label="Checked" checked={true} mode="standard" />
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
          <RadioButton label="Unchecked" checked={false} mode="inverse" />
          <RadioButton label="Checked" checked={true} mode="inverse" />
        </div>
      </div>
    </div>
  ),
  play: InverseInteraction.play,
};
