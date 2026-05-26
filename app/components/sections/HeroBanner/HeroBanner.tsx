/**
 * Figma: "Sections / Hero" (see registry)
 */

import { memo } from "react";
import Image from "next/image";
import ContentLockup from "../../type/ContentLockup";
import HeroDecor from "./HeroDecor";
import { ASSETS, getAssetPath } from "../../../../lib/assetUtils";

/**
 * Intrinsic dimensions of `public/assets/marketing/hero-image.png` (2560×1600,
 * 16:10). Passed to `next/image` to reserve aspect ratio + drive responsive
 * srcset generation. Actual rendered size is governed by `sizes`.
 */
const HERO_IMAGE_WIDTH = 2560;
const HERO_IMAGE_HEIGHT = 1600;

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  imageAlt?: string;
}

const HeroBanner = memo<HeroBannerProps>(
  ({
    title,
    subtitle,
    description,
    ctaText,
    ctaHref,
    imageAlt = "Hero illustration",
  }) => {
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
            <div className="relative z-10 flex w-full items-center justify-center overflow-hidden rounded-[8px] aspect-[16/10] md:flex-1">
              <Image
                src={getAssetPath(ASSETS.HERO_IMAGE)}
                alt={imageAlt}
                width={HERO_IMAGE_WIDTH}
                height={HERO_IMAGE_HEIGHT}
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="size-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    );
  },
);

HeroBanner.displayName = "HeroBanner";

export default HeroBanner;
