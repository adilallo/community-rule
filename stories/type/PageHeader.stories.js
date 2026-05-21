import PageHeader from "../../app/components/type/PageHeader";

export default {
  title: "Components/Type/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Figma **Type / PageHeader** ([21004-15902](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=21004-15902)). Marketing hero: title, body, optional inverse pill CTA.",
      },
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "Mutual aid groups should define structure before they need it",
    description:
      "Many mutual aid groups deprioritize guidelines in favor of immediate action, but setting up a few key agreements early protects the group's mission.",
    ctaText: "Create CommunityRule",
    ctaHref: "/create",
  },
};

export const WithoutCta = {
  args: {
    title: "Headline only",
    description: "Supporting copy without a call to action.",
  },
};

/** Use cases header: stacked below `lg`; single line at **`lg`** ([21004-24825](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=21004-24825&m=dev)). */
export const UseCasesMinimal = {
  args: {
    title: ["See how groups use", "CommunityRule"],
    headingAlign: "center",
    sectionMinimal: true,
    singleLineTitleFromLg: true,
  },
};
