import ModalFooter from "../../app/components/modals/ModalFooter";

export default {
  title: "Components/Modals/ModalFooter",
  component: ModalFooter,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    showBackButton: {
      control: "boolean",
      description: "Whether to render the back button on the left",
    },
    showNextButton: {
      control: "boolean",
      description: "Whether to render the next button on the right",
    },
    backButtonText: {
      control: "text",
      description: "Override text for the back button",
    },
    nextButtonText: {
      control: "text",
      description: "Override text for the next button",
    },
    nextButtonDisabled: {
      control: "boolean",
      description: "Whether the next button is disabled",
    },
    currentStep: {
      control: { type: "number", min: 1, max: 10, step: 1 },
      description: "Current step (used by the centered Stepper)",
    },
    totalSteps: {
      control: { type: "number", min: 1, max: 10, step: 1 },
      description: "Total number of steps",
    },
    stepper: {
      control: "boolean",
      description: "Whether to render the centered stepper",
    },
    onBack: { action: "back-clicked" },
    onNext: { action: "next-clicked" },
  },
};

export const Default = {
  args: {
    showBackButton: true,
    showNextButton: true,
    currentStep: 2,
    totalSteps: 4,
  },
};

export const NextDisabled = {
  args: {
    showBackButton: true,
    showNextButton: true,
    nextButtonDisabled: true,
    currentStep: 1,
    totalSteps: 4,
  },
};

export const NextOnly = {
  args: {
    showBackButton: false,
    showNextButton: true,
  },
};
