import { deleteServerDraft } from "../../../../lib/create/api";
import { clearAnonymousCreateFlowStorage } from "./anonymousDraftStorage";
import { clearCoreValueDetailsLocalStorage } from "./coreValueDetailsLocalStorage";

const SYNC_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_BACKEND_SYNC === "true";

/**
 * Call **before** navigating into `/create` from marketing or profile “new rule”
 * entry points so signed-in + sync matches an anonymous fresh start: wipe
 * `localStorage` draft keys and, when sync is on, `DELETE /api/drafts/me`.
 * Anonymous `DELETE` is harmless (401). Await ensures the server draft is gone
 * before mount so {@link SignedInDraftHydration} does not rehydrate stale work.
 *
 * Do **not** use for “Continue draft” — that path should load the server draft.
 */
export async function prepareFreshCreateFlowEntry(): Promise<void> {
  clearAnonymousCreateFlowStorage();
  clearCoreValueDetailsLocalStorage();
  if (SYNC_ENABLED) {
    await deleteServerDraft();
  }
}
