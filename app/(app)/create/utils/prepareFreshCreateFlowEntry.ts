import { deleteServerDraft } from "../../../../lib/create/api";
import { clearAnonymousCreateFlowStorage } from "./anonymousDraftStorage";
import { clearCoreValueDetailsLocalStorage } from "./coreValueDetailsLocalStorage";

import { isBackendSyncEnabled } from "../../../../lib/create/backendSyncEnabled";

/**
 * Sentinel set on click and cleared once the in-flight DELETE settles. Read by
 * {@link SignedInDraftHydration} so it skips the server draft fetch while the
 * fresh-entry cleanup is racing the user's first paint of `/create`.
 */
export const FRESH_ENTRY_PENDING_KEY = "create:fresh-entry-pending";

export function hasFreshEntryPending(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(FRESH_ENTRY_PENDING_KEY) === "1";
  } catch {
    return false;
  }
}

function setFreshEntryPending(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(FRESH_ENTRY_PENDING_KEY, "1");
  } catch {
    /* ignore — sessionStorage may be unavailable */
  }
}

function clearFreshEntryPending(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(FRESH_ENTRY_PENDING_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Call **before** navigating into `/create` from marketing or profile “new rule”
 * entry points so signed-in + sync matches an anonymous fresh start: wipe
 * `localStorage` draft keys and, when sync is on, `DELETE /api/drafts/me`.
 *
 * Synchronous variant: returns immediately after clearing local state and
 * scheduling the server draft delete in the background. Sets a sessionStorage
 * sentinel that {@link SignedInDraftHydration} checks before fetching, so the
 * brief race window does not hydrate from a not-yet-deleted server draft.
 *
 * Do **not** use for “Continue draft” — that path should load the server draft.
 */
export function prepareFreshCreateFlowEntrySync(): void {
  clearAnonymousCreateFlowStorage();
  clearCoreValueDetailsLocalStorage();
  if (!isBackendSyncEnabled()) return;
  setFreshEntryPending();
  void deleteServerDraft().finally(clearFreshEntryPending);
}

/**
 * Awaitable variant kept for callers that genuinely need the DELETE to settle
 * before continuing (e.g. tests, programmatic reset flows). Most click handlers
 * should use {@link prepareFreshCreateFlowEntrySync} for instant navigation.
 */
export async function prepareFreshCreateFlowEntry(): Promise<void> {
  clearAnonymousCreateFlowStorage();
  clearCoreValueDetailsLocalStorage();
  if (!isBackendSyncEnabled()) return;
  setFreshEntryPending();
  try {
    await deleteServerDraft();
  } finally {
    clearFreshEntryPending();
  }
}
