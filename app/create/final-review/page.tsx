"use client";

import { useState, useEffect, useMemo } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import HeaderLockup from "../../components/type/HeaderLockup";
import RuleCard from "../../components/cards/RuleCard";
import type { Category } from "../../components/cards/RuleCard/RuleCard.types";
import { useCreateFlow } from "../context/CreateFlowContext";

const TITLE = "Review your CommunityRule";
const DESCRIPTION =
  "Here's what other people will see. Make sure everything looks good before you finalize everything. Once the rule is finalized, you must use one of your decision-making mechanisms to edit it again.";

const RULE_CARD_TITLE_FALLBACK = "Your community";
const RULE_CARD_DESCRIPTION_FALLBACK =
  "Add a short description of your community on earlier steps when that field is available. For now, this card shows your community name.";

/** Static categories for final review (read-only display). */
const FINAL_REVIEW_CATEGORIES: Category[] = [
  {
    name: "Values",
    chipOptions: [
      { id: "v1", label: "Consciousness", state: "unselected" },
      { id: "v2", label: "Ecology", state: "unselected" },
      { id: "v3", label: "Abundance", state: "unselected" },
      { id: "v4", label: "Art", state: "unselected" },
      { id: "v5", label: "Decisiveness", state: "unselected" },
    ],
  },
  {
    name: "Communication",
    chipOptions: [{ id: "c1", label: "Signal", state: "unselected" }],
  },
  {
    name: "Membership",
    chipOptions: [{ id: "m1", label: "Open Admission", state: "unselected" }],
  },
  {
    name: "Decision-making",
    chipOptions: [
      { id: "d1", label: "Lazy Consensus", state: "unselected" },
      { id: "d2", label: "Modified Consensus", state: "unselected" },
    ],
  },
  {
    name: "Conflict management",
    chipOptions: [
      { id: "cf1", label: "Code of Conduct", state: "unselected" },
      { id: "cf2", label: "Restorative Justice", state: "unselected" },
    ],
  },
];

/**
 * Final review step (right before completed).
 * Figma: 20907-212767 (full-size), 20976-220705 (small breakpoint).
 */
export default function FinalReviewPage() {
  const { state } = useCreateFlow();
  const [isMounted, setIsMounted] = useState(false);
  const isMdOrLarger = useMediaQuery("(min-width: 640px)");

  const ruleCardTitle = useMemo(() => {
    const t = typeof state.title === "string" ? state.title.trim() : "";
    return t.length > 0 ? t : RULE_CARD_TITLE_FALLBACK;
  }, [state.title]);

  const ruleCardDescription = useMemo(() => {
    const s = typeof state.summary === "string" ? state.summary.trim() : "";
    return s.length > 0 ? s : RULE_CARD_DESCRIPTION_FALLBACK;
  }, [state.summary]);

  // Avoid flash: only use breakpoint after mount so SSR and first paint use same layout (desktop).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: defer layout breakpoint until after mount to prevent flash
    setIsMounted(true);
  }, []);

  const showDesktopLayout = !isMounted || isMdOrLarger;

  if (showDesktopLayout) {
    return (
      <div className="w-full max-w-[1280px] shrink-0 px-5 md:px-12">
        <div className="flex w-full flex-col gap-4 min-w-0 sm:grid sm:grid-cols-2 sm:gap-[var(--measures-spacing-1200,48px)]">
          <div className="min-w-0 flex flex-col justify-center">
            <HeaderLockup
              title={TITLE}
              description={DESCRIPTION}
              justification="left"
              size="L"
            />
          </div>
          <div className="min-w-0 w-full flex flex-col items-stretch">
            <RuleCard
              title={ruleCardTitle}
              description={ruleCardDescription}
              size="L"
              expanded={true}
              backgroundColor="bg-[#c9fef9]"
              logoUrl="/assets/Vector_MutualAid.svg"
              logoAlt={ruleCardTitle}
              categories={FINAL_REVIEW_CATEGORIES}
              className="rounded-[24px] !max-w-full !w-full min-w-0"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center px-5 min-w-0">
      <div className="flex flex-col gap-4 w-full max-w-[639px]">
        <HeaderLockup
          title={TITLE}
          description={DESCRIPTION}
          justification="left"
          size="M"
        />
        <RuleCard
          title={ruleCardTitle}
          description={ruleCardDescription}
          size="L"
          expanded={true}
          backgroundColor="bg-[#c9fef9]"
          logoUrl="/assets/Vector_MutualAid.svg"
          logoAlt={ruleCardTitle}
          categories={FINAL_REVIEW_CATEGORIES}
          className="w-full rounded-[12px] p-4"
          onClick={() => {}}
        />
      </div>
    </div>
  );
}
