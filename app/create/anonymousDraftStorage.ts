import type { CreateFlowState } from "./types";

/** Anonymous in-progress create flow (local only until magic-link transfer). */
export const CREATE_FLOW_ANONYMOUS_KEY = "create-flow-anonymous" as const;

/**
 * Set when the user submits magic link from “Save your progress?” so after verify we PUT to server.
 * Value is arbitrary truthy string; cleared after successful transfer or abandon.
 */
export const CREATE_FLOW_TRANSFER_PENDING_KEY =
  "create-flow-transfer-pending" as const;

const LEGACY_LIVE_KEY = "create-flow-state";
const LEGACY_DRAFT_KEY = "create-flow-draft";

export function readAnonymousCreateFlowState(): CreateFlowState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CREATE_FLOW_ANONYMOUS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CreateFlowState;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function writeAnonymousCreateFlowState(value: CreateFlowState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CREATE_FLOW_ANONYMOUS_KEY,
      JSON.stringify(value),
    );
  } catch {
    // quota / private mode
  }
}

export function clearAnonymousCreateFlowStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CREATE_FLOW_ANONYMOUS_KEY);
    window.localStorage.removeItem(CREATE_FLOW_TRANSFER_PENDING_KEY);
  } catch {
    // ignore
  }
}

export function setTransferPendingFlag(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CREATE_FLOW_TRANSFER_PENDING_KEY, "1");
  } catch {
    // ignore
  }
}

export function hasTransferPendingFlag(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return Boolean(
      window.localStorage.getItem(CREATE_FLOW_TRANSFER_PENDING_KEY),
    );
  } catch {
    return false;
  }
}

export function clearTransferPendingFlag(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CREATE_FLOW_TRANSFER_PENDING_KEY);
  } catch {
    // ignore
  }
}

/** One-time cleanup of pre–anonymous-draft keys. */
export function clearLegacyCreateFlowKeysOnce(): void {
  if (typeof window === "undefined") return;
  try {
    const done = window.sessionStorage.getItem("create-flow-legacy-cleared");
    if (done) return;
    window.localStorage.removeItem(LEGACY_LIVE_KEY);
    window.localStorage.removeItem(LEGACY_DRAFT_KEY);
    window.sessionStorage.setItem("create-flow-legacy-cleared", "1");
  } catch {
    // ignore
  }
}
