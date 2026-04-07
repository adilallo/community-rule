"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  clearAnonymousCreateFlowStorage,
  hasTransferPendingFlag,
  readAnonymousCreateFlowState,
} from "./anonymousDraftStorage";
import { useCreateFlow } from "./context/CreateFlowContext";
import { isValidStep } from "./utils/flowSteps";
import { saveDraftToServer } from "../../lib/create/api";
import messages from "../../messages/en/index";

const SYNC_ENABLED = process.env.NEXT_PUBLIC_ENABLE_BACKEND_SYNC === "true";

/**
 * After magic-link verify, redirects to `/create/...?syncDraft=1` with session cookie.
 * Uploads anonymous localStorage draft to `RuleDraft` once, then hydrates context.
 */
export function PostLoginDraftTransfer({
  sessionUser,
}: {
  sessionUser: { id: string; email: string } | null | undefined;
}) {
  const { replaceState } = useCreateFlow();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const syncDraft = searchParams.get("syncDraft");
  const [transferError, setTransferError] = useState<string | null>(null);
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (sessionUser == null || sessionUser === undefined) return;
    const wantsTransfer = syncDraft === "1" || hasTransferPendingFlag();
    if (!wantsTransfer) return;
    if (attemptedRef.current) return;

    if (!SYNC_ENABLED) {
      if (attemptedRef.current) return;
      attemptedRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync-off path: show one-shot error then strip query
      setTransferError(
        "Saving to your account is not available (server sync is disabled). Your progress stays on this device.",
      );
      if (pathname) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("syncDraft");
        const q = params.toString();
        router.replace(q ? `${pathname}?${q}` : pathname);
      }
      return;
    }

    attemptedRef.current = true;

    let cancelled = false;

    void (async () => {
      const local = readAnonymousCreateFlowState();
      const pending = hasTransferPendingFlag();

      if (Object.keys(local).length === 0 && !pending) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("syncDraft");
        const q = params.toString();
        if (pathname) {
          router.replace(q ? `${pathname}?${q}` : pathname);
        }
        attemptedRef.current = false;
        return;
      }

      const segment = pathname?.split("/").pop() ?? "";
      const step = isValidStep(segment) ? segment : undefined;
      const payload = {
        ...local,
        ...(step ? { currentStep: step } : {}),
      };

      const saveResult = await saveDraftToServer(payload);
      if (cancelled) return;

      if (saveResult.ok === false) {
        setTransferError(
          messages.create.topNav.postLoginSaveFailedWithReason.replace(
            "{reason}",
            saveResult.message,
          ),
        );
        attemptedRef.current = false;
        return;
      }

      clearAnonymousCreateFlowStorage();
      replaceState(payload);

      if (pathname) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("syncDraft");
        const q = params.toString();
        router.replace(q ? `${pathname}?${q}` : pathname);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionUser, pathname, syncDraft, replaceState, router, searchParams]);

  if (!transferError) return null;

  return (
    <div
      role="alert"
      className="mx-auto max-w-[640px] px-5 py-3 text-center font-inter text-sm text-[var(--color-border-default-utility-negative)]"
    >
      {transferError}
    </div>
  );
}
