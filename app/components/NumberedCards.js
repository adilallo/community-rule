"use client";

import React, { memo, useMemo } from "react";
import NumberedCard from "./NumberedCard";
import SectionHeader from "./SectionHeader";
import Button from "./Button";

const NumberedCards = memo(({ title, subtitle, cards }) => {
  // Memoize schema data to prevent unnecessary re-computations
  const schemaData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: title,
      description: subtitle,
      step: cards.map((card, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: card.text,
        text: card.text,
      })),
    }),
    [title, subtitle, cards],
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <section className="bg-transparent py-[var(--spacing-scale-032)] px-[var(--spacing-scale-020)] sm:py-[var(--spacing-scale-048)] sm:px-[var(--spacing-scale-032)] lg:py-[var(--spacing-scale-064)] lg:px-[var(--spacing-scale-064)] xl:py-[var(--spacing-scale-076)] xl:px-[var(--spacing-scale-064)]">
        <div className="max-w-[var(--spacing-measures-max-width-lg)] mx-auto">
          <div className="grid grid-cols-1 gap-y-[var(--spacing-scale-032)] lg:gap-y-[var(--spacing-scale-056)]">
            {/* Section Header */}
            <div>
              <SectionHeader
                title={title}
                subtitle={subtitle}
                titleLg="How CommunityRule helps"
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
              {/* Default button for xsm and sm breakpoints */}
              <div className="block lg:hidden">
                <Button variant="default" size="large">
                  Create CommunityRule
                </Button>
              </div>
              {/* Outlined button for lg and xlg breakpoints */}
              <div className="hidden lg:block">
                <Button variant="outlined" size="large">
                  See how it works
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

NumberedCards.displayName = "NumberedCards";

export default NumberedCards;
