import type { CreateFlowState } from "./types";

const IGNORED_KEYS = new Set<string>(["currentStep"]);

function valueIndicatesUserInput(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") {
    return Object.keys(value as object).length > 0;
  }
  return false;
}

/**
 * True once the user has entered meaningful create-flow data (not only navigation metadata).
 * Used to show "Save & Exit" vs a plain "Exit" that confirms data loss.
 */
export function hasCreateFlowUserInput(state: CreateFlowState): boolean {
  for (const key of Object.keys(state)) {
    if (IGNORED_KEYS.has(key)) continue;
    if (valueIndicatesUserInput(state[key])) return true;
  }
  return false;
}
