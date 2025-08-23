"use client";

import ContentLockup from "./ContentLockup";
import HeroDecor from "./HeroDecor";

const HeroBanner = ({ title, subtitle, description, ctaText, ctaHref }) => {
  return (
    <section className="bg-transparent px-[var(--spacing-scale-008)] sm:px-[var(--spacing-scale-010)] md:px-[var(--spacing-scale-016)] lg:px-[var(--spacing-scale-024)] xl:px-[var(--spacing-scale-048)]">
      <div className="flex flex-col gap-[var(--spacing-scale-010)]">
        {/* Frame container for content */}
        <div className="bg-[var(--color-surface-inverse-brand-primary)] p-[var(--spacing-scale-012)] sm:p-[var(--spacing-scale-016)] md:p-[var(--spacing-scale-064)] lg:py-[var(--spacing-scale-096)] lg:px-[var(--spacing-scale-064)] rounded-tl-none rounded-tr-[var(--radius-measures-radius-medium)] rounded-br-[var(--radius-measures-radius-medium)] rounded-bl-[var(--radius-measures-radius-medium)] flex flex-col gap-[var(--spacing-scale-024)] sm:gap-[var(--spacing-scale-024)] md:flex-row md:gap-[var(--spacing-scale-048)] relative overflow-hidden">
          {/* DECORATIONS (behind content) */}
          <HeroDecor
            className="pointer-events-none absolute z-0
                        left-0 top-0
                        translate-x-[-72px] translate-y-[26px] sm:translate-x-[-78px] sm:translate-y-[24px] md:translate-x-[-86px] md:translate-y-[16px] lg:translate-x-[-88px] lg:translate-y-[16px]
                        w-[1540px] h-[645px] scale-[1.04]"
          />

          {/* Content lockup - Large variant */}
          <div className="md:flex-1">
            <ContentLockup
              title={title}
              subtitle={subtitle}
              description={description}
              ctaText={ctaText}
              ctaHref={ctaHref}
              buttonClassName="shrink-0 whitespace-nowrap min-w-[280px]"
            />
          </div>

          {/* Hero Image Container */}
          <div className="w-full md:flex-1 rounded-[8px] overflow-hidden relative z-10 flex items-center justify-center">
            <img
              src="assets/HeroImage.png"
              alt="Hero illustration"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
