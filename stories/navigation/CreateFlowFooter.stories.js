import CreateFlowFooter from "../../app/components/navigation/CreateFlowFooter";
import Button from "../../app/components/buttons/Button";

export default {
  title: "Components/Navigation/CreateFlowFooter",
  component: CreateFlowFooter,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Footer component for the create rule flow with progress bar and buttons.",
      },
    },
  },
  argTypes: {
    progressBar: {
      control: "boolean",
      description: "Whether to show the progress bar",
    },
    secondButton: {
      control: false,
      description:
        "The second button (typically Next) to display on the right side",
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    progressBar: true,
    secondButton: (
      <Button buttonType="filled" palette="default" size="xsmall">
        Next
      </Button>
    ),
  },
};

export const WithoutProgressBar = {
  args: {
    progressBar: false,
    secondButton: (
      <Button buttonType="filled" palette="default" size="xsmall">
        Next
      </Button>
    ),
  },
};

export const WithoutSecondButton = {
  args: {
    progressBar: true,
    secondButton: undefined,
  },
};
