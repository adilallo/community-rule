import AskOrganizer from "../../app/components/sections/AskOrganizer";

export default {
  title: "Components/Sections/AskOrganizer",
  component: AskOrganizer,
  parameters: {
    docs: {
      description: {
        component:
          "The AskOrganizer component provides clear pathways for user inquiries. This component serves as a conversion point throughout the platform.",
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "The main title for the ask organizer section",
    },
    subtitle: {
      control: "text",
      description: "The subtitle text",
    },
    description: {
      control: "text",
      description: "Additional description text",
    },
    buttonText: {
      control: "text",
      description: "Text for the call-to-action button",
    },
    buttonHref: {
      control: "text",
      description: "URL for the button link",
    },
    variant: {
      control: { type: "select" },
      options: ["centered", "left-aligned", "compact", "inverse", "use-case-detail"],
      description: "Layout variant for the component",
    },
    onContactClick: {
      action: "contact clicked",
      description: "Analytics callback for contact button clicks",
    },
  },
};

export const Default = {
  args: {
    title: "Still have questions?",
    subtitle: "Get answers from an experienced organizer",
    buttonText: "Ask an organizer",
    variant: "centered",
    onContactClick: (data) => console.log("Contact clicked:", data),
  },
};

export const LeftAligned = {
  args: {
    title: "Still have questions?",
    subtitle: "Get answers from an experienced organizer",
    buttonText: "Ask an organizer",
    variant: "left-aligned",
    onContactClick: (data) => console.log("Contact clicked:", data),
  },
};

export const Compact = {
  args: {
    title: "Still have questions?",
    subtitle: "Get answers from an experienced organizer",
    buttonText: "Ask an organizer",
    variant: "compact",
    onContactClick: (data) => console.log("Contact clicked:", data),
  },
};

export const Inverse = {
  args: {
    title: "Still have questions?",
    subtitle: "Get answers from an experienced organizer",
    buttonText: "Ask an organizer",
    variant: "inverse",
    onContactClick: (data) => console.log("Contact clicked:", data),
  },
};

export const UseCaseDetail = {
  args: {
    title: "Still have questions?",
    subtitle: "Get answers from an experienced organizer",
    buttonText: "Ask an Organizer",
    variant: "use-case-detail",
    onContactClick: (data) => console.log("Contact clicked:", data),
  },
  decorators: [
    (Story) => (
      <div
        className="min-h-[360px] w-full"
        style={{ background: "var(--color-content-default-brand-lavender)" }}
      >
        <Story />
      </div>
    ),
  ],
};

/** Legacy: CTA is a link (no inquiry modal). */
export const LinkCta = {
  args: {
    title: "Still have questions?",
    subtitle: "Get answers from an experienced organizer",
    buttonText: "Ask an organizer",
    buttonHref: "/contact",
    variant: "centered",
    onContactClick: (data) => console.log("Contact clicked:", data),
  },
};
