import { clearAnonymousCreateFlowStorage } from "./anonymousDraftStorage";
import { clearCoreValueDetailsLocalStorage } from "./coreValueDetailsLocalStorage";

/**
 * Wipe the anonymous in-progress create-flow draft from `localStorage` (both
 * the main `create-flow-anonymous` blob and the separate core-value details
 * key). Clearing *before* `router.push` means `CreateFlowProvider` can read
 * empty storage on mount.
 *
 * For marketing/profile “new rule” entry that should also remove the signed-in
 * server draft when backend sync is on, use {@link prepareFreshCreateFlowEntry}.
 *
 * This helper only touches `localStorage`; it does **not** `DELETE /api/drafts/me`.
 */
export function clearCreateFlowPersistedDrafts(): void {
  clearAnonymousCreateFlowStorage();
  clearCoreValueDetailsLocalStorage();
}
