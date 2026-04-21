import { GovernanceTemplateGrid } from "../../app/components/sections/GovernanceTemplateGrid";
import { GOVERNANCE_TEMPLATE_CATALOG } from "../../lib/templates/governanceTemplateCatalog";

export default {
  title: "Components/Sections/GovernanceTemplateGrid",
  component: GovernanceTemplateGrid,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    entries: {
      control: false,
      description: "Catalog entries to render as a 2-column grid of RuleCards",
    },
    onTemplateClick: { action: "template-clicked" },
  },
};

export const Default = {
  args: {
    entries: GOVERNANCE_TEMPLATE_CATALOG.slice(0, 4),
  },
};

export const SingleEntry = {
  args: {
    entries: GOVERNANCE_TEMPLATE_CATALOG.slice(0, 1),
  },
};
