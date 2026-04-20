"use client";

import { useMemo } from "react";
import RuleCard from "../../../../components/cards/RuleCard";
import type { Category } from "../../../../components/cards/RuleCard/RuleCard.types";
import { useMessages, useTranslation } from "../../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import {
  CREATE_FLOW_REVIEW_RULE_CARD_LAYOUT_CLASS,
  CreateFlowLockupCardStepShell,
} from "../../components/CreateFlowLockupCardStepShell";
import {
  buildFinalReviewCategoriesFromState,
  type FinalReviewCategoryRow,
} from "../../../../../lib/create/buildFinalReviewCategories";

function buildFinalReviewCategories(
  rows: readonly FinalReviewCategoryRow[],
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
 * `finalReview.json.categories` ships a demo ordering + localized names
 * (Values / Communication / Membership / Decision-making / Conflict
 * management). We reuse that ordering for the state-derived rows so the
 * RuleCard layout stays stable across customize / use-without-changes /
 * plain-custom flows, and fall back to the demo chips when state resolves
 * to nothing selected.
 */
function readFallbackCategoryNames(
  categories: readonly { name: string; chips: readonly string[] }[],
): {
  names: {
    values: string;
    communication: string;
    membership: string;
    decisions: string;
    conflict: string;
  };
  rows: FinalReviewCategoryRow[];
} {
  const get = (i: number): string =>
    typeof categories[i]?.name === "string" ? categories[i].name : "";
  return {
    names: {
      values: get(0),
      communication: get(1),
      membership: get(2),
      decisions: get(3),
      conflict: get(4),
    },
    rows: categories.map((c) => ({ name: c.name, chips: [...c.chips] })),
  };
}

export function FinalReviewScreen() {
  const { state } = useCreateFlow();
  const mdUp = useCreateFlowMdUp();
  const t = useTranslation("create.reviewAndComplete.finalReview");
  const m = useMessages();

  const finalReviewCategories = useMemo(() => {
    const { names, rows: fallbackRows } = readFallbackCategoryNames(
      m.create.reviewAndComplete.finalReview.categories,
    );
    const derived = buildFinalReviewCategoriesFromState(state, names);
    // When a user lands on final review with nothing actually selected (e.g.
    // direct-nav during dev), keep the shipped demo chips rather than render
    // an empty card — matches prior behavior for that edge case.
    return buildFinalReviewCategories(
      derived.length > 0 ? derived : fallbackRows,
    );
  }, [m.create.reviewAndComplete.finalReview.categories, state]);

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
        size={mdUp ? "L" : "M"}
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
