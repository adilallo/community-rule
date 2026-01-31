"use client";

import Image from "next/image";
import { useTranslation } from "../../contexts/MessagesContext";
import RuleCard from "../RuleCard";
import Button from "../Button";
import { getAssetPath } from "../../../lib/assetUtils";
import type { RuleStackViewProps } from "./RuleStack.types";

export function RuleStackView({
  className,
  onTemplateClick,
}: RuleStackViewProps) {
  const t = useTranslation("pages.home.ruleStack");

  return (
    <section
      className={`w-full bg-transparent py-[var(--spacing-scale-032)] px-[var(--spacing-scale-020)] md:py-[var(--spacing-scale-048)] md:px-[var(--spacing-scale-032)] xmd:py-[var(--spacing-scale-056)] xmd:px-[var(--spacing-scale-032)] lg:py-[var(--spacing-scale-064)] lg:px-[var(--spacing-scale-064)] xl:py-[var(--spacing-scale-064)] xl:px-[var(--spacing-scale-096)] flex flex-col gap-[var(--spacing-scale-024)] xmd:gap-[var(--spacing-scale-032)] lg:gap-[var(--spacing-scale-040)] ${className}`}
    >
      <div className="flex flex-col gap-[18px] xmd:grid xmd:grid-cols-2 lg:gap-[var(--spacing-scale-024)]">
        <RuleCard
          title={t("cards.consensusClusters.title")}
          description={t("cards.consensusClusters.description")}
          icon={
            <Image
              src={getAssetPath("assets/Icon_Sociocracy.svg")}
              alt={t("cards.consensusClusters.iconAlt")}
              width={40}
              height={40}
              className="md:w-[56px] md:h-[56px] lg:w-[90px] lg:h-[90px]"
            />
          }
          backgroundColor="bg-[var(--color-surface-default-brand-lime)]"
          onClick={() => onTemplateClick(t("cards.consensusClusters.title"))}
        />
        <RuleCard
          title={t("cards.consensus.title")}
          description={t("cards.consensus.description")}
          icon={
            <Image
              src={getAssetPath("assets/Icon_Consensus.svg")}
              alt={t("cards.consensus.iconAlt")}
              width={40}
              height={40}
              className="md:w-[56px] md:h-[56px] lg:w-[90px] lg:h-[90px]"
            />
          }
          backgroundColor="bg-[var(--color-surface-default-brand-rust)]"
          onClick={() => onTemplateClick(t("cards.consensus.title"))}
        />
        <RuleCard
          title={t("cards.electedBoard.title")}
          description={t("cards.electedBoard.description")}
          icon={
            <Image
              src={getAssetPath("assets/Icon_ElectedBoard.svg")}
              alt={t("cards.electedBoard.iconAlt")}
              width={40}
              height={40}
              className="md:w-[56px] md:h-[56px] lg:w-[90px] lg:h-[90px]"
            />
          }
          backgroundColor="bg-[var(--color-surface-default-brand-red)]"
          onClick={() => onTemplateClick(t("cards.electedBoard.title"))}
        />
        <RuleCard
          title={t("cards.petition.title")}
          description={t("cards.petition.description")}
          icon={
            <Image
              src={getAssetPath("assets/Icon_Petition.svg")}
              alt={t("cards.petition.iconAlt")}
              width={40}
              height={40}
              className="md:w-[56px] md:h-[56px] lg:w-[90px] lg:h-[90px]"
            />
          }
          backgroundColor="bg-[var(--color-surface-default-brand-teal)]"
          onClick={() => onTemplateClick(t("cards.petition.title"))}
        />
      </div>

      {/* See all templates button */}
      <div className="flex justify-center">
        <Button variant="outlined" size="large">
          {t("button.seeAllTemplates")}
        </Button>
      </div>
    </section>
  );
}
