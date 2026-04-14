import { listRuleTemplatesFromDb } from "../../../lib/server/ruleTemplates";
import { gridEntriesForFullCatalogWithFallback } from "../../../lib/templates/templateGridPresentation";
import TemplatesPageClient from "./TemplatesPageClient";

export default async function TemplatesPage() {
  const rows = await listRuleTemplatesFromDb();
  const initialGridEntries = gridEntriesForFullCatalogWithFallback(rows);
  return <TemplatesPageClient initialGridEntries={initialGridEntries} />;
}
