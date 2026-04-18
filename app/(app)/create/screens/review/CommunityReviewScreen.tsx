"use client";

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

/** Create Community review — Figma `19706:12135` (`/create/review`; two columns from `lg:`; column caps in `createFlowLayoutTokens`). */
export function CommunityReviewScreen() {
  const lgUp = useCreateFlowLgUp();
  const t = useTranslation("create.review");
  const { state } = useCreateFlow();

  const cardTitle =
    typeof state.title === "string" && state.title.trim().length > 0
      ? state.title.trim()
      : t("ruleCard.title");
  const cardDescription =
    typeof state.communityContext === "string" &&
    state.communityContext.trim().length > 0
      ? state.communityContext.trim()
      : t("ruleCard.description");

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
