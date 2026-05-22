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
import { fetchDraftFromServer, saveDraftToServer } from "../../../lib/create/api";
import { createFlowStateHasKeys } from "../../../lib/create/draftHydrationUtils";
import type { CreateFlowState } from "./types";
import messages from "../../../messages/en/index";
import Alert from "../../components/modals/Alert";

import { isBackendSyncEnabled } from "../../../lib/create/backendSyncEnabled";

function buildPayloadWithStep(
  base: CreateFlowState,
  pathname: string | null,
): CreateFlowState {
  const step =
    parseCreateFlowScreenFromPathname(pathname ?? null) ?? undefined;
  return {
    ...base,
    ...(step ? { currentStep: step } : {}),
  };
}

/**
 * Prefer the on-device anonymous mirror when present; otherwise use the draft
 * stored on the magic-link token at request time (written during verify).
 */
async function resolvePostLoginDraftPayload(
  local: CreateFlowState,
  pathname: string | null,
): Promise<CreateFlowState | null> {
  const localPayload = createFlowStateHasKeys(local)
    ? buildPayloadWithStep(local, pathname)
    : null;

  const serverDraft = await fetchDraftFromServer();
  const serverPayload =
    serverDraft != null && createFlowStateHasKeys(serverDraft)
      ? buildPayloadWithStep(serverDraft, pathname)
      : null;

  if (localPayload && serverPayload) {
    return { ...serverPayload, ...localPayload };
  }
  return localPayload ?? serverPayload;
}

/**
 * After magic-link verify, redirects to `/create/...?syncDraft=1` with session cookie.
 * With backend sync: PUT draft once when the device mirror is non-empty, then hydrates
 * context. Without sync: hydrates from localStorage and/or the server draft saved at
 * verify. Never writes an empty payload over an existing server draft.
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

    attemptedRef.current = true;

    let cancelled = false;

    void (async () => {
      const local = readAnonymousCreateFlowState();
      const pending = hasTransferPendingFlag();

      if (!createFlowStateHasKeys(local) && !pending) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("syncDraft");
        const q = params.toString();
        if (pathname) {
          router.replace(q ? `${pathname}?${q}` : pathname);
        }
        attemptedRef.current = false;
        return;
      }

      const payload = await resolvePostLoginDraftPayload(local, pathname);
      if (cancelled) return;

      if (payload == null || !createFlowStateHasKeys(payload)) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("syncDraft");
        const q = params.toString();
        if (pathname) {
          router.replace(q ? `${pathname}?${q}` : pathname);
        }
        attemptedRef.current = false;
        return;
      }

      if (isBackendSyncEnabled() && createFlowStateHasKeys(local)) {
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
