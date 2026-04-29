import communicationMessages from "../../messages/en/create/customRule/communication.json";
import conflictManagementMessages from "../../messages/en/create/customRule/conflictManagement.json";
import coreValuesMessages from "../../messages/en/create/customRule/coreValues.json";
import decisionApproachesMessages from "../../messages/en/create/customRule/decisionApproaches.json";
import membershipMessages from "../../messages/en/create/customRule/membership.json";
import type { TemplateFacetGroupKey } from "./templateReviewMapping";
import type {
  CommunicationMethodDetailEntry,
  ConflictManagementDetailEntry,
  CoreValueDetailEntry,
  DecisionApproachDetailEntry,
  MembershipMethodDetailEntry,
} from "../../app/(app)/create/types";

/**
 * Per-method preset defaults shipped in `messages/en/create/customRule/*.json`.
 * Used to seed the final-review edit modal when the user has no saved
 * override yet, and to merge onto overrides when emitting the published rule
 * document so every method carries a complete section payload even if the
 * author only edited a subset of fields.
 */
type CustomRuleMethodRow = {
  id: string;
  label: string;
  supportText?: string;
  sections?: Record<string, unknown>;
};

function readMethodsArray(source: unknown): CustomRuleMethodRow[] {
  if (!source || typeof source !== "object") return [];
  const methods = (source as { methods?: unknown }).methods;
  if (!Array.isArray(methods)) return [];
  const out: CustomRuleMethodRow[] = [];
  for (const raw of methods) {
    if (!raw || typeof raw !== "object") continue;
    const o = raw as Record<string, unknown>;
    if (typeof o.id !== "string" || typeof o.label !== "string") continue;
    out.push({
      id: o.id,
      label: o.label,
      supportText:
        typeof o.supportText === "string" ? o.supportText : undefined,
      sections:
        o.sections && typeof o.sections === "object"
          ? (o.sections as Record<string, unknown>)
          : undefined,
    });
  }
  return out;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const v of value) {
    if (typeof v === "string") out.push(v);
  }
  return out;
}

function asNumberClamped(
  value: unknown,
  min: number,
  max: number,
  fallback: number,
): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  if (value < min) return min;
  if (value > max) return max;
  return Math.round(value);
}

function findMethod(
  source: unknown,
  id: string,
): CustomRuleMethodRow | null {
  const rows = readMethodsArray(source);
  return rows.find((r) => r.id === id) ?? null;
}

/** Preset-default communication sections for a given method id. */
export function communicationPresetFor(
  id: string,
): CommunicationMethodDetailEntry {
  const method = findMethod(communicationMessages, id);
  const s = method?.sections ?? {};
  return {
    corePrinciple: asString(s.corePrinciple),
    logisticsAdmin: asString(s.logisticsAdmin),
    codeOfConduct: asString(s.codeOfConduct),
  };
}

export function membershipPresetFor(id: string): MembershipMethodDetailEntry {
  const method = findMethod(membershipMessages, id);
  const s = method?.sections ?? {};
  return {
    eligibility: asString(s.eligibility),
    joiningProcess: asString(s.joiningProcess),
    expectations: asString(s.expectations),
  };
}

/** Default consensus level used when presets omit a value (see DecisionApproachesScreen). */
export const DECISION_CONSENSUS_LEVEL_DEFAULT = 75;

export function decisionApproachPresetFor(
  id: string,
): DecisionApproachDetailEntry {
  const method = findMethod(decisionApproachesMessages, id);
  const s = method?.sections ?? {};
  return {
    corePrinciple: asString(s.corePrinciple),
    applicableScope: asStringArray(s.applicableScope),
    selectedApplicableScope: [],
    stepByStepInstructions: asString(s.stepByStepInstructions),
    consensusLevel: asNumberClamped(
      s.consensusLevel,
      0,
      100,
      DECISION_CONSENSUS_LEVEL_DEFAULT,
    ),
    objectionsDeadlocks: asString(s.objectionsDeadlocks),
  };
}

export function conflictManagementPresetFor(
  id: string,
): ConflictManagementDetailEntry {
  const method = findMethod(conflictManagementMessages, id);
  const s = method?.sections ?? {};
  return {
    corePrinciple: asString(s.corePrinciple),
    applicableScope: asStringArray(s.applicableScope),
    selectedApplicableScope: [],
    processProtocol: asString(s.processProtocol),
    restorationFallbacks: asString(s.restorationFallbacks),
  };
}

/**
 * Preset meaning/signals for a core value chip. Mirrors `CoreValuesSelectScreen`'s
 * `getInitialTexts` so the final-review edit modal opens with the same
 * preset copy the select screen would have shown — without requiring the
 * user to have opened the select-screen modal first.
 *
 * Lookup order:
 * 1. Numeric chip id → 1-based index into `coreValues.json` `values[]`
 *    (matches `CoreValuesSelectScreen` chip ids).
 * 2. Otherwise → empty (bespoke / template-derived chip with no preset).
 */
export function coreValuePresetFor(chipId: string): CoreValueDetailEntry {
  const values = (coreValuesMessages as { values?: unknown }).values;
  if (!Array.isArray(values)) return { meaning: "", signals: "" };
  const idx = Number.parseInt(chipId, 10);
  if (!Number.isInteger(idx) || idx < 1 || idx > values.length) {
    return { meaning: "", signals: "" };
  }
  const row = values[idx - 1];
  if (!row || typeof row !== "object") return { meaning: "", signals: "" };
  const o = row as Record<string, unknown>;
  return {
    meaning: asString(o.meaning),
    signals: asString(o.signals),
  };
}

/** Match `coreValues.json` row by trimmed label (custom chip id / drift fallbacks). */
export function coreValuePresetForLabel(label: string): CoreValueDetailEntry {
  const t = label.trim();
  if (!t) return { meaning: "", signals: "" };
  const values = (coreValuesMessages as { values?: unknown }).values;
  if (!Array.isArray(values)) return { meaning: "", signals: "" };
  for (const row of values) {
    if (typeof row === "string") {
      if (row.trim() === t) return { meaning: "", signals: "" };
      continue;
    }
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    if (typeof o.label === "string" && o.label.trim() === t) {
      return {
        meaning: asString(o.meaning),
        signals: asString(o.signals),
      };
    }
  }
  return { meaning: "", signals: "" };
}

/**
 * Published / display copy: saved draft wins when non-empty; otherwise preset
 * by chip id (numeric presets), then by label match in `coreValues.json`.
 */
export function mergeCoreValueDetailWithPresets(
  chipId: string,
  label: string,
  saved: CoreValueDetailEntry | undefined,
): CoreValueDetailEntry {
  const savedMeaning =
    typeof saved?.meaning === "string" ? saved.meaning.trim() : "";
  const savedSignals =
    typeof saved?.signals === "string" ? saved.signals.trim() : "";
  const fromId = coreValuePresetFor(chipId);
  const fromLabel = coreValuePresetForLabel(label);
  return {
    meaning: savedMeaning || fromId.meaning || fromLabel.meaning,
    signals: savedSignals || fromId.signals || fromLabel.signals,
  };
}

/** Resolve method preset label by id for a given group (localized display). */
export function methodLabelFor(
  groupKey: TemplateFacetGroupKey,
  id: string,
): string {
  const source =
    groupKey === "communication"
      ? communicationMessages
      : groupKey === "membership"
        ? membershipMessages
        : groupKey === "decisionApproaches"
          ? decisionApproachesMessages
          : groupKey === "conflictManagement"
            ? conflictManagementMessages
            : null;
  if (!source) return "";
  const method = findMethod(source, id);
  return method?.label ?? "";
}
