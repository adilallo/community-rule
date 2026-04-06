"use client";

import { useEffect, useRef, useState } from "react";
import {
  fetchAuthSession,
  fetchDraftFromServer,
  saveDraftToServer,
} from "../../../lib/create/api";
import { useCreateFlow } from "./CreateFlowContext";

const SYNC_ENABLED = process.env.NEXT_PUBLIC_ENABLE_BACKEND_SYNC === "true";

const DEBOUNCE_MS = 1000;

/**
 * When NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true, loads the signed-in user's draft
 * from the server and debounces saves. Anonymous users keep localStorage-only behavior.
 */
export function CreateFlowBackendSync() {
  const { state, replaceState } = useCreateFlow();
  const [hydrated, setHydrated] = useState(!SYNC_ENABLED);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!SYNC_ENABLED) return;

    let cancelled = false;

    (async () => {
      try {
        const { user } = await fetchAuthSession();
        if (cancelled || !user) {
          setHydrated(true);
          return;
        }
        const serverDraft = await fetchDraftFromServer();
        if (cancelled) return;
        if (serverDraft && Object.keys(serverDraft).length > 0) {
          replaceState(serverDraft);
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [replaceState]);

  useEffect(() => {
    if (!SYNC_ENABLED || !hydrated) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(() => {
      saveTimer.current = null;
      void (async () => {
        const { user } = await fetchAuthSession();
        if (!user) return;
        await saveDraftToServer(state);
      })();
    }, DEBOUNCE_MS);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, hydrated]);

  return null;
}
