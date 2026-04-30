"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CreateFlowState } from "./types";
import { createFlowStateHasKeys } from "../../../lib/create/draftHydrationUtils";
import {
  hasTransferPendingFlag,
  readAnonymousCreateFlowState,
} from "./utils/anonymousDraftStorage";
import { useCreateFlow } from "./context/CreateFlowContext";
import { fetchDraftFromServer } from "../../../lib/create/api";
import messages from "../../../messages/en/index";
import Alert from "../../components/modals/Alert";
import {
  isValidStep,
  parseCreateFlowScreenFromPathname,
} from "./utils/flowSteps";

const SYNC_ENABLED = process.env.NEXT_PUBLIC_ENABLE_BACKEND_SYNC === "true";

/**
 * When sync is on and the user is signed in, restore the server-side draft only
 * when there is no in-flight localStorage draft to defer to. localStorage is
 * the on-every-keystroke buffer (CreateFlowProvider mirrors state there for
 * everyone), so a refresh mid-flow already has the freshest data; pulling the
 * server draft on top would clobber unsaved keystrokes with a stale snapshot.
 *
 * Server draft becomes authoritative only when localStorage is empty — i.e.
 * fresh device, after explicit Save & Exit (which clears localStorage),
 * after Exit-from-completed clears local state, or after
 * {@link prepareFreshCreateFlowEntry} (Create rule / new template entry) clears
 * local + deletes the server draft when sync is on.
 *
 * Skips when `?syncDraft=1` or transfer-pending — {@link PostLoginDraftTransfer}
 * owns that path.
 */
export function SignedInDraftHydration({
  sessionUser,
  sessionResolved,
}: {
  sessionUser: { id: string; email: string } | null | undefined;
  sessionResolved: boolean;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
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

    // Local draft wins over server: no fetch, no replaceState. The provider
    // already hydrated from localStorage at mount, so the user sees their
    // unsaved keystrokes immediately.
    if (createFlowStateHasKeys(readAnonymousCreateFlowState())) {
      finishedUserIdRef.current = userId;
      return;
    }

    const urlStep = parseCreateFlowScreenFromPathname(pathname ?? null);
    /** Owner “view published rule” shell — never merge server draft or redirect to `currentStep`. */
    if (urlStep === "completed") {
      return;
    }

    let cancelled = false;
    setLoadingHydration(true);

    void (async () => {
      try {
        const serverDraft = await fetchDraftFromServer();
        if (cancelled) return;

        if (touchedRef.current) {
          finishedUserIdRef.current = userId;
          return;
        }

        if (serverDraft != null && createFlowStateHasKeys(serverDraft)) {
          const next = serverDraft as CreateFlowState;
          replaceState(next);
          const saved = next.currentStep;
          if (saved && isValidStep(saved)) {
            const urlStep = parseCreateFlowScreenFromPathname(pathname ?? null);
            if (urlStep !== saved) {
              router.replace(`/create/${saved}`);
            }
          }
        }
        finishedUserIdRef.current = userId;
      } finally {
        if (!cancelled) setLoadingHydration(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    sessionResolved,
    sessionUser,
    syncDraftParam,
    replaceState,
    pathname,
    router,
  ]);

  if (!loadingHydration) return null;

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-14 z-[170] flex justify-center px-[var(--spacing-measures-spacing-500,20px)] pt-2 md:top-16 md:px-[var(--measures-spacing-1800,64px)]">
      <div className="pointer-events-auto w-full max-w-[960px]">
        <Alert
          type="banner"
          status="default"
          size="s"
          title={messages.create.draftHydration.loadingSavedProgress}
          hasBodyText={false}
          hasLeadingIcon={false}
          hasTrailingIcon={false}
          className="w-full"
        />
      </div>
    </div>
  );
}
