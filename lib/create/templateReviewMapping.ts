import type { Category } from "../../app/components/cards/RuleCard/RuleCard.types";
import type { ChipOption } from "../../app/components/controls/MultiSelect/MultiSelect.types";

function isDocumentEntry(x: unknown): x is { title: string; body: string } {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.title === "string" && typeof o.body === "string";
}

function isDocumentSection(
  x: unknown,
): x is {
  categoryName: string;
  entries: { title: string; body: string }[];
} {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.categoryName !== "string") return false;
  if (!Array.isArray(o.entries)) return false;
  return o.entries.every(isDocumentEntry);
}

/**
 * Maps API template `body` (published-rule document shape) to RuleCard category rows.
 */
export function templateBodyToCategories(body: unknown): Category[] {
  if (!body || typeof body !== "object") return [];
  const sections = (body as Record<string, unknown>).sections;
  if (!Array.isArray(sections)) return [];

  const out: Category[] = [];
  for (const raw of sections) {
    if (!isDocumentSection(raw)) continue;
    const chipOptions: ChipOption[] = raw.entries.map((e, i) => ({
      id: `${raw.categoryName}-${i}`,
      label: e.title,
      state: "unselected",
    }));
    out.push({
      name: raw.categoryName,
      chipOptions,
    });
  }
  return out;
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
    if (isDocumentEntry(first) && first.body.trim()) {
      return first.body.trim();
    }
  }
  return "";
}
