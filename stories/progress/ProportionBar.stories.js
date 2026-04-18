import ProportionBar from "../../app/components/progress/ProportionBar";

export default {
  title: "Components/Progress/ProportionBar",
  component: ProportionBar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Proportion bar component for showing completion percentage. Displays a 3-segment proportion bar with support for partial fills.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "segmented"],
      description:
        "Segmented: pill-shaped partial fills (create-flow footer / Figma).",
    },
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
        "2-3",
        "3-0",
        "3-1",
        "3-2",
      ],
      description: "Proportion state (format: segments-partial)",
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    progress: "3-2",
  },
  render: (args) => (
    <div className="w-[300px]">
      <ProportionBar {...args} />
    </div>
  ),
};

export const SegmentedCreateFlow = {
  args: {
    progress: "1-1",
    variant: "segmented",
  },
  render: (args) => (
    <div className="w-full max-w-[640px] bg-black p-4">
      <ProportionBar {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Matches the create-flow footer: three segments with partial fill in the first segment (`1-1` on community name).",
      },
    },
    backgrounds: { default: "dark" },
  },
};

export const AllStates = {
  args: {},
  render: (_args) => (
    <div className="space-y-4 w-[300px]">
      <ProportionBar {..._args} progress="1-0" />
      <ProportionBar {..._args} progress="1-1" />
      <ProportionBar {..._args} progress="1-2" />
      <ProportionBar {..._args} progress="1-3" />
      <ProportionBar {..._args} progress="1-4" />
      <ProportionBar {..._args} progress="1-5" />
      <ProportionBar {..._args} progress="2-0" />
      <ProportionBar {..._args} progress="2-1" />
      <ProportionBar {..._args} progress="2-2" />
      <ProportionBar {..._args} progress="2-3" />
      <ProportionBar {..._args} progress="3-0" />
      <ProportionBar {..._args} progress="3-1" />
      <ProportionBar {..._args} progress="3-2" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different proportion states of the proportion bar component.",
      },
    },
  },
};
