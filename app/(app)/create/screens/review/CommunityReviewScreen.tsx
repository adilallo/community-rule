"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import RuleCard from "../../../../components/cards/RuleCard";
import { useTranslation } from "../../../../contexts/MessagesContext";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowLgUp } from "../../hooks/useCreateFlowLgUp";
import { CreateFlowStepShell } from "../../components/CreateFlowStepShell";
import {
  CREATE_FLOW_MD_UP_GRID_CELL_CLASS,
  CREATE_FLOW_TWO_COLUMN_MAX_WIDTH_CLASS,
} from "../../components/createFlowLayoutTokens";

/**
 * Targets for a `pendingTemplateAction` redirect. Customize resumes the
 * custom-rule stage with chips already prefilled; useWithoutChanges jumps to
 * the review-and-complete stage since the template body is already in state.
 */
const PENDING_TEMPLATE_REDIRECT_TARGET: Record<
  "customize" | "useWithoutChanges",
  string
> = {
  customize: "/create/core-values",
  useWithoutChanges: "/create/confirm-stakeholders",
};

/** Create Community review — Figma `19706:12135` (`/create/review`; two columns from `lg:`; column caps in `createFlowLayoutTokens`). */
export function CommunityReviewScreen() {
  const router = useRouter();
  const lgUp = useCreateFlowLgUp();
  const t = useTranslation("create.community.review");
  const { state, updateState } = useCreateFlow();

  /**
   * If the user picked "Customize" or "Use without changes" from a template
   * before entering community stage, we pinned `pendingTemplateAction` so
   * this screen can skip itself — they already expressed their intent, no
   * reason to make them re-pick from the review footer. We `replace` (not
   * `push`) so Back from the destination goes to `community-save` instead of
   * bouncing through here again. The action is cleared synchronously via
   * `updateState` to guarantee the redirect only fires once: later visits to
   * `/create/review` (e.g. navigating here directly) render normally.
   *
   * Ref guard covers React 18 StrictMode's double-mount in dev so we don't
   * fire `router.replace` twice on the same transition.
   */
  const firedRedirectRef = useRef(false);
  useEffect(() => {
    if (firedRedirectRef.current) return;
    const pending = state.pendingTemplateAction;
    if (!pending) return;
    const target = PENDING_TEMPLATE_REDIRECT_TARGET[pending.mode];
    if (!target) return;
    firedRedirectRef.current = true;
    updateState({ pendingTemplateAction: undefined });
    router.replace(target);
  }, [router, state.pendingTemplateAction, updateState]);

  const cardTitle =
    typeof state.title === "string" && state.title.trim().length > 0
      ? state.title.trim()
      : t("ruleCard.title");
  /**
   * No placeholder fallback: if the user skipped `community-context`, leave
   * the card description off rather than render the old "Mutual Aid Monday
   * is a grassroots community…" sample, which read as real user copy.
   */
  const cardDescription =
    typeof state.communityContext === "string" &&
    state.communityContext.trim().length > 0
      ? state.communityContext.trim()
      : undefined;

  return (
    <CreateFlowStepShell
      variant="wideGridLoosePadding"
      contentTopBelowMd="space-1400"
    >
      <div
        className={`flex w-full min-w-0 flex-col items-center gap-6 lg:mx-auto lg:w-full lg:grid lg:grid-cols-2 lg:items-center lg:justify-items-center lg:gap-x-[var(--measures-spacing-1200,48px)] lg:gap-y-6 ${CREATE_FLOW_TWO_COLUMN_MAX_WIDTH_CLASS}`}
      >
        <div
          className={`flex flex-col justify-center lg:min-h-[212px] ${CREATE_FLOW_MD_UP_GRID_CELL_CLASS}`}
        >
          <CreateFlowHeaderLockup
            title={t("header.title")}
            description={t("header.description")}
          />
        </div>
        <div className={CREATE_FLOW_MD_UP_GRID_CELL_CLASS}>
          <RuleCard
            title={cardTitle}
            description={cardDescription}
            size={lgUp ? "L" : "M"}
            expanded={false}
            backgroundColor="bg-[var(--color-teal-teal50,#c9fef9)]"
            logoUrl="/assets/Vector_MutualAid.svg"
            logoAlt={cardTitle}
            className="rounded-[24px]"
          />
        </div>
      </div>
    </CreateFlowStepShell>
  );
}
