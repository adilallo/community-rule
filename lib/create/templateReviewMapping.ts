import type { Category } from "../../app/components/cards/Rule";
import type { ChipOption } from "../../app/components/controls/MultiSelect/MultiSelect.types";
import type { CommunityRuleSection } from "../../app/components/type/CommunityRule/CommunityRule.types";
import { isDocumentEntry } from "./documentEntryGuards";

function isDocumentSection(x: unknown): x is CommunityRuleSection {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.categoryName !== "string") return false;
  if (!Array.isArray(o.entries)) return false;
  return o.entries.every(isDocumentEntry);
}

/**
 * Known facet groups that template sections map to. Matches the five modals on
 * the custom-rule create flow (`m.create.customRule.*`).
 */
export type TemplateFacetGroupKey =
  | "coreValues"
  | "communication"
  | "membership"
  | "decisionApproaches"
  | "conflictManagement";

/**
 * Normalize a section `categoryName` (as it appears in a template's `body`)
 * to the custom-rule facet-group key. Returns `null` for unknown categories.
 * Keys are matched case- and punctuation-insensitively so variations like
 * "Decision making" / "Decision-making" resolve to the same group.
 */
export function templateCategoryToGroupKey(
  categoryName: string,
): TemplateFacetGroupKey | null {
  const key = categoryName.toLowerCase().replace(/[^a-z]+/g, "");
  switch (key) {
    case "values":
    case "corevalues":
      return "coreValues";
    case "communication":
    case "communications":
      return "communication";
    case "membership":
    case "memberships":
      return "membership";
    case "decisionmaking":
    case "decisionapproaches":
    case "decisions":
      return "decisionApproaches";
    case "conflictmanagement":
    case "conflict":
    case "conflictresolution":
      return "conflictManagement";
    default:
      return null;
  }
}

/**
 * Detail for a single chip rendered on a template review — includes the raw
 * entry fields plus the facet-group key so a click can open the matching
 * read-only modal (chip `label` is used to look up the preset method inside
 * the group).
 */
export interface TemplateChipDetail {
  chipId: string;
  chipLabel: string;
  categoryName: string;
  groupKey: TemplateFacetGroupKey | null;
  body: string;
}

/**
 * Maps API template `body` (published-rule document shape) to Rule category
 * rows **plus** a chipId → detail lookup for wiring chip clicks to the
 * read-only detail modal.
 */
export function templateBodyToReviewData(body: unknown): {
  categories: Category[];
  chipDetailsByChipId: Record<string, TemplateChipDetail>;
} {
  const empty = { categories: [] as Category[], chipDetailsByChipId: {} };
  if (!body || typeof body !== "object") return empty;
  const sections = (body as Record<string, unknown>).sections;
  if (!Array.isArray(sections)) return empty;

  const categories: Category[] = [];
  const chipDetailsByChipId: Record<string, TemplateChipDetail> = {};
  for (const raw of sections) {
    if (!isDocumentSection(raw)) continue;
    const groupKey = templateCategoryToGroupKey(raw.categoryName);
    const chipOptions: ChipOption[] = raw.entries.map((e, i) => {
      const chipId = `${raw.categoryName}-${i}`;
      chipDetailsByChipId[chipId] = {
        chipId,
        chipLabel: e.title,
        categoryName: raw.categoryName,
        groupKey,
        body: e.body,
      };
      return {
        id: chipId,
        label: e.title,
        state: "unselected",
      };
    });
    categories.push({
      name: raw.categoryName,
      chipOptions,
    });
  }
  return { categories, chipDetailsByChipId };
}

/**
 * Backwards-compatible wrapper kept so existing consumers can still grab just
 * the rows when they don't need chip-click wiring.
 */
export function templateBodyToCategories(body: unknown): Category[] {
  return templateBodyToReviewData(body).categories;
}

/**
 * Summary line under tag rows: prefer API description; else first entry bodies (short).
 */
export function templateSummaryFromBody(
  description: string | null | undefined,
  body: unknown,
): string {
  const d = typeof description === "string" ? description.trim() : "";
  if (d.length > 0) return d;

  if (!body || typeof body !== "object") return "";
  const sections = (body as Record<string, unknown>).sections;
  if (!Array.isArray(sections)) return "";
  for (const s of sections) {
    if (!isDocumentSection(s)) continue;
    const first = s.entries[0];
    if (isDocumentEntry(first)) {
      const main = first.body.trim();
      if (main.length > 0) return main;
      const fromBlock = first.blocks?.[0]?.body?.trim();
      if (fromBlock && fromBlock.length > 0) return fromBlock;
    }
  }
  return "";
}
