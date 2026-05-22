"use client";

import { memo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateFlowMdUp } from "../../../../../(app)/create/hooks/useCreateFlowMdUp";
import { useTranslation } from "../../../../../contexts/MessagesContext";
import { UseCaseCompletedRuleView } from "./UseCaseCompletedRule.view";
import {
  useUseCaseCompletedRuleActions,
  type UseCaseCompletedRuleActionBanner,
} from "./useUseCaseCompletedRuleActions";
import type { UseCaseCompletedRuleProps } from "./UseCaseCompletedRule.types";

/** Figma: Completed CR — use case demos (21995:39476, 21995:40092, 22015:42413). */
function UseCaseCompletedRuleContainerComponent({
  slug,
  fixture,
  sections,
}: UseCaseCompletedRuleProps) {
  const router = useRouter();
  const mdUp = useCreateFlowMdUp();
  const tTopNav = useTranslation("pages.useCasesCompletedRule.topNav");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [actionBanner, setActionBanner] =
    useState<UseCaseCompletedRuleActionBanner | null>(null);

  const { copyPageLink, mailtoPageLink, handleDuplicate } =
    useUseCaseCompletedRuleActions({
      slug,
      fixture,
      setActionBanner,
    });

  return (
    <UseCaseCompletedRuleView
      slug={slug}
      fixture={fixture}
      sections={sections}
      mdUp={mdUp}
      duplicateLabel={tTopNav("duplicate")}
      duplicateAriaLabel={tTopNav("duplicateAriaLabel")}
      exitLabel={tTopNav("return")}
      shareModalOpen={shareModalOpen}
      onShareOpen={() => setShareModalOpen(true)}
      onShareClose={() => setShareModalOpen(false)}
      onCopyLink={() => void copyPageLink()}
      onEmailShare={mailtoPageLink}
      onDuplicate={() => void handleDuplicate()}
      onExit={() => router.push(`/use-cases/${slug}`)}
      actionBanner={actionBanner}
      onActionBannerClose={() => setActionBanner(null)}
    />
  );
}

export const UseCaseCompletedRule = memo(UseCaseCompletedRuleContainerComponent);
UseCaseCompletedRule.displayName = "UseCaseCompletedRule";
