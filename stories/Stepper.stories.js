import Stepper from "../app/components/Stepper";

export default {
  title: "Components/Stepper",
  component: Stepper,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Stepper component for showing progress through multi-step processes. Displays a series of steps with active steps highlighted.",
      },
    },
  },
  argTypes: {
    active: {
      control: { type: "number", min: 1, max: 5 },
      description: "The active step number",
    },
    totalSteps: {
      control: { type: "number", min: 1, max: 10 },
      description: "Total number of steps",
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    active: 1,
    totalSteps: 5,
  },
};

export const AllStates = {
  args: {
    totalSteps: 5,
  },
  render: (_args) => (
    <div className="space-y-4">
      <div>
        <p className="text-white mb-2">Step 1 of 5</p>
        <Stepper {..._args} active={1} />
      </div>
      <div>
        <p className="text-white mb-2">Step 2 of 5</p>
        <Stepper {..._args} active={2} />
      </div>
      <div>
        <p className="text-white mb-2">Step 3 of 5</p>
        <Stepper {..._args} active={3} />
      </div>
      <div>
        <p className="text-white mb-2">Step 4 of 5</p>
        <Stepper {..._args} active={4} />
      </div>
      <div>
        <p className="text-white mb-2">Step 5 of 5</p>
        <Stepper {..._args} active={5} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different active states of the stepper component.",
      },
    },
  },
};

export const DifferentStepCounts = {
  args: {},
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-white mb-2">3 Steps - Step 2</p>
        <Stepper active={2} totalSteps={3} />
      </div>
      <div>
        <p className="text-white mb-2">5 Steps - Step 3</p>
        <Stepper active={3} totalSteps={5} />
      </div>
      <div>
        <p className="text-white mb-2">7 Steps - Step 4</p>
        <Stepper active={4} totalSteps={7} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Stepper with different total step counts.",
      },
    },
  },
};
