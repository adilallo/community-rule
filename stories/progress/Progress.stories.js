import Progress from "../../app/components/progress/Progress";

export default {
  title: "Components/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Progress bar component for showing completion percentage. Displays a 3-segment progress bar with support for partial fills.",
      },
    },
  },
  argTypes: {
    progress: {
      control: { type: "select" },
      options: [
        "1-0",
        "1-1",
        "1-2",
        "1-3",
        "1-4",
        "1-5",
        "2-0",
        "2-1",
        "2-2",
        "3-0",
        "3-1",
        "3-2",
      ],
      description: "Progress state (format: segments-partial)",
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    progress: "3-2",
  },
  render: (args) => (
    <div className="w-full max-w-[600px]">
      <Progress {...args} />
    </div>
  ),
};

export const AllStates = {
  args: {},
  render: (_args) => (
    <div className="space-y-4 w-full max-w-[600px]">
      <div className="w-full">
        <p className="text-white mb-2">1-0</p>
        <Progress {..._args} progress="1-0" />
      </div>
      <div className="w-full">
        <p className="text-white mb-2">1-1</p>
        <Progress {..._args} progress="1-1" />
      </div>
      <div className="w-full">
        <p className="text-white mb-2">1-2</p>
        <Progress {..._args} progress="1-2" />
      </div>
      <div className="w-full">
        <p className="text-white mb-2">1-3</p>
        <Progress {..._args} progress="1-3" />
      </div>
      <div className="w-full">
        <p className="text-white mb-2">1-4</p>
        <Progress {..._args} progress="1-4" />
      </div>
      <div className="w-full">
        <p className="text-white mb-2">1-5</p>
        <Progress {..._args} progress="1-5" />
      </div>
      <div className="w-full">
        <p className="text-white mb-2">2-0</p>
        <Progress {..._args} progress="2-0" />
      </div>
      <div className="w-full">
        <p className="text-white mb-2">2-1</p>
        <Progress {..._args} progress="2-1" />
      </div>
      <div className="w-full">
        <p className="text-white mb-2">2-2</p>
        <Progress {..._args} progress="2-2" />
      </div>
      <div className="w-full">
        <p className="text-white mb-2">3-0</p>
        <Progress {..._args} progress="3-0" />
      </div>
      <div className="w-full">
        <p className="text-white mb-2">3-1</p>
        <Progress {..._args} progress="3-1" />
      </div>
      <div className="w-full">
        <p className="text-white mb-2">3-2</p>
        <Progress {..._args} progress="3-2" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different progress states of the progress bar component.",
      },
    },
  },
};
