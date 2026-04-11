"use client";

import { useMemo } from "react";
import RuleCard from "../../components/cards/RuleCard";
import type { Category } from "../../components/cards/RuleCard/RuleCard.types";
import { useMessages, useTranslation } from "../../contexts/MessagesContext";
import { useCreateFlow } from "../context/CreateFlowContext";
import {
  CREATE_FLOW_REVIEW_RULE_CARD_LAYOUT_CLASS,
  CreateFlowLockupCardStepShell,
} from "../components/CreateFlowLockupCardStepShell";

function buildFinalReviewCategories(
  rows: { name: string; chips: string[] }[],
): Category[] {
  return rows.map((cat) => ({
    name: cat.name,
    chipOptions: cat.chips.map((label, idx) => ({
      id: `${cat.name}-${idx}`,
      label,
      state: "unselected" as const,
    })),
  }));
}

/**
 * Final review step (right before completed).
 * Figma: 20907-212767 (full-size), 20976-220705 (below `md`).
 */
export default function FinalReviewPage() {
  const { state } = useCreateFlow();
  const t = useTranslation("create.finalReview");
  const m = useMessages();

  const finalReviewCategories = useMemo(
    () => buildFinalReviewCategories(m.create.finalReview.categories),
    [m.create.finalReview.categories],
  );

  const ruleCardTitle = useMemo(() => {
    const raw = typeof state.title === "string" ? state.title.trim() : "";
    return raw.length > 0 ? raw : t("ruleCardTitleFallback");
  }, [state.title, t]);

  const ruleCardDescription = useMemo(() => {
    const raw =
      typeof state.summary === "string" ? state.summary.trim() : "";
    return raw.length > 0 ? raw : t("ruleCardDescriptionFallback");
  }, [state.summary, t]);

  return (
    <CreateFlowLockupCardStepShell
      lockupTitle={t("title")}
      lockupDescription={t("description")}
    >
      <RuleCard
        title={ruleCardTitle}
        description={ruleCardDescription}
        size="L"
        expanded={true}
        backgroundColor="bg-[#c9fef9]"
        logoUrl="/assets/Vector_MutualAid.svg"
        logoAlt={ruleCardTitle}
        categories={finalReviewCategories}
        className={CREATE_FLOW_REVIEW_RULE_CARD_LAYOUT_CLASS}
        onClick={() => {}}
      />
    </CreateFlowLockupCardStepShell>
  );
}
