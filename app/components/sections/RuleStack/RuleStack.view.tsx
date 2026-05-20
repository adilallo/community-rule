"use client";

import { useTranslation } from "../../../contexts/MessagesContext";
import SectionHeader from "../../type/SectionHeader";
import Button from "../../buttons/Button";
import { GovernanceTemplateGrid } from "../GovernanceTemplateGrid";
import { GovernanceTemplateGridSkeleton } from "../GovernanceTemplateGrid/GovernanceTemplateGridSkeleton";
import type { RuleStackViewProps } from "./RuleStack.types";

/** Figma **Section / RuleStack** [22085:860413](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22085-860413&m=dev). */
export function RuleStackView({
  className,
  onTemplateClick,
  gridEntries,
  translationNamespace,
  twoColumnsFromMd = false,
}: RuleStackViewProps) {
  const t = useTranslation(translationNamespace);
  const buttonText = t("button.seeAllTemplates");

  return (
    <section
      data-figma-node="22085-860413"
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
        ruleStackDesktopTypeScale
        twoColumnsFromMd={twoColumnsFromMd}
      />

      {gridEntries === null ? (
        <GovernanceTemplateGridSkeleton
          count={4}
          twoColumnsFromMd={twoColumnsFromMd}
        />
      ) : (
        <GovernanceTemplateGrid
          entries={gridEntries}
          onTemplateClick={onTemplateClick}
          twoColumnsFromMd={twoColumnsFromMd}
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
