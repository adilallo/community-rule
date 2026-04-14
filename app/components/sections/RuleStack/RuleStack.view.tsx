"use client";

import { useTranslation } from "../../../contexts/MessagesContext";
import SectionHeader from "../SectionHeader";
import Button from "../../buttons/Button";
import { GovernanceTemplateGrid } from "../GovernanceTemplateGrid";
import { GovernanceTemplateGridSkeleton } from "../GovernanceTemplateGrid/GovernanceTemplateGridSkeleton";
import type { RuleStackViewProps } from "./RuleStack.types";

export function RuleStackView({
  className,
  onTemplateClick,
  gridEntries,
}: RuleStackViewProps) {
  const t = useTranslation("pages.home.ruleStack");
  const buttonText = t("button.seeAllTemplates");

  return (
    <section
      className={`
        w-full bg-transparent flex flex-col
        px-[20px] py-[32px]
        min-[640px]:px-[32px] min-[640px]:py-[48px]
        min-[768px]:py-[56px]
        min-[1024px]:px-[64px] min-[1024px]:py-[64px]
        min-[1440px]:px-[96px]
        gap-[24px]
        min-[640px]:gap-[32px]
        min-[1024px]:gap-[40px]
        ${className}
      `}
    >
      <SectionHeader
        title={t("title")}
        subtitle={t("subtitle")}
        variant="multi-line"
      />

      {gridEntries === null ? (
        <GovernanceTemplateGridSkeleton count={4} />
      ) : (
        <GovernanceTemplateGrid
          entries={gridEntries}
          onTemplateClick={onTemplateClick}
        />
      )}

      <div
        className="
        flex justify-center w-full
        max-[767px]:mt-[var(--measures-spacing-600,24px)]
        min-[768px]:max-[1023px]:mt-[var(--measures-spacing-800,32px)]
        min-[1024px]:mt-[var(--measures-spacing-1000,40px)]
      "
      >
        <Button
          buttonType="outline"
          palette="default"
          size="large"
          href="/templates"
        >
          {buttonText}
        </Button>
      </div>
    </section>
  );
}
