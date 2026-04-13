import type { TemplateGridCardEntry } from "../../../../lib/templates/templateGridPresentation";

export interface RuleStackProps {
  className?: string;
  /**
   * When set (e.g. from a Server Component), first paint uses this data and
   * the client skips the `/api/templates` request.
   */
  initialGridEntries?: TemplateGridCardEntry[];
}

export interface RuleStackViewProps {
  className: string;
  onTemplateClick: (_slug: string) => void;
  /** `null` while loading curated templates from the API. */
  gridEntries: TemplateGridCardEntry[] | null;
}
