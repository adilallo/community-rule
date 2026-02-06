import MiniCard from "../../app/components/cards/MiniCard";

export default {
  title: "Components/Cards/MiniCard",
  component: MiniCard,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    backgroundColor: {
      control: "select",
      options: [
        "bg-[var(--color-surface-default-brand-royal)]",
        "bg-[#D1FFE2]",
        "bg-[#F4CAFF]",
        "bg-[#CBDDFF]",
      ],
    },
    labelLine1: { control: "text" },
    labelLine2: { control: "text" },
    panelContent: { control: "text" },
    href: { control: "text" },
    onClick: { action: "clicked" },
    ariaLabel: { control: "text" },
  },
};

export const Default = {
  args: {
    backgroundColor: "bg-[var(--color-surface-default-brand-royal)]",
    labelLine1: "Decision-making",
    labelLine2: "support",
    panelContent: "assets/Feature_Support.png",
  },
};

export const ColorVariants = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <MiniCard
        backgroundColor="bg-[var(--color-surface-default-brand-royal)]"
        labelLine1="Decision-making"
        labelLine2="support"
        panelContent="assets/Feature_Support.png"
      />
      <MiniCard
        backgroundColor="bg-[#D1FFE2]"
        labelLine1="Values alignment"
        labelLine2="exercises"
        panelContent="assets/Feature_Exercises.png"
      />
      <MiniCard
        backgroundColor="bg-[#F4CAFF]"
        labelLine1="Membership"
        labelLine2="guidance"
        panelContent="assets/Feature_Guidance.png"
      />
      <MiniCard
        backgroundColor="bg-[#CBDDFF]"
        labelLine1="Conflict resolution"
        labelLine2="tools"
        panelContent="assets/Feature_Tools.png"
      />
    </div>
  ),
};

export const AsLink = {
  args: {
    backgroundColor: "bg-[var(--color-surface-default-brand-royal)]",
    labelLine1: "Decision-making",
    labelLine2: "support",
    panelContent: "assets/Feature_Support.png",
    href: "#decision-making",
    ariaLabel: "Navigate to decision-making support tools",
  },
};
