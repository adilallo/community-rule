import Selection from "../../app/components/cards/Selection";

export default {
  title: "Components/Cards/Selection",
  component: Selection,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Create flow selection card with support text, recommended/selected states, and horizontal or vertical orientation. Use for communication approaches and similar choices.",
      },
    },
  },
  argTypes: {
    label: {
      control: { type: "text" },
      description: "Primary label text",
    },
    supportText: {
      control: { type: "text" },
      description: "Supporting description below the label",
    },
    recommended: {
      control: { type: "boolean" },
      description: "Show yellow RECOMMENDED pill",
    },
    selected: {
      control: { type: "boolean" },
      description: "Show black SELECTED pill and dotted border",
    },
    orientation: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
      description: "Layout orientation",
    },
    showInfoIcon: {
      control: { type: "boolean" },
      description: "Show info icon next to label (typically in vertical)",
    },
    onClick: { action: "clicked" },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    label: "Label",
    supportText: "Members vote to resolve a dispute democratically.",
    recommended: true,
    selected: false,
    orientation: "horizontal",
    showInfoIcon: false,
  },
};

export const HorizontalRecommended = {
  args: {
    label: "Label",
    supportText:
      "Collaborative work to reach a resolution that all parties can agree upon.",
    recommended: true,
    selected: false,
    orientation: "horizontal",
  },
};

export const HorizontalSelected = {
  args: {
    label: "Label",
    supportText: "Members vote to resolve a dispute democratically.",
    recommended: false,
    selected: true,
    orientation: "horizontal",
  },
};

export const VerticalRecommended = {
  args: {
    label: "Label",
    supportText: "Invite-only",
    recommended: true,
    selected: false,
    orientation: "vertical",
    showInfoIcon: true,
  },
};

export const VerticalSelected = {
  args: {
    label: "Label",
    supportText: "Invite-only",
    recommended: false,
    selected: true,
    orientation: "vertical",
    showInfoIcon: true,
  },
};

export const AllVariants = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
      <div className="space-y-2">
        <p className="font-inter text-sm font-medium text-gray-600">
          Horizontal + Recommended
        </p>
        <Selection
          label="Label"
          supportText="Members vote to resolve a dispute democratically."
          recommended={true}
          selected={false}
          orientation="horizontal"
        />
      </div>
      <div className="space-y-2">
        <p className="font-inter text-sm font-medium text-gray-600">
          Horizontal + Selected
        </p>
        <Selection
          label="Label"
          supportText="Members vote to resolve a dispute democratically."
          recommended={false}
          selected={true}
          orientation="horizontal"
        />
      </div>
      <div className="space-y-2">
        <p className="font-inter text-sm font-medium text-gray-600">
          Vertical + Recommended
        </p>
        <Selection
          label="Label"
          supportText="Invite-only"
          recommended={true}
          selected={false}
          orientation="vertical"
          showInfoIcon={true}
        />
      </div>
      <div className="space-y-2">
        <p className="font-inter text-sm font-medium text-gray-600">
          Vertical + Selected
        </p>
        <Selection
          label="Label"
          supportText="Invite-only"
          recommended={false}
          selected={true}
          orientation="vertical"
          showInfoIcon={true}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All four variants: horizontal/vertical × recommended/selected.",
      },
    },
  },
};
