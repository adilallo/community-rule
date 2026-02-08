import CreateFlowTopNav from "../../app/components/utility/CreateFlowTopNav";

export default {
  title: "Components/Utility/CreateFlowTopNav",
  component: CreateFlowTopNav,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Top navigation bar for the create rule flow. Includes logo and action buttons (Share, Export, Edit, Exit/Save & Exit).",
      },
    },
  },
  argTypes: {
    hasShare: {
      control: "boolean",
      description: "Whether to show the Share button",
    },
    hasExport: {
      control: "boolean",
      description: "Whether to show the Export button",
    },
    hasEdit: {
      control: "boolean",
      description: "Whether to show the Edit button",
    },
    loggedIn: {
      control: "boolean",
      description: "Whether the user is logged in (affects Exit button text)",
    },
    onShare: { action: "share clicked" },
    onExport: { action: "export clicked" },
    onEdit: { action: "edit clicked" },
    onExit: { action: "exit clicked" },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    hasShare: false,
    hasExport: false,
    hasEdit: false,
    loggedIn: false,
  },
};

export const AllButtons = {
  args: {
    hasShare: true,
    hasExport: true,
    hasEdit: true,
    loggedIn: false,
  },
};

export const LoggedIn = {
  args: {
    hasShare: true,
    hasExport: true,
    hasEdit: true,
    loggedIn: true,
  },
};
