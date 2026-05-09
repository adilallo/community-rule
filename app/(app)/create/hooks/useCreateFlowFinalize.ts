"use client";

import { useCallback, useState } from "react";
import { buildPublishPayload } from "../../../../lib/create/buildPublishPayload";
import { publishRule, updatePublishedRule } from "../../../../lib/create/api";
import { writeLastPublishedRule } from "../../../../lib/create/lastPublishedRule";
import messages from "../../../../messages/en/index";
import type { CreateFlowState } from "../types";
import {
  CREATE_FLOW_COMPLETED_CELEBRATE_QUERY,
  CREATE_FLOW_COMPLETED_CELEBRATE_VALUE,
} from "../utils/flowSteps";
import { createFlowStepPath } from "../utils/createFlowPaths";

type AppRouterLike = { push: (_href: string) => void };

type OpenLogin = (args: {
  variant: "default" | "saveProgress";
  nextPath: string;
  backdropVariant: "blurredYellow";
}) => void;

export type UseCreateFlowFinalizeResult = {
  publishBannerMessage: string | null;
  setPublishBannerMessage: (_message: string | null) => void;
  isPublishing: boolean;
  finalize: () => Promise<void>;
};

/** Final Review → publish: banner + `isPublishing`, consumed by `CreateFlowLayoutClient`. */
export function useCreateFlowFinalize({
  state,
  router,
  openLogin,
  updateState,
  loginReturnPath,
}: {
  state: CreateFlowState;
  router: AppRouterLike;
  openLogin: OpenLogin;
  updateState: (_patch: Partial<CreateFlowState>) => void;
  /** Session gate return path (`?syncDraft=1`) — differs for `/create/edit-rule` vs `/create/final-review`. */
  loginReturnPath: string;
}): UseCreateFlowFinalizeResult {
  const [publishBannerMessage, setPublishBannerMessage] = useState<
    string | null
  >(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const finalize = useCallback(async () => {
    setPublishBannerMessage(null);
    const payloadResult = buildPublishPayload(state);
    if (payloadResult.ok === false) {
      setPublishBannerMessage(
        payloadResult.error === "missingCommunityName"
          ? messages.create.reviewAndComplete.publish.missingCommunityName
          : payloadResult.error,
      );
      return;
    }
    const { title, summary, document: ruleDocument } = payloadResult;
    setIsPublishing(true);

    const editingId =
      typeof state.editingPublishedRuleId === "string"
        ? state.editingPublishedRuleId.trim()
        : "";

    if (editingId.length > 0) {
      const updateResult = await updatePublishedRule(editingId, {
        title,
        summary: summary ?? null,
        document: ruleDocument,
      });
      setIsPublishing(false);
      if (updateResult.ok === true) {
        writeLastPublishedRule({
          id: editingId,
          title,
          summary: summary ?? null,
          document: ruleDocument,
        });
        updateState({ editingPublishedRuleId: undefined });
        router.push(createFlowStepPath("completed"));
        return;
      }
      if (updateResult.status === 401) {
        openLogin({
          variant: "default",
          nextPath: loginReturnPath,
          backdropVariant: "blurredYellow",
        });
        return;
      }
      setPublishBannerMessage(
        updateResult.error.trim() !== ""
          ? updateResult.error
          : messages.create.reviewAndComplete.publish.genericPublishFailed,
      );
      return;
    }

    const publishResult = await publishRule({
      title,
      summary,
      document: ruleDocument,
    });
    setIsPublishing(false);
    if (publishResult.ok === true) {
      writeLastPublishedRule({
        id: publishResult.id,
        title,
        summary: summary ?? null,
        document: ruleDocument,
      });
      router.push(
        createFlowStepPath("completed", {
          [CREATE_FLOW_COMPLETED_CELEBRATE_QUERY]:
            CREATE_FLOW_COMPLETED_CELEBRATE_VALUE,
        }),
      );
      return;
    }
    if (publishResult.status === 401) {
      openLogin({
        variant: "default",
        nextPath: loginReturnPath,
        backdropVariant: "blurredYellow",
      });
      return;
    }
    setPublishBannerMessage(
      publishResult.error.trim() !== ""
        ? publishResult.error
        : messages.create.reviewAndComplete.publish.genericPublishFailed,
    );
  }, [state, router, openLogin, updateState, loginReturnPath]);

  return {
    publishBannerMessage,
    setPublishBannerMessage,
    isPublishing,
    finalize,
  };
}
