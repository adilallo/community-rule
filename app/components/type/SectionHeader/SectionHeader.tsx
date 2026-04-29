"use client";

import { memo } from "react";
import type { SectionHeaderVariantValue } from "../../../../lib/propNormalization";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  titleLg?: string;
  variant?: SectionHeaderVariantValue;
  /** When set with `variant="multi-line"`, large screens show three title lines (Figma SectionCardSteps). */
  stackedDesktopLines?: readonly [string, string, string];
}

/**
 * Figma: **Type / SectionHeader** ([17411:10981](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=17411-10981)).
 * Responsive title + subtitle lockup: stacked on small viewports, split row from `lg` up.
 */
const SectionHeader = memo<SectionHeaderProps>(
  ({
    title,
    subtitle,
    titleLg,
    variant: variantProp = "default",
    stackedDesktopLines,
  }) => {
    const variant = variantProp;
    const useStackedDesktop =
      variant === "multi-line" && stackedDesktopLines != null;
    const rowAlignClasses =
      variant === "multi-line"
        ? "lg:flex-row lg:justify-between lg:items-center xl:gap-[var(--spacing-scale-024)]"
        : "lg:flex-row lg:justify-between lg:items-start xl:gap-[var(--spacing-scale-024)]";

    return (
      <div
        className={`flex flex-col gap-[var(--spacing-scale-004)] w-full ${rowAlignClasses}`}
      >
        {/* Title — left column at lg+ */}
        <div
          className={
            variant === "multi-line"
              ? "lg:w-[50%] lg:h-[var(--spacing-scale-120)] lg:flex lg:items-center xl:w-[50%] xl:h-[156px] xl:flex xl:items-center"
              : "lg:w-[369px] lg:h-[var(--spacing-scale-120)] lg:flex lg:items-center xl:w-[452px] xl:h-[156px] xl:flex xl:items-center"
          }
        >
          <h2
            className={
              variant === "multi-line"
                ? "font-bricolage-grotesque font-bold text-[28px] leading-[36px] md:text-[32px] md:leading-[40px] lg:w-[410px] lg:text-left xl:text-[40px] xl:leading-[52px] text-[var(--color-content-default-primary)]"
                : "font-bricolage-grotesque font-bold text-[28px] leading-[36px] sm:text-[32px] sm:leading-[40px] lg:text-[32px] lg:leading-[40px] lg:w-[369px] lg:pr-[var(--spacing-scale-096)] xl:text-[40px] xl:leading-[52px] xl:w-[452px] xl:pr-[var(--spacing-scale-096)] text-[var(--color-content-default-primary)]"
            }
          >
            <span className="block lg:hidden">{title}</span>
            {useStackedDesktop ? (
              <span className="hidden lg:block">
                <span className="block">{stackedDesktopLines[0]}</span>
                <span className="block">{stackedDesktopLines[1]}</span>
                <span className="block">{stackedDesktopLines[2]}</span>
              </span>
            ) : (
              <span className="hidden lg:block">{titleLg || title}</span>
            )}
          </h2>
        </div>

        {/* Subtitle — right column at lg+ (Figma X Large / Large / stacked small) */}
        <div
          className={
            variant === "multi-line"
              ? "lg:w-[50%] lg:h-[var(--spacing-scale-120)] lg:flex lg:items-center lg:justify-end lg:ml-[var(--spacing-scale-016)] xl:ml-0 xl:w-[50%] xl:h-[156px] xl:flex xl:items-center xl:justify-end"
              : "lg:w-[928px] lg:h-[var(--spacing-scale-120)] lg:flex lg:items-center lg:justify-end xl:h-[156px] xl:flex xl:items-center xl:justify-end"
          }
        >
          <p
            className={
              variant === "multi-line"
                ? "font-inter font-normal text-[14px] leading-[20px] md:text-[18px] md:leading-[130%] xl:text-[24px] xl:leading-[32px] text-[var(--color-content-default-tertiary)] lg:text-right"
                : "font-inter font-normal text-[18px] leading-[130%] sm:text-[18px] sm:leading-[32px] lg:text-[24px] lg:leading-[32px] xl:text-[32px] xl:leading-[40px] xl:text-right text-[#484848] sm:text-[var(--color-content-default-tertiary)] lg:text-[var(--color-content-default-tertiary)] xl:text-[var(--color-content-default-tertiary)] tracking-[0px]"
            }
          >
            {subtitle}
          </p>
        </div>
      </div>
    );
  },
);

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
