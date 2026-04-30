import CreateFlowTopNav from "../../app/components/navigation/CreateFlowTopNav";

export default {
  title: "Components/Navigation/CreateFlowTopNav",
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
    saveDraftOnExit: {
      control: "boolean",
      description:
        "After user input (or completed step), use Save & Exit and pass saveDraft: true to onExit",
    },
    onShare: { action: "share clicked" },
    onSelectExportFormat: { action: "export format" },
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
    saveDraftOnExit: false,
  },
};

export const AllButtons = {
  args: {
    hasShare: true,
    hasExport: true,
    hasEdit: true,
    saveDraftOnExit: false,
  },
};

export const SaveDraftOnExit = {
  args: {
    hasShare: true,
    hasExport: true,
    hasEdit: true,
    saveDraftOnExit: true,
  },
};
