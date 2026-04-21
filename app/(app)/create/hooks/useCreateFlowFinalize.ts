"use client";

import { useCallback, useState } from "react";
import { buildPublishPayload } from "../../../../lib/create/buildPublishPayload";
import { publishRule } from "../../../../lib/create/api";
import { writeLastPublishedRule } from "../../../../lib/create/lastPublishedRule";
import messages from "../../../../messages/en/index";
import type { CreateFlowState } from "../types";

type AppRouterLike = { push: (_href: string) => void };

type OpenLogin = (args: {
  variant: "default" | "saveProgress";
  nextPath: string;
  backdropVariant: "blurredYellow";
}) => void;

export type UseCreateFlowFinalizeResult = {
  /** Set when publish fails (validation, server error, or empty server message). Reset on each `finalize()` invocation. */
  publishBannerMessage: string | null;
  setPublishBannerMessage: (_message: string | null) => void;
  /** True from the moment the publish request fires until the response resolves. */
  isPublishing: boolean;
  /**
   * Build a publish payload from the current `CreateFlowState`, post it to
   * `publishRule`, and route to `/create/completed` on success.
   *
   * Failure modes:
   * - Payload validation fails → surface the localized banner message.
   * - 401 from the API → re-open the login modal targeting `/create/final-review?syncDraft=1` so the user can retry post-auth.
   * - Any other failure → show either the trimmed server message or a generic localized fallback.
   */
  finalize: () => Promise<void>;
};

/**
 * Encapsulates the Final Review → publish flow that previously lived inline
 * in `CreateFlowLayoutClient`. Keeps publish state (banner + in-flight flag)
 * co-located with the publish handler so the layout shell only has to wire
 * the resulting message into its banner stack.
 */
export function useCreateFlowFinalize({
  state,
  router,
  openLogin,
}: {
  state: CreateFlowState;
  router: AppRouterLike;
  openLogin: OpenLogin;
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
      router.push("/create/completed");
      return;
    }
    if (publishResult.status === 401) {
      openLogin({
        variant: "default",
        nextPath: "/create/final-review?syncDraft=1",
        backdropVariant: "blurredYellow",
      });
      return;
    }
    setPublishBannerMessage(
      publishResult.error.trim() !== ""
        ? publishResult.error
        : messages.create.reviewAndComplete.publish.genericPublishFailed,
    );
  }, [state, router, openLogin]);

  return {
    publishBannerMessage,
    setPublishBannerMessage,
    isPublishing,
    finalize,
  };
}
