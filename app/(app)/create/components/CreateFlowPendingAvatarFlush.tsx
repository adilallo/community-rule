"use client";

import { useEffect, useRef } from "react";
import { useCreateFlow } from "../context/CreateFlowContext";
import { uploadCreateFlowFile } from "../../../../lib/create/uploadToServer";
import {
  clearPendingCommunityAvatarFile,
  readPendingCommunityAvatarFile,
} from "../../../../lib/create/pendingCommunityAvatarUpload";

/**
 * After sign-in, uploads a community avatar staged in IndexedDB (anonymous pick)
 * and writes `communityAvatarUrl` on success.
 */
export function CreateFlowPendingAvatarFlush({
  sessionUser,
  sessionResolved,
}: {
  sessionUser: { id: string; email: string } | null | undefined;
  sessionResolved: boolean;
}) {
  const { updateState } = useCreateFlow();
  /** One successful flush per signed-in user id (survives React StrictMode remounts). */
  const lastFlushedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!sessionResolved || !sessionUser) return;
    if (lastFlushedUserIdRef.current === sessionUser.id) return;
    let cancelled = false;

    void (async () => {
      const file = await readPendingCommunityAvatarFile();
      if (cancelled || !file) return;
      try {
        const { url } = await uploadCreateFlowFile(file, "communityAvatar");
        if (cancelled) return;
        await clearPendingCommunityAvatarFile();
        updateState({ communityAvatarUrl: url });
        lastFlushedUserIdRef.current = sessionUser.id;
      } catch {
        // Leave pending blob in place so the user can retry after fixing auth / UPLOAD_ROOT.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionResolved, sessionUser, updateState]);

  return null;
}
