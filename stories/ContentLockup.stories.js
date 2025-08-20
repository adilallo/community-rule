import ContentLockup from "../app/components/ContentLockup";

export default {
  title: "Components/ContentLockup",
  component: ContentLockup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A content lockup component that groups title, subtitle, description, and CTA button. Features responsive typography and spacing that adapts across breakpoints. Used within the HeroBanner component.",
      },
    },
  },
  argTypes: {
    title: {
      control: { type: "text" },
      description: "The main title text",
    },
    subtitle: {
      control: { type: "text" },
      description: "The subtitle text",
    },
    description: {
      control: { type: "text" },
      description: "The description text",
    },
    ctaText: {
      control: { type: "text" },
      description: "The call-to-action button text",
    },
    ctaHref: {
      control: { type: "text" },
      description: "The call-to-action button link",
    },
    buttonClassName: {
      control: { type: "text" },
      description:
        "Additional CSS classes to apply to the large button (md/lg breakpoints)",
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "Collaborate",
    subtitle: "with clarity",
    description:
      "Help your community make important decisions in a way that reflects its unique values.",
    ctaText: "Learn how Community Rule works",
    ctaHref: "#",
  },
  parameters: {
    docs: {
      description: {
        story: "Default content lockup with standard Community Rule messaging.",
      },
    },
  },
};

export const LongDescription = {
  args: {
    title: "Collaborate",
    subtitle: "with clarity",
    description:
      "Help your community make important decisions in a way that reflects its unique values. Our platform provides the tools and frameworks needed to build successful, sustainable communities that can navigate complex challenges together.",
    ctaText: "Learn how Community Rule works",
    ctaHref: "#",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Content lockup with longer description text to test text wrapping.",
      },
    },
  },
};

export const ShortContent = {
  args: {
    title: "Simple",
    subtitle: "solution",
    description: "Easy community decision making.",
    ctaText: "Try it",
    ctaHref: "#",
  },
  parameters: {
    docs: {
      description: {
        story: "Content lockup with minimal content to test compact layouts.",
      },
    },
  },
};

export const CustomButtonStyling = {
  args: {
    title: "Collaborate",
    subtitle: "with clarity",
    description:
      "Help your community make important decisions in a way that reflects its unique values.",
    ctaText: "Learn how Community Rule works",
    ctaHref: "#",
    buttonClassName: "shrink-0 whitespace-nowrap min-w-[280px]",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Content lockup with custom button styling applied to the large button (md/lg breakpoints).",
      },
    },
  },
};
