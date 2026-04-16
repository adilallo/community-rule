import type { CoreValueDetailEntry } from "../types";

/** Persists meaning/signals per chip id across refresh (esp. signed-in create flow, in-memory only). */
export const CORE_VALUE_DETAILS_STORAGE_KEY =
  "create-flow-core-value-details" as const;

export function readCoreValueDetailsFromLocalStorage(): Record<
  string,
  CoreValueDetailEntry
> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CORE_VALUE_DETAILS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: Record<string, CoreValueDetailEntry> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (!v || typeof v !== "object") continue;
      const o = v as Record<string, unknown>;
      if (typeof o.meaning !== "string" || typeof o.signals !== "string") {
        continue;
      }
      out[k] = { meaning: o.meaning, signals: o.signals };
    }
    return out;
  } catch {
    return {};
  }
}

export function writeCoreValueDetailsToLocalStorage(
  value: Record<string, CoreValueDetailEntry> | undefined,
): void {
  if (typeof window === "undefined") return;
  try {
    if (!value || Object.keys(value).length === 0) {
      window.localStorage.removeItem(CORE_VALUE_DETAILS_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(
      CORE_VALUE_DETAILS_STORAGE_KEY,
      JSON.stringify(value),
    );
  } catch {
    // quota / private mode
  }
}

export function clearCoreValueDetailsLocalStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CORE_VALUE_DETAILS_STORAGE_KEY);
  } catch {
    // ignore
  }
}
