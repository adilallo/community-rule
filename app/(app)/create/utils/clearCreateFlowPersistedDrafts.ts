import { clearAnonymousCreateFlowStorage } from "./anonymousDraftStorage";
import { clearCoreValueDetailsLocalStorage } from "./coreValueDetailsLocalStorage";

/**
 * Wipe the anonymous in-progress create-flow draft from `localStorage` (both
 * the main `create-flow-anonymous` blob and the separate core-value details
 * key). Intended for call sites that navigate **into** the create flow from
 * outside and want a fresh slate — today that's the marketing "Popular
 * templates" click handler on the home page and the `/templates` index page
 * (when not in-flow). `CreateFlowProvider` reads `localStorage` during its
 * `useState` initializer, so clearing *before* pushing the next route means
 * the provider mounts empty and the Create Community stage starts clean.
 *
 * Note: this only touches localStorage. It does **not** delete the
 * authenticated user's server draft (`/api/drafts/me`). Server drafts are
 * loaded deliberately from the profile page, not re-hydrated into the flow
 * on every entry, so there's nothing to wipe here for signed-in users.
 */
export function clearCreateFlowPersistedDrafts(): void {
  clearAnonymousCreateFlowStorage();
  clearCoreValueDetailsLocalStorage();
}
