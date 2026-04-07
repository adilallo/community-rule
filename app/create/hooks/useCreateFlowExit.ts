"use client";

import { useCallback } from "react";
import type { CreateFlowState, CreateFlowStep } from "../types";
import { saveDraftToServer } from "../../../lib/create/api";
import messages from "../../../messages/en/index";

const SYNC_ENABLED = process.env.NEXT_PUBLIC_ENABLE_BACKEND_SYNC === "true";

export type CreateFlowExitClearState = () => void;

type AppRouterLike = { push: (_href: string) => void };

/**
 * Leave the create flow for a **signed-in** user. Caller must not invoke for anonymous users.
 */
export function useCreateFlowExit({
  state,
  currentStep,
  clearState,
  router,
  user,
}: {
  state: CreateFlowState;
  currentStep: CreateFlowStep | null;
  clearState: CreateFlowExitClearState;
  router: AppRouterLike;
  user: { id: string; email: string } | null;
}): (options?: { saveDraft?: boolean }) => Promise<void> {
  return useCallback(
    async (options?: { saveDraft?: boolean }) => {
      if (!user) return;

      const saveDraft = options?.saveDraft ?? false;

      if (!saveDraft && typeof window !== "undefined") {
        const confirmed = window.confirm(
          messages.create.topNav.leaveConfirmLoss,
        );
        if (!confirmed) return;
      }

      if (saveDraft && SYNC_ENABLED) {
        const payload: CreateFlowState = {
          ...state,
          ...(currentStep ? { currentStep } : {}),
        };
        const ok = await saveDraftToServer(payload);
        if (!ok && typeof window !== "undefined") {
          const leave = window.confirm(
            messages.create.topNav.leaveConfirmSaveFailed,
          );
          if (!leave) return;
        }
      }

      clearState();
      router.push("/");
    },
    [state, currentStep, clearState, router, user],
  );
}
