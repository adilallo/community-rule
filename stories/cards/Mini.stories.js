import Mini from "../../app/components/cards/Mini";

export default {
  title: "Components/Cards/Mini",
  component: Mini,
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
    panelContent: "assets/marketing/feature-support.png",
  },
};

export const ColorVariants = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Mini
        backgroundColor="bg-[var(--color-surface-default-brand-royal)]"
        labelLine1="Decision-making"
        labelLine2="support"
        panelContent="assets/marketing/feature-support.png"
      />
      <Mini
        backgroundColor="bg-[#D1FFE2]"
        labelLine1="Values alignment"
        labelLine2="exercises"
        panelContent="assets/marketing/feature-exercises.png"
      />
      <Mini
        backgroundColor="bg-[#F4CAFF]"
        labelLine1="Membership"
        labelLine2="guidance"
        panelContent="assets/marketing/feature-guidance.png"
      />
      <Mini
        backgroundColor="bg-[#CBDDFF]"
        labelLine1="Conflict resolution"
        labelLine2="tools"
        panelContent="assets/marketing/feature-tools.png"
      />
    </div>
  ),
};

export const AsLink = {
  args: {
    backgroundColor: "bg-[var(--color-surface-default-brand-royal)]",
    labelLine1: "Decision-making",
    labelLine2: "support",
    panelContent: "assets/marketing/feature-support.png",
    href: "#decision-making",
    ariaLabel: "Navigate to decision-making support tools",
  },
};
