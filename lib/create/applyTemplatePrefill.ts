import type {
  CommunityStructureChipSnapshotRow,
  CreateFlowState,
} from "../../app/(app)/create/types";
import coreValuesMessages from "../../messages/en/create/customRule/coreValues.json";
import { methodSlugFromTitle } from "./methodSlugFromTitle";

type TemplateEntry = { title: unknown };
type TemplateSection = { categoryName: unknown; entries: unknown };

function isTemplateSection(x: unknown): x is TemplateSection {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.categoryName === "string" && Array.isArray(o.entries);
}

function entryTitles(entries: unknown): string[] {
  if (!Array.isArray(entries)) return [];
  const out: string[] = [];
  for (const raw of entries) {
    if (!raw || typeof raw !== "object") continue;
    const title = (raw as TemplateEntry).title;
    if (typeof title !== "string") continue;
    const trimmed = title.trim();
    if (trimmed.length > 0) out.push(trimmed);
  }
  return out;
}

/** Normalise a Figma template category header ("Decision-making") for matching. */
function normaliseCategoryKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z]+/g, "");
}

/** Preset core-value labels with the chip id (1-based preset index as string) the select screen expects. */
type CorePresetRow = { id: string; label: string };
const CORE_VALUE_PRESETS: readonly CorePresetRow[] = (() => {
  const raw = (coreValuesMessages as { values: unknown }).values;
  if (!Array.isArray(raw)) return [];
  return raw.map((v, i) => ({
    id: String(i + 1),
    label: typeof v === "string" ? v : (v as { label: string }).label,
  }));
})();

function buildCoreValuePrefill(
  titles: readonly string[],
): Pick<CreateFlowState, "selectedCoreValueIds" | "coreValuesChipsSnapshot"> {
  const wantedByLower = new Map<string, string>();
  for (const t of titles) wantedByLower.set(t.toLowerCase(), t);

  const selected: string[] = [];
  const snapshot: CommunityStructureChipSnapshotRow[] = [];

  for (const preset of CORE_VALUE_PRESETS) {
    const isSelected = wantedByLower.delete(preset.label.toLowerCase());
    snapshot.push({
      id: preset.id,
      label: preset.label,
      state: isSelected ? "selected" : "unselected",
    });
    if (isSelected) selected.push(preset.id);
  }

  // Any template labels not matching a preset ride along as custom chip rows
  // so templates authored with bespoke values still pre-select on the screen.
  for (const original of wantedByLower.values()) {
    const id = `template-cv-${methodSlugFromTitle(original) || snapshot.length}`;
    snapshot.push({ id, label: original, state: "selected" });
    selected.push(id);
  }

  return {
    selectedCoreValueIds: selected,
    coreValuesChipsSnapshot: snapshot,
  };
}

/**
 * Variant of {@link buildTemplateCustomizePrefill} that pulls *only* the
 * Values section out of a template body. Used by the "Use without changes"
 * handler so the verbatim template flow still seeds
 * `coreValuesChipsSnapshot` + `selectedCoreValueIds` — without that, the
 * final-review screen has no per-chip ids to attach edits to and falls
 * back to the read-only chip modal for values.
 *
 * Returns an empty object when the body is malformed or has no Values
 * section.
 */
export function buildCoreValuesPrefillFromTemplateBody(
  body: unknown,
): Partial<CreateFlowState> {
  if (!body || typeof body !== "object") return {};
  const sections = (body as { sections?: unknown }).sections;
  if (!Array.isArray(sections)) return {};

  for (const raw of sections) {
    if (!isTemplateSection(raw)) continue;
    const key = normaliseCategoryKey(raw.categoryName as string);
    if (key !== "values" && key !== "corevalues") continue;
    const titles = entryTitles(raw.entries);
    if (titles.length === 0) continue;
    return buildCoreValuePrefill(titles);
  }

  return {};
}

/**
 * Map a curated template `body` (DB shape — `sections[]` with `categoryName`
 * + `entries[].title`) to the `CreateFlowState` keys the Create Custom Rule
 * screens read for pre-selection. Used by the "Customize" handler on
 * `/create/review-template/[slug]` so clicking Customize drops the user into
 * the custom-rule flow with the template's chips already highlighted.
 *
 * Produces:
 * - `selectedCoreValueIds` + `coreValuesChipsSnapshot` — preset match by
 *   label; non-matching titles become custom chip rows so bespoke template
 *   values still appear selected.
 * - `selectedCommunicationMethodIds`, `selectedMembershipMethodIds`,
 *   `selectedDecisionApproachIds`, `selectedConflictManagementIds` — chip
 *   ids derived via {@link methodSlugFromTitle}, matching the `methods[].id`
 *   produced by the one-time messages ingest.
 *
 * Returns an empty object for malformed bodies (no sections array).
 */
export function buildTemplateCustomizePrefill(
  body: unknown,
): Partial<CreateFlowState> {
  if (!body || typeof body !== "object") return {};
  const sections = (body as { sections?: unknown }).sections;
  if (!Array.isArray(sections)) return {};

  const prefill: Partial<CreateFlowState> = {};

  for (const raw of sections) {
    if (!isTemplateSection(raw)) continue;
    const key = normaliseCategoryKey(raw.categoryName as string);
    const titles = entryTitles(raw.entries);
    if (titles.length === 0) continue;

    if (key === "values" || key === "corevalues") {
      Object.assign(prefill, buildCoreValuePrefill(titles));
      continue;
    }

    const slugs = titles.map(methodSlugFromTitle).filter((s) => s.length > 0);
    if (slugs.length === 0) continue;

    switch (key) {
      case "communication":
      case "communications":
        prefill.selectedCommunicationMethodIds = slugs;
        break;
      case "membership":
      case "memberships":
        prefill.selectedMembershipMethodIds = slugs;
        break;
      case "decisionmaking":
      case "decisionapproaches":
      case "decisions":
        prefill.selectedDecisionApproachIds = slugs;
        break;
      case "conflictmanagement":
      case "conflict":
      case "conflictresolution":
        prefill.selectedConflictManagementIds = slugs;
        break;
      default:
        break;
    }
  }

  return prefill;
}
