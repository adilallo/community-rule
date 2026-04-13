import dynamic from "next/dynamic";
import { listRuleTemplatesFromDb } from "../../lib/server/ruleTemplates";
import { GOVERNANCE_TEMPLATE_HOME_SLUGS } from "../../lib/templates/governanceTemplateCatalog";
import { gridEntriesForSlugOrderWithCatalogFallback } from "../../lib/templates/templateGridPresentation";

const RuleStack = dynamic(() => import("../components/sections/RuleStack"), {
  loading: () => (
    <section className="py-[var(--spacing-scale-032)] min-h-[400px]" />
  ),
  ssr: true,
});

/**
 * Server-loaded “Popular templates” row so the first paint has card data without a client fetch.
 */
export async function MarketingRuleStackSection() {
  const rows = await listRuleTemplatesFromDb();
  const initialGridEntries = gridEntriesForSlugOrderWithCatalogFallback(
    rows,
    GOVERNANCE_TEMPLATE_HOME_SLUGS,
  );
  return <RuleStack initialGridEntries={initialGridEntries} />;
}
