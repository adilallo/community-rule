import { describe, vi } from "vitest";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";
import { GovernanceTemplateGrid } from "../../app/components/sections/GovernanceTemplateGrid";
import { GOVERNANCE_TEMPLATE_CATALOG } from "../../lib/templates/governanceTemplateCatalog";

type Props = React.ComponentProps<typeof GovernanceTemplateGrid>;

const config: ComponentTestSuiteConfig<Props> = {
  component: GovernanceTemplateGrid,
  name: "GovernanceTemplateGrid",
  props: {
    entries: GOVERNANCE_TEMPLATE_CATALOG.slice(0, 2),
    onTemplateClick: vi.fn(),
  } as Props,
  requiredProps: ["entries", "onTemplateClick"],
  primaryRole: "button",
  testCases: {
    renders: true,
    accessibility: true,
  },
};

describe("GovernanceTemplateGrid", () => {
  componentTestSuite<Props>(config);
});
