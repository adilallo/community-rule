import React from "react";
import Tooltip from "../../app/components/modals/Tooltip";
import Button from "../../app/components/buttons/Button";

export default {
  title: "Components/Modals/Tooltip",
  component: Tooltip,
  argTypes: {
    position: {
      control: { type: "select" },
      options: ["top", "bottom"],
    },
    disabled: {
      control: { type: "boolean" },
    },
    text: {
      control: { type: "text" },
    },
  },
};

const Template = (args) => (
  <div className="p-16 flex items-center justify-center min-h-[200px]">
    <Tooltip {...args}>
      <Button variant="default" size="medium">
        Hover me
      </Button>
    </Tooltip>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  text: "Tooltip text goes here",
  position: "top",
  disabled: false,
};

export const Top = Template.bind({});
Top.args = {
  text: "Tooltip positioned at top",
  position: "top",
};

export const Bottom = Template.bind({});
Bottom.args = {
  text: "Tooltip positioned at bottom",
  position: "bottom",
};

export const Disabled = Template.bind({});
Disabled.args = {
  text: "This tooltip is disabled",
  disabled: true,
};

export const LongText = Template.bind({});
LongText.args = {
  text: "This is a longer tooltip text that demonstrates how the component handles multiple words and extended content",
  position: "top",
};

export const WithIcon = () => (
  <div className="p-16 flex items-center justify-center min-h-[200px]">
    <Tooltip text="Tooltip with icon button" position="top">
      <button className="p-2 rounded-full hover:bg-[var(--color-surface-default-tertiary)] transition-colors">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 9V11M10 15H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </Tooltip>
  </div>
);
