"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { CreateFlowState } from "./types";
import { createFlowStateHasKeys } from "../../lib/create/draftHydrationUtils";
import {
  clearAnonymousCreateFlowStorage,
  hasTransferPendingFlag,
  readAnonymousCreateFlowState,
} from "./anonymousDraftStorage";
import { useCreateFlow } from "./context/CreateFlowContext";
import { fetchDraftFromServer } from "../../lib/create/api";
import messages from "../../messages/en/index";

const SYNC_ENABLED = process.env.NEXT_PUBLIC_ENABLE_BACKEND_SYNC === "true";

/**
 * When sync is on and the user is signed in, fetch `GET /api/drafts/me` once and merge into context.
 * Skips when `?syncDraft=1` or transfer-pending — {@link PostLoginDraftTransfer} owns that path.
 *
 * **Conflict:** If both server draft and `create-flow-anonymous` are non-empty, `window.confirm`
 * chooses account draft (OK) vs browser copy (Cancel); browser storage is cleared after resolution.
 */
export function SignedInDraftHydration({
  sessionUser,
  sessionResolved,
}: {
  sessionUser: { id: string; email: string } | null | undefined;
  sessionResolved: boolean;
}) {
  const searchParams = useSearchParams();
  const syncDraftParam = searchParams.get("syncDraft");
  const { replaceState, interactionTouched } = useCreateFlow();
  const touchedRef = useRef(interactionTouched);
  touchedRef.current = interactionTouched;

  const [loadingHydration, setLoadingHydration] = useState(false);
  const finishedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!SYNC_ENABLED) return;
    if (!sessionResolved) return;
    if (sessionUser == null || sessionUser === undefined) {
      finishedUserIdRef.current = null;
      return;
    }

    const userId = sessionUser.id;
    if (finishedUserIdRef.current === userId) return;

    if (syncDraftParam === "1" || hasTransferPendingFlag()) {
      finishedUserIdRef.current = userId;
      return;
    }

    let cancelled = false;
    setLoadingHydration(true);

    void (async () => {
      try {
        const serverDraft = await fetchDraftFromServer();
        if (cancelled) return;

        const localDraft = readAnonymousCreateFlowState();
        const hasServer =
          serverDraft != null && createFlowStateHasKeys(serverDraft);
        const hasLocal = createFlowStateHasKeys(localDraft);

        if (touchedRef.current) {
          finishedUserIdRef.current = userId;
          return;
        }

        if (hasServer && hasLocal) {
          const useAccount =
            typeof window !== "undefined" &&
            window.confirm(messages.create.draftHydration.conflictPrompt);
          if (cancelled) return;
          if (useAccount) {
            replaceState(serverDraft as CreateFlowState);
          } else {
            replaceState(localDraft);
          }
          clearAnonymousCreateFlowStorage();
          finishedUserIdRef.current = userId;
          return;
        }

        if (hasServer) {
          replaceState(serverDraft as CreateFlowState);
          clearAnonymousCreateFlowStorage();
          finishedUserIdRef.current = userId;
          return;
        }

        if (hasLocal) {
          replaceState(localDraft);
          clearAnonymousCreateFlowStorage();
        }

        finishedUserIdRef.current = userId;
      } finally {
        if (!cancelled) setLoadingHydration(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionResolved, sessionUser, syncDraftParam, replaceState]);

  if (!loadingHydration) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full shrink-0 px-[var(--spacing-measures-spacing-500,20px)] py-[var(--spacing-measures-spacing-200,8px)] md:px-[var(--measures-spacing-1800,64px)] text-center font-inter text-sm text-[var(--color-text-default-secondary,#a3a3a3)]"
    >
      {messages.create.draftHydration.loadingSavedProgress}
    </div>
  );
}
