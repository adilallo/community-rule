"use client";

import RuleCard from "../../components/cards/RuleCard";
import { useTranslation } from "../../contexts/MessagesContext";
import { CreateFlowHeaderLockup } from "../components/CreateFlowHeaderLockup";
import { CreateFlowStepShell } from "../components/CreateFlowStepShell";

/** Mid-flow review step (after upload, before cards). */
export default function ReviewPage() {
  const t = useTranslation("create.review");

  return (
    <CreateFlowStepShell
      variant="wideGridLoosePadding"
      contentTopBelowMd="space-1400"
    >
      <div className="flex w-full min-w-0 flex-col gap-4 md:grid md:grid-cols-2 md:gap-[var(--measures-spacing-1200,48px)]">
        <div className="min-w-0">
          <CreateFlowHeaderLockup
            title={t("header.title")}
            description={t("header.description")}
            justification="left"
          />
        </div>
        <div className="min-w-0 w-full">
          <RuleCard
            title={t("ruleCard.title")}
            description={t("ruleCard.description")}
            size="L"
            expanded={false}
            backgroundColor="bg-[#c9fef9]"
            logoUrl="/assets/Vector_MutualAid.svg"
            logoAlt={t("ruleCard.logoAlt")}
            className="rounded-[16px]"
          />
        </div>
      </div>
    </CreateFlowStepShell>
  );
}
