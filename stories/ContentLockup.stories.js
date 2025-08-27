import ContentLockup from "../app/components/ContentLockup";

export default {
  title: "Components/ContentLockup",
  component: ContentLockup,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: { control: { type: "text" } },
    subtitle: { control: { type: "text" } },
    description: { control: { type: "text" } },
    ctaText: { control: { type: "text" } },
    ctaHref: { control: { type: "text" } },
    buttonClassName: { control: { type: "text" } },
    variant: {
      control: { type: "select" },
      options: ["hero", "feature"],
    },
    linkText: { control: { type: "text" } },
    linkHref: { control: { type: "text" } },
  },
};

export const Hero = {
  args: {
    title: "Collaborate",
    subtitle: "with clarity",
    description:
      "Help your community make important decisions in a way that reflects its unique values.",
    ctaText: "Learn how Community Rule works",
    ctaHref: "#",
    variant: "hero",
  },
};

export const Feature = {
  args: {
    title: "Build",
    subtitle: "consensus",
    description:
      "Create structured decision-making processes that help your community reach agreement on important matters.",
    ctaText: "Explore consensus methods",
    ctaHref: "#",
    variant: "feature",
  },
};

export const FeatureWithLink = {
  args: {
    title: "We've got your back, every step of the way",
    subtitle:
      "Use our toolkit to improve, document, and evolve your organization.",
    variant: "feature",
    linkText: "Learn more",
    linkHref: "#",
  },
};
