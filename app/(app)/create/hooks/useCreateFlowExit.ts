"use client";

import { useCallback } from "react";
import type { CreateFlowState, CreateFlowStep } from "../types";
import { buildPublishPayload } from "../../../../lib/create/buildPublishPayload";
import { saveDraftToServer, updatePublishedRule } from "../../../../lib/create/api";
import { writeLastPublishedRule } from "../../../../lib/create/lastPublishedRule";
import { isBackendSyncEnabled } from "../../../../lib/create/backendSyncEnabled";
import messages from "../../../../messages/en/index";

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
  setDraftSaveBannerMessage,
  confirmLeave,
}: {
  state: CreateFlowState;
  currentStep: CreateFlowStep | null;
  clearState: CreateFlowExitClearState;
  router: AppRouterLike;
  user: { id: string; email: string } | null;
  /** When save fails, surface the server message in the create shell banner (no leave confirm). */
  setDraftSaveBannerMessage?: (_message: string | null) => void;
  /** When exit would discard unsaved work, return true to proceed. Defaults to `window.confirm`. */
  confirmLeave?: () => Promise<boolean>;
}): (_options?: { saveDraft?: boolean }) => Promise<void> {
  return useCallback(
    async (options?: { saveDraft?: boolean }) => {
      if (!user) return;

      const saveDraft = options?.saveDraft ?? false;

      if (!saveDraft) {
        const confirmFn =
          confirmLeave ??
          (async () => {
            if (typeof window === "undefined") return true;
            return window.confirm(messages.create.topNav.leaveConfirmLoss);
          });
        const confirmed = await confirmFn();
        if (!confirmed) return;
      }

      if (saveDraft && isBackendSyncEnabled()) {
        const editingId =
          typeof state.editingPublishedRuleId === "string"
            ? state.editingPublishedRuleId.trim()
            : "";
        if (editingId.length > 0) {
          const payloadResult = buildPublishPayload(state);
          if (payloadResult.ok === false) {
            setDraftSaveBannerMessage?.(
              payloadResult.error === "missingCommunityName"
                ? messages.create.reviewAndComplete.publish
                    .missingCommunityName
                : payloadResult.error,
            );
            return;
          }
          const { title, summary, document } = payloadResult;
          const updateResult = await updatePublishedRule(editingId, {
            title,
            summary: summary ?? null,
            document,
          });
          if (updateResult.ok === true) {
            writeLastPublishedRule({
              id: editingId,
              title,
              summary: summary ?? null,
              document,
            });
            setDraftSaveBannerMessage?.(null);
          } else {
            setDraftSaveBannerMessage?.(updateResult.error);
            return;
          }
        } else {
          const payload: CreateFlowState = {
            ...state,
            ...(currentStep ? { currentStep } : {}),
          };
          const result = await saveDraftToServer(payload);
          if (result.ok === true) {
            setDraftSaveBannerMessage?.(null);
          } else {
            setDraftSaveBannerMessage?.(result.message);
            return;
          }
        }
      }

      clearState();
      router.push("/");
    },
    [
      state,
      currentStep,
      clearState,
      router,
      user,
      setDraftSaveBannerMessage,
      confirmLeave,
    ],
  );
}
