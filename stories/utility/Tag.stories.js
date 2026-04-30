import Tag from "../../app/components/utility/Tag";

export default {
  title: "Components/Utility/Tag",
  component: Tag,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Small status tag: recommended (yellow), selected (dark on light), templateRecommended (dark on pastel `Card / Rule`). Default labels are RECOMMENDED/SELECTED; pass children for custom text.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["recommended", "selected", "templateRecommended"],
      description: "Visual variant",
    },
    children: {
      control: { type: "text" },
      description: "Custom label (omit to use default RECOMMENDED/SELECTED)",
    },
  },
};

export const Recommended = {
  args: {
    variant: "recommended",
  },
};

export const Selected = {
  args: {
    variant: "selected",
  },
};

export const TemplateRecommended = {
  args: {
    variant: "templateRecommended",
  },
};

export const CustomLabel = {
  args: {
    variant: "recommended",
    children: "Custom label",
  },
};
