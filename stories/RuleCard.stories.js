import RuleCard from "../app/components/RuleCard";
import Image from "next/image";

export default {
  title: "Components/RuleCard",
  component: RuleCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An interactive card component that displays governance templates and decision-making patterns. Features hover states, keyboard navigation, analytics tracking, and accessibility support. Use Tab key to test focus indicators and Enter/Space to activate.",
      },
    },
  },
  argTypes: {
    title: {
      control: { type: "text" },
      description: "The title of the governance template",
    },
    description: {
      control: { type: "text" },
      description: "The description of the governance pattern",
    },
    backgroundColor: {
      control: { type: "select" },
      options: [
        "bg-[var(--color-surface-default-brand-lime)]",
        "bg-[var(--color-surface-default-brand-rust)]",
        "bg-[var(--color-surface-default-brand-red)]",
        "bg-[var(--color-surface-default-brand-teal)]",
        "bg-[var(--color-community-teal-100)]",
      ],
      description: "The background color variant for the card",
    },
    onClick: { action: "clicked" },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "Consensus clusters",
    description:
      "Units called Circles have the ability to decide and act on matters in their domains, which their members agree on through a Council.",
    backgroundColor: "bg-[var(--color-surface-default-brand-lime)]",
    icon: (
      <Image
        src="assets/Icon_Sociocracy.svg"
        alt="Sociocracy"
        width={40}
        height={40}
        className="md:w-[56px] md:h-[56px] lg:w-[90px] lg:h-[90px]"
      />
    ),
  },
};

export const AllVariants = {
  render: (args) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
      <RuleCard
        title="Consensus clusters"
        description="Units called Circles have the ability to decide and act on matters in their domains, which their members agree on through a Council."
        backgroundColor="bg-[var(--color-surface-default-brand-lime)]"
        icon={
          <Image
            src="assets/Icon_Sociocracy.svg"
            alt="Sociocracy"
            width={40}
            height={40}
            className="md:w-[56px] md:h-[56px] lg:w-[90px] lg:h-[90px]"
          />
        }
        onClick={() => console.log("Consensus clusters selected")}
      />
      <RuleCard
        title="Consensus"
        description="Decisions that affect the group collectively should involve participation of all participants."
        backgroundColor="bg-[var(--color-surface-default-brand-rust)]"
        icon={
          <Image
            src="assets/Icon_Consensus.svg"
            alt="Consensus"
            width={40}
            height={40}
            className="md:w-[56px] md:h-[56px] lg:w-[90px] lg:h-[90px]"
          />
        }
        onClick={() => console.log("Consensus selected")}
      />
      <RuleCard
        title="Elected Board"
        description="An elected board determines policies and organizes their implementation."
        backgroundColor="bg-[var(--color-surface-default-brand-red)]"
        icon={
          <Image
            src="assets/Icon_ElectedBoard.svg"
            alt="Elected Board"
            width={40}
            height={40}
            className="md:w-[56px] md:h-[56px] lg:w-[90px] lg:h-[90px]"
          />
        }
        onClick={() => console.log("Elected Board selected")}
      />
      <RuleCard
        title="Petition"
        description="All participants can propose and vote on proposals for the group."
        backgroundColor="bg-[var(--color-surface-default-brand-teal)]"
        icon={
          <Image
            src="assets/Icon_Petition.svg"
            alt="Petition"
            width={40}
            height={40}
            className="md:w-[56px] md:h-[56px] lg:w-[90px] lg:h-[90px]"
          />
        }
        onClick={() => console.log("Petition selected")}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All four governance template variants with their respective colors and icons. Test hover states, focus indicators, and click interactions.",
      },
    },
  },
};

export const InteractiveStates = {
  args: {
    title: "Interactive Demo",
    description:
      "Hover over this card to see the scale and shadow effects. Use Tab to focus and Enter/Space to activate.",
    backgroundColor: "bg-[var(--color-community-teal-100)]",
    icon: (
      <div className="w-10 h-10 md:w-14 md:h-14 lg:w-[90px] lg:h-[90px] bg-white rounded-full flex items-center justify-center">
        <span className="text-lg font-bold text-gray-800">?</span>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates interactive states including hover effects, focus indicators, and keyboard navigation. Test with mouse hover and keyboard Tab/Enter/Space.",
      },
    },
  },
};

export const AccessibilityTest = {
  args: {
    title: "Accessibility Demo",
    description:
      "This card is designed for accessibility testing. Use Tab to focus, Enter/Space to activate, and screen readers to test ARIA labels.",
    backgroundColor: "bg-[var(--color-surface-default-brand-teal)]",
    icon: (
      <div className="w-10 h-10 md:w-14 md:h-14 lg:w-[90px] lg:h-[90px] bg-white rounded-full flex items-center justify-center">
        <span className="text-lg font-bold text-gray-800">♿</span>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Specifically designed for testing accessibility features including keyboard navigation, screen reader support, and focus management.",
      },
    },
  },
};
