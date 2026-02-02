import Progress from "../app/components/Progress";

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
};

export const AllStates = {
  args: {},
  render: (_args) => (
    <div className="space-y-4 w-full max-w-[600px]">
      <div>
        <p className="text-white mb-2">Progress: 1-0 (1 segment)</p>
        <Progress {..._args} progress="1-0" />
      </div>
      <div>
        <p className="text-white mb-2">Progress: 1-1 (1 segment + partial)</p>
        <Progress {..._args} progress="1-1" />
      </div>
      <div>
        <p className="text-white mb-2">
          Progress: 1-5 (1 segment + full partial)
        </p>
        <Progress {..._args} progress="1-5" />
      </div>
      <div>
        <p className="text-white mb-2">Progress: 2-0 (2 segments)</p>
        <Progress {..._args} progress="2-0" />
      </div>
      <div>
        <p className="text-white mb-2">Progress: 2-1 (2 segments + partial)</p>
        <Progress {..._args} progress="2-1" />
      </div>
      <div>
        <p className="text-white mb-2">Progress: 2-2 (2 segments + partial)</p>
        <Progress {..._args} progress="2-2" />
      </div>
      <div>
        <p className="text-white mb-2">Progress: 3-0 (3 segments - complete)</p>
        <Progress {..._args} progress="3-0" />
      </div>
      <div>
        <p className="text-white mb-2">Progress: 3-1 (3 segments - complete)</p>
        <Progress {..._args} progress="3-1" />
      </div>
      <div>
        <p className="text-white mb-2">Progress: 3-2 (3 segments - complete)</p>
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

export const ProgressExamples = {
  args: {},
  render: () => (
    <div className="space-y-4 w-full max-w-[600px]">
      <div>
        <p className="text-white mb-2">Early (1-0)</p>
        <Progress progress="1-0" />
      </div>
      <div>
        <p className="text-white mb-2">Middle (2-1)</p>
        <Progress progress="2-1" />
      </div>
      <div>
        <p className="text-white mb-2">Complete (3-2)</p>
        <Progress progress="3-2" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Common progress bar examples.",
      },
    },
  },
};
