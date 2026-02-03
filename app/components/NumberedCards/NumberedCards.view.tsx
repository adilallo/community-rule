"use client";

import { useTranslation } from "../../contexts/MessagesContext";
import SectionHeader from "../SectionHeader";
import NumberedCard from "../NumberedCard";
import Button from "../Button";
import type { NumberedCardsViewProps } from "./NumberedCards.types";

function NumberedCardsView({
  title,
  subtitle,
  cards,
  schemaJson,
}: NumberedCardsViewProps) {
  const t = useTranslation();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson }}
      />
      <section className="bg-transparent py-[var(--spacing-scale-032)] px-[var(--spacing-scale-020)] sm:py-[var(--spacing-scale-048)] sm:px-[var(--spacing-scale-032)] lg:py-[var(--spacing-scale-064)] lg:px-[var(--spacing-scale-064)] xl:py-[var(--spacing-scale-076)] xl:px-[var(--spacing-scale-064)]">
        <div className="max-w-[var(--spacing-measures-max-width-lg)] mx-auto">
          <div className="grid grid-cols-1 gap-y-[var(--spacing-scale-032)] lg:gap-y-[var(--spacing-scale-056)]">
            {/* Section Header */}
            <div>
              <SectionHeader
                title={title}
                subtitle={subtitle}
                titleLg={t("numberedCards.titleLg")}
              />
            </div>

            {/* Cards Container */}
            <div className="grid grid-cols-1 gap-y-[var(--spacing-scale-024)] lg:grid-cols-3 lg:gap-[var(--spacing-scale-024)]">
              {cards.map((card, index) => (
                <NumberedCard
                  key={index}
                  number={index + 1}
                  text={card.text}
                  iconShape={card.iconShape}
                  iconColor={card.iconColor}
                />
              ))}
            </div>

            {/* Call to Action Button */}
            <div className="text-center sm:text-left lg:text-center">
              {/* Filled button for xsm and sm breakpoints */}
              <div className="block lg:hidden">
                <Button variant="filled" size="large">
                  {t("numberedCards.buttons.createCommunityRule")}
                </Button>
              </div>
              {/* Outline button for lg and xlg breakpoints */}
              <div className="hidden lg:block">
                <Button variant="outline" size="large">
                  {t("numberedCards.buttons.seeHowItWorks")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default NumberedCardsView;
