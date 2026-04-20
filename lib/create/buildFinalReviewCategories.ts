import type { CreateFlowState } from "../../app/(app)/create/types";
import communicationMessages from "../../messages/en/create/customRule/communication.json";
import conflictManagementMessages from "../../messages/en/create/customRule/conflictManagement.json";
import decisionApproachesMessages from "../../messages/en/create/customRule/decisionApproaches.json";
import membershipMessages from "../../messages/en/create/customRule/membership.json";
import {
  buildCoreValuesForDocument,
  parseSectionsFromCreateFlowState,
} from "./buildPublishPayload";

/**
 * Chip row shape shared with `messages/en/create/reviewAndComplete/finalReview.json`
 * so the final-review screen can keep its existing category → chip label rendering
 * contract regardless of whether chips came from state or from fallback content.
 */
export type FinalReviewCategoryRow = { name: string; chips: string[] };

/** Category labels supplied by the caller (pulled from localized messages). */
export type FinalReviewCategoryNames = {
  values: string;
  communication: string;
  membership: string;
  decisions: string;
  conflict: string;
};

type MethodPreset = { id: string; label: string };

function readMethodsArray(source: unknown): MethodPreset[] {
  if (!source || typeof source !== "object") return [];
  const methods = (source as { methods?: unknown }).methods;
  if (!Array.isArray(methods)) return [];
  const out: MethodPreset[] = [];
  for (const raw of methods) {
    if (!raw || typeof raw !== "object") continue;
    const o = raw as Record<string, unknown>;
    if (typeof o.id === "string" && typeof o.label === "string") {
      out.push({ id: o.id, label: o.label });
    }
  }
  return out;
}

function labelsFromIds(
  ids: readonly string[] | undefined,
  methods: readonly MethodPreset[],
): string[] {
  if (!ids || ids.length === 0) return [];
  const byId = new Map(methods.map((m) => [m.id, m.label] as const));
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    const label = byId.get(id);
    if (typeof label !== "string" || label.length === 0) continue;
    if (seen.has(label)) continue;
    seen.add(label);
    out.push(label);
  }
  return out;
}

/**
 * Derive the final-review RuleCard category rows from the current
 * {@link CreateFlowState}.
 *
 * Two-mode contract, mirroring the two template entry points:
 * 1. **Use without changes** — `state.sections` carries the applied template
 *    body; we render it verbatim (`categoryName` + entry `title`s). Core
 *    values still come from `buildCoreValuesForDocument` when they were
 *    captured separately.
 * 2. **Customize / plain custom-rule flow** — each Create Custom screen writes
 *    its selection ids into a dedicated state field. We resolve those ids
 *    against the curated message `methods[]` list to get the display labels,
 *    matching what the user saw as chips in-flow.
 *
 * Empty categories are filtered out so the review card doesn't render headings
 * with no chips. If nothing in state resolves to any chip, the caller should
 * fall back to the demo categories shipped in `finalReview.json`.
 */
export function buildFinalReviewCategoriesFromState(
  state: CreateFlowState,
  names: FinalReviewCategoryNames,
): FinalReviewCategoryRow[] {
  const sections = parseSectionsFromCreateFlowState(state);
  const coreValueLabels = buildCoreValuesForDocument(state).map((r) => r.label);

  // Use-without-changes / pre-rendered template body: the sections array is
  // the source of truth. Collapse each section's entries to its titles; the
  // RuleCard category UI shows only labels, not per-entry body copy.
  if (sections.length > 0) {
    const rows: FinalReviewCategoryRow[] = [];

    // If core values were also captured (e.g., the template surfaced both),
    // keep them up top for visual parity with the custom-rule flow. Otherwise
    // any `Values` section already inside `sections` covers the same ground.
    if (coreValueLabels.length > 0) {
      const hasValuesSection = sections.some(
        (s) => s.categoryName.toLowerCase() === names.values.toLowerCase(),
      );
      if (!hasValuesSection) {
        rows.push({ name: names.values, chips: coreValueLabels });
      }
    }

    for (const s of sections) {
      const chips = s.entries
        .map((e) => e.title.trim())
        .filter((t) => t.length > 0);
      if (chips.length === 0) continue;
      rows.push({ name: s.categoryName, chips });
    }
    return rows;
  }

  const communicationMethods = readMethodsArray(communicationMessages);
  const membershipMethods = readMethodsArray(membershipMessages);
  const decisionApproachMethods = readMethodsArray(decisionApproachesMessages);
  const conflictManagementMethods = readMethodsArray(conflictManagementMessages);

  const rows: FinalReviewCategoryRow[] = [
    { name: names.values, chips: coreValueLabels },
    {
      name: names.communication,
      chips: labelsFromIds(
        state.selectedCommunicationMethodIds,
        communicationMethods,
      ),
    },
    {
      name: names.membership,
      chips: labelsFromIds(
        state.selectedMembershipMethodIds,
        membershipMethods,
      ),
    },
    {
      name: names.decisions,
      chips: labelsFromIds(
        state.selectedDecisionApproachIds,
        decisionApproachMethods,
      ),
    },
    {
      name: names.conflict,
      chips: labelsFromIds(
        state.selectedConflictManagementIds,
        conflictManagementMethods,
      ),
    },
  ];
  return rows.filter((r) => r.chips.length > 0);
}
