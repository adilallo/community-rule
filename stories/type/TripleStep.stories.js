import TripleStep from "../../app/components/type/TripleStep";

const sampleSteps = [
  {
    title: "Get your stakeholders together",
    body: "If you're just getting started, you might begin with shared values, decision-making plan, and conflict resolution process.",
  },
  {
    title: "Define how your group should operate",
    body: "Involving everyone in shaping these agreements through group discussions, workshops, or a tool like CommunityRule can help build collective buy-in.",
  },
  {
    title: "Have a durable impact",
    body: "Consider treating guidelines as a living document that evolves with your group's needs.",
  },
];

export default {
  title: "Components/Type/TripleStep",
  component: TripleStep,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Figma **Section / Triple Step** ([22084-859405](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22084-859405&m=dev)); type baseline ([22112-871527](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22112-871527)). Headline uses **Large/Heading** from **md**; steps use **18px/22px** Bricolage medium + **Small/Paragraph** (14/20); outline CTA; **md+** second column shows **`triple-step.svg`**.",
      },
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    heading: "Get recommendations that will make organizing easier",
    steps: sampleSteps,
    ctaText: "Create Rule",
    ctaHref: "/create",
  },
};
