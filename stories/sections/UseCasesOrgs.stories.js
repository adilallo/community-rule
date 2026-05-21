import UseCasesOrgs from "../../app/components/sections/UseCasesOrgs";
import CaseStudy from "../../app/components/cards/CaseStudy";

export default {
  title: "Components/Sections/UseCasesOrgs",
  component: UseCasesOrgs,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Figma **Orgs** ([21993-33687](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=21993-33687&m=dev)): **`CaseStudy`** row (**305×305**, **8px** gap, **24px** horizontal / **48px** bottom padding).",
      },
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  render: () => (
    <UseCasesOrgs>
      <CaseStudy
        surface="lavender"
        imageAlt="Mutual Aid Colorado logo"
      />
      <CaseStudy surface="neutral" imageAlt="Food Not Bombs logo" />
      <CaseStudy
        surface="rose"
        imageAlt="Boulder County Street Medics logo"
      />
    </UseCasesOrgs>
  ),
};
