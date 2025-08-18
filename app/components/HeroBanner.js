"use client";

import ContentLockup from "./ContentLockup";
import HeroDecor from "./HeroDecor";

const HeroBanner = ({ title, subtitle, description, ctaText, ctaHref }) => {
  return (
    <section className="bg-transparent px-[var(--spacing-scale-008)]">
      <div className="flex flex-col gap-[var(--spacing-scale-010)]">
        {/* Frame container for content */}
        <div className="bg-[var(--color-surface-default-brand-primary)] p-[var(--spacing-scale-012)] rounded-tl-none rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px] flex flex-col gap-[var(--spacing-scale-024)] relative overflow-hidden">
          {/* DECORATIONS (behind content) */}
          <HeroDecor
            className="pointer-events-none absolute z-0
                        left-0 top-0
                        translate-x-[-72px] translate-y-[26px]
                        w-[1540px] h-[645px] scale-[1.04]"
          />

          {/* Content lockup - Large variant */}
          <ContentLockup
            title={title}
            subtitle={subtitle}
            description={description}
            ctaText={ctaText}
            ctaHref={ctaHref}
          />

          {/* Hero Image Container */}
          <div className="w-full rounded-[8px] relative z-10">
            <img
              src="/assets/HeroImage.png"
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
