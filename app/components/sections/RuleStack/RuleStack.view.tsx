"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "../../../contexts/MessagesContext";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import RuleCard from "../../cards/RuleCard";
import SectionHeader from "../SectionHeader";
import Button from "../../buttons/Button";
import { getAssetPath } from "../../../../lib/assetUtils";
import type { RuleStackViewProps } from "./RuleStack.types";

export function RuleStackView({
  className,
  onTemplateClick,
}: RuleStackViewProps) {
  const t = useTranslation("pages.home.ruleStack");
  const [isMounted, setIsMounted] = useState(false);
  
  // Debug: Log button text to ensure translation works
  const buttonText = t("button.seeAllTemplates");

  // Determine current breakpoint for RuleCard size
  // 320-639: XS, 640-767: S, 768-1023: S, 1024-1439: M, 1440+: L
  const isMax639 = useMediaQuery("(max-width: 639px)");
  const isMin640Max1023 = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  const isMin1024Max1439 = useMediaQuery("(min-width: 1024px) and (max-width: 1439px)");
  const isMin1440 = useMediaQuery("(min-width: 1440px)");

  // Handle hydration: only use media queries after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use CSS classes for responsive sizing to avoid hydration mismatch
  // Default to M size for SSR, then let CSS handle the responsive sizing
  const cardSize = isMounted
    ? isMax639
      ? "XS"
      : isMin640Max1023
      ? "S"
      : isMin1024Max1439
      ? "M"
      : isMin1440
      ? "L"
      : "M"
    : "M";

  // Icon sizes: XS=40px, S=56px, M=56px, L=90px
  // Use a large default (90px) and let CSS handle responsive sizing

  // Card data
  const cards = [
    {
      title: t("cards.consensusClusters.title"),
      description: t("cards.consensusClusters.description"),
      iconAlt: t("cards.consensusClusters.iconAlt"),
      iconPath: "assets/Icon_Sociocracy.svg",
      backgroundColor: "bg-[var(--color-surface-default-brand-lime)]",
    },
    {
      title: t("cards.consensus.title"),
      description: t("cards.consensus.description"),
      iconAlt: t("cards.consensus.iconAlt"),
      iconPath: "assets/Icon_Consensus.svg",
      backgroundColor: "bg-[var(--color-surface-default-brand-rust)]",
    },
    {
      title: t("cards.electedBoard.title"),
      description: t("cards.electedBoard.description"),
      iconAlt: t("cards.electedBoard.iconAlt"),
      iconPath: "assets/Icon_ElectedBoard.svg",
      backgroundColor: "bg-[var(--color-surface-default-brand-red)]",
    },
    {
      title: t("cards.petition.title"),
      description: t("cards.petition.description"),
      iconAlt: t("cards.petition.iconAlt"),
      iconPath: "assets/Icon_Petition.svg",
      backgroundColor: "bg-[var(--color-surface-default-brand-teal)]",
    },
  ];

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
      {/* Section Header */}
      <SectionHeader
        title={t("title")}
        subtitle={t("subtitle")}
        variant="multi-line"
      />

      {/* Cards Container */}
      <div
        className={`
          flex flex-col gap-[18px]
          min-[768px]:grid min-[768px]:grid-cols-2 min-[768px]:gap-[18px]
          min-[1024px]:gap-[24px]
        `}
      >
        {cards.map((card, index) => (
          <RuleCard
            key={index}
            title={card.title}
            description={card.description}
            size={cardSize}
            className="
              max-[639px]:rounded-[var(--measures-radius-200,8px)]
              min-[640px]:max-[1023px]:rounded-[var(--measures-radius-300,12px)]
              min-[1024px]:rounded-[var(--radius-measures-radius-small)]
              max-[639px]:pb-[24px] max-[639px]:pt-[12px] max-[639px]:px-[12px]
              min-[640px]:max-[1023px]:p-[24px]
              min-[1024px]:max-[1439px]:p-[16px]
              min-[1440px]:p-[24px]
              max-[1023px]:gap-[18px]
              min-[1024px]:max-[1439px]:gap-[12px]
              min-[1440px]:gap-[10px]
            "
            icon={
              <Image
                src={getAssetPath(card.iconPath)}
                alt={card.iconAlt}
                width={90}
                height={90}
                className="
                  max-[639px]:w-[40px] max-[639px]:h-[40px]
                  min-[640px]:max-[1023px]:w-[56px] min-[640px]:max-[1023px]:h-[56px]
                  min-[1024px]:max-[1439px]:w-[56px] min-[1024px]:max-[1439px]:h-[56px]
                  min-[1440px]:w-[90px] min-[1440px]:h-[90px]
                "
              />
            }
            backgroundColor={card.backgroundColor}
            onClick={() => onTemplateClick(card.title)}
          />
        ))}
      </div>

      {/* See all templates button */}
      <div className="
        flex justify-center w-full
        max-[767px]:mt-[var(--measures-spacing-600,24px)]
        min-[768px]:max-[1023px]:mt-[var(--measures-spacing-800,32px)]
        min-[1024px]:mt-[var(--measures-spacing-1000,40px)]
      ">
        <Button
          buttonType="outline"
          palette="default"
          size="large"
        >
          {buttonText}
        </Button>
      </div>
    </section>
  );
}
