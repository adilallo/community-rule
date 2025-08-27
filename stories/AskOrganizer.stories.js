import AskOrganizer from "../app/components/AskOrganizer";

export default {
  title: "Components/AskOrganizer",
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
  },
};

export const Default = {
  args: {
    title: "Need help getting started?",
    subtitle: "Our organizers are here to support you",
    description:
      "Whether you're forming a new community or improving an existing one, our experienced organizers can provide guidance tailored to your specific needs.",
    buttonText: "Ask an organizer",
    buttonHref: "#contact",
  },
};
