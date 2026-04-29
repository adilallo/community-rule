"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  clearAnonymousCreateFlowStorage,
  hasTransferPendingFlag,
  readAnonymousCreateFlowState,
} from "./utils/anonymousDraftStorage";
import { useCreateFlow } from "./context/CreateFlowContext";
import { parseCreateFlowScreenFromPathname } from "./utils/flowSteps";
import { saveDraftToServer } from "../../../lib/create/api";
import messages from "../../../messages/en/index";
import Alert from "../../components/modals/Alert";

const SYNC_ENABLED = process.env.NEXT_PUBLIC_ENABLE_BACKEND_SYNC === "true";

/**
 * After magic-link verify, redirects to `/create/...?syncDraft=1` with session cookie.
 * With backend sync: PUT draft once then hydrates context. Without sync: hydrates from
 * `create-flow-anonymous` localStorage only (no server write).
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

        const step =
          parseCreateFlowScreenFromPathname(pathname ?? null) ?? undefined;
        const payload = {
          ...local,
          ...(step ? { currentStep: step } : {}),
        };

        if (cancelled) return;
        clearAnonymousCreateFlowStorage();
        replaceState(payload);

        if (cancelled) return;
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

      const step =
        parseCreateFlowScreenFromPathname(pathname ?? null) ?? undefined;
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

  const [titleLine, ...rest] = transferError.split(/\n\n+/);
  const title = (titleLine ?? transferError).trim();
  const description = rest.join("\n\n").trim() || undefined;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[150] flex justify-center px-5 md:bottom-6">
      <div className="pointer-events-auto w-full max-w-[640px]">
        <Alert
          type="banner"
          status="danger"
          size="s"
          title={title}
          description={description}
          hasBodyText={Boolean(description)}
          hasLeadingIcon
          onClose={() => {
            setTransferError(null);
          }}
          className="w-full"
        />
      </div>
    </div>
  );
}
