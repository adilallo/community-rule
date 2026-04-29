import React from "react";
import HeaderLockup from "../../app/components/type/HeaderLockup";
import InfoMessageBox from "../../app/components/controls/InfoMessageBox";

/**
 * Compose pattern used by create-flow “decision approaches” rail: headline lockup
 * plus bordered checklist — no standalone wrapper component.
 */
export default {
  title: "Components/Controls/Rail header (lockup + info box)",
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
    docs: {
      description: {
        component:
          "`HeaderLockup` stacked with `InfoMessageBox` — same chrome as decision-approaches step sidebars.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-black p-8 max-w-lg w-full">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

const messageItems = [
  { id: "c1", label: "Consensus" },
  { id: "c2", label: "Majority vote" },
];

const compose = (args) => (
  <div className="flex w-full min-w-0 flex-col gap-3">
    <HeaderLockup
      title={args.title}
      description={args.description}
      size={args.size}
      justification={args.justification}
    />
    <InfoMessageBox title={args.messageBoxTitle} items={args.messageBoxItems} />
  </div>
);

export const Default = {
  render: compose,
  args: {
    title: "How does your group make decisions?",
    description:
      "Choose the approaches that best match how your community operates.",
    messageBoxTitle: "Common approaches",
    messageBoxItems: messageItems,
    size: "L",
    justification: "left",
  },
};

export const Medium = {
  render: compose,
  args: {
    title: "Decision-making",
    description: "Short description.",
    messageBoxTitle: "Pick any",
    messageBoxItems: [{ id: "x", label: "Single method" }],
    size: "M",
    justification: "left",
  },
};
