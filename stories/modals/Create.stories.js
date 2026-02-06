import Create from "../../app/components/modals/Create";
import TextInput from "../../app/components/controls/TextInput";

export default {
  title: "Components/Modals/Create",
  component: Create,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Create dialog component with portal rendering, keyboard navigation, and focus trap. Supports multi-step workflows with stepper integration. Used for the create flow in the application.",
      },
    },
  },
  argTypes: {
    isOpen: {
      control: { type: "boolean" },
    },
    title: {
      control: { type: "text" },
    },
    description: {
      control: { type: "text" },
    },
    showBackButton: {
      control: { type: "boolean" },
    },
    showNextButton: {
      control: { type: "boolean" },
    },
    nextButtonDisabled: {
      control: { type: "boolean" },
    },
    currentStep: {
      control: { type: "number", min: 1, max: 5 },
    },
    totalSteps: {
      control: { type: "number", min: 1, max: 5 },
    },
  },
  tags: ["autodocs"],
};

const Template = (args) => {
  return (
    <Create {...args} isOpen={true} onClose={() => {}}>
      {args.children}
    </Create>
  );
};

export const Default = Template.bind({});
Default.args = {
  isOpen: true,
  title: "What do you call your group's new policy?",
  description: "You can also combine or add new approaches to the list",
  children: (
    <div className="space-y-4">
      <TextInput label="Label" placeholder="Policy name" value="" />
      <p className="text-[12px] text-[var(--color-content-default-tertiary)]">
        0/48
      </p>
    </div>
  ),
  showBackButton: true,
  showNextButton: true,
  backButtonText: "Back",
  nextButtonText: "Next",
  nextButtonDisabled: false,
};

export const WithStepper = Template.bind({});
WithStepper.args = {
  isOpen: true,
  title: "What do you call your group's new policy?",
  description: "You can also combine or add new approaches to the list",
  children: (
    <div className="space-y-4">
      <TextInput label="Label" placeholder="Policy name" value="" />
      <p className="text-[12px] text-[var(--color-content-default-tertiary)]">
        0/48
      </p>
    </div>
  ),
  showBackButton: true,
  showNextButton: true,
  backButtonText: "Back",
  nextButtonText: "Next",
  nextButtonDisabled: false,
  currentStep: 1,
  totalSteps: 3,
};

export const Step2 = Template.bind({});
Step2.args = {
  isOpen: true,
  title: "How should conflicts be resolved?",
  description: "You can also combine or add new approaches to the list",
  children: (
    <div className="space-y-4">
      <TextInput label="Label" placeholder="Enter text" value="" />
    </div>
  ),
  showBackButton: true,
  showNextButton: true,
  backButtonText: "Back",
  nextButtonText: "Next",
  nextButtonDisabled: false,
  currentStep: 2,
  totalSteps: 3,
};

export const Step3 = Template.bind({});
Step3.args = {
  isOpen: true,
  title: "Final step",
  description: "Review your settings",
  children: (
    <div className="space-y-4">
      <p className="text-[var(--color-content-default-primary)]">
        Review your policy configuration
      </p>
    </div>
  ),
  showBackButton: true,
  showNextButton: true,
  backButtonText: "Back",
  nextButtonText: "Finish",
  nextButtonDisabled: false,
  currentStep: 3,
  totalSteps: 3,
};

export const WithoutFooter = Template.bind({});
WithoutFooter.args = {
  isOpen: true,
  title: "Simple Create Dialog",
  description: "This create dialog has no footer buttons",
  children: (
    <div className="space-y-4">
      <p className="text-[var(--color-content-default-primary)]">
        Modal content without footer
      </p>
    </div>
  ),
  showBackButton: false,
  showNextButton: false,
};

export const NextButtonDisabled = Template.bind({});
NextButtonDisabled.args = {
  isOpen: true,
  title: "What do you call your group's new policy?",
  description: "You can also combine or add new approaches to the list",
  children: (
    <div className="space-y-4">
      <TextInput label="Label" placeholder="Policy name" value="" />
      <p className="text-[12px] text-[var(--color-content-default-tertiary)]">
        0/48
      </p>
    </div>
  ),
  showBackButton: true,
  showNextButton: true,
  backButtonText: "Back",
  nextButtonText: "Next",
  nextButtonDisabled: true,
  currentStep: 1,
  totalSteps: 3,
};
