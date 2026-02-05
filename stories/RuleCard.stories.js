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
          "An interactive card component that displays governance templates and decision-making patterns. Features collapsed/expanded states, size variants (L/M), category sections with pills and + buttons, hover states, keyboard navigation, analytics tracking, and accessibility support. Use Tab key to test focus indicators and Enter/Space to activate.",
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
    expanded: {
      control: { type: "boolean" },
      description: "Whether the card is in expanded state",
    },
    size: {
      control: { type: "select" },
      options: ["L", "M", "l", "m"],
      description: "Size variant of the card",
    },
    onClick: { action: "clicked" },
    onPillClick: { action: "pillClicked" },
    onCreateClick: { action: "createClicked" },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "Consensus clusters",
    description:
      "Units called Circles have the ability to decide and act on matters in their domains, which their members agree on through a Council.",
    backgroundColor: "bg-[var(--color-surface-default-brand-lime)]",
    expanded: false,
    size: "L",
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

export const Expanded = {
  args: {
    title: "Mutual Aid Mondays",
    description:
      "Mutual Aid Monday is a grassroots community in Denver, founded in November 2020 by Kelsang Virya, dedicated to supporting neighbors experiencing homelessness.",
    backgroundColor: "bg-[#b7d9d5]",
    expanded: true,
    size: "L",
    logoUrl: "http://localhost:3845/assets/d2513a6ab56f2b2927e8a7c442c06326e7a29541.png",
    logoAlt: "Mutual Aid Mondays",
    categories: [
      {
        name: "Values",
        items: ["Consciousness", "Ecology", "Abundance", "Art", "Decisiveness"],
        createUrl: "/create/value",
      },
      {
        name: "Communication",
        items: ["Signal"],
        createUrl: "/create/communication",
      },
      {
        name: "Membership",
        items: ["Open Admission"],
        createUrl: "/create/membership",
      },
      {
        name: "Decision-making",
        items: ["Lazy Consensus", "Modified Consensus"],
        createUrl: "/create/decision-making",
      },
      {
        name: "Conflict management",
        items: ["Code of Conduct", "Restorative Justice"],
        createUrl: "/create/conflict-management",
      },
    ],
  },
};

export const SizeLarge = {
  args: {
    title: "Consensus clusters",
    description:
      "Units called Circles have the ability to decide and act on matters in their domains, which their members agree on through a Council.",
    backgroundColor: "bg-[var(--color-surface-default-brand-lime)]",
    expanded: false,
    size: "L",
    icon: (
      <Image
        src="assets/Icon_Sociocracy.svg"
        alt="Sociocracy"
        width={103}
        height={103}
      />
    ),
  },
};

export const SizeMedium = {
  args: {
    title: "Consensus clusters",
    description:
      "Units called Circles have the ability to decide and act on matters in their domains, which their members agree on through a Council.",
    backgroundColor: "bg-[var(--color-surface-default-brand-lime)]",
    expanded: false,
    size: "M",
    icon: (
      <Image
        src="assets/Icon_Sociocracy.svg"
        alt="Sociocracy"
        width={56}
        height={56}
      />
    ),
  },
};

export const ExpandedMedium = {
  args: {
    title: "Mutual Aid Mondays",
    description:
      "Mutual Aid Monday is a grassroots community in Denver, founded in November 2020 by Kelsang Virya, dedicated to supporting neighbors experiencing homelessness.",
    backgroundColor: "bg-[#b7d9d5]",
    expanded: true,
    size: "M",
    logoUrl: "http://localhost:3845/assets/d2513a6ab56f2b2927e8a7c442c06326e7a29541.png",
    logoAlt: "Mutual Aid Mondays",
    categories: [
      {
        name: "Values",
        items: ["Consciousness", "Ecology", "Abundance", "Art", "Decisiveness"],
      },
      {
        name: "Communication",
        items: ["Signal"],
      },
      {
        name: "Membership",
        items: ["Open Admission"],
      },
      {
        name: "Decision-making",
        items: ["Lazy Consensus", "Modified Consensus"],
      },
      {
        name: "Conflict management",
        items: ["Code of Conduct", "Restorative Justice"],
      },
    ],
  },
};

export const WithLogoFallback = {
  args: {
    title: "Community Example",
    description:
      "This card shows the logo fallback with community initials when no logo is provided.",
    backgroundColor: "bg-[var(--color-surface-default-brand-teal)]",
    expanded: false,
    size: "L",
    communityInitials: "CE",
  },
};

export const AllVariants = {
  // eslint-disable-next-line no-unused-vars
  render: (_args) => (
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
      "Hover over this card to see the scale and shadow effects. Use Tab to focus and Enter/Space to activate. Click pills and + buttons to see event handlers.",
    backgroundColor: "bg-[var(--color-community-teal-100)]",
    expanded: true,
    size: "L",
    icon: (
      <div className="w-[103px] h-[103px] bg-white rounded-full flex items-center justify-center">
        <span className="text-[36px] font-bold text-gray-800">?</span>
      </div>
    ),
    categories: [
      {
        name: "Values",
        items: ["Consciousness", "Ecology", "Abundance"],
      },
      {
        name: "Communication",
        items: ["Signal"],
      },
    ],
    onPillClick: (category, item) => {
      console.log(`Pill clicked: ${category} - ${item}`);
    },
    onCreateClick: (category) => {
      console.log(`Create clicked: ${category}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates interactive states including hover effects, focus indicators, keyboard navigation, and pill/+ button interactions. Test with mouse hover, keyboard Tab/Enter/Space, and click pills/+ buttons.",
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
