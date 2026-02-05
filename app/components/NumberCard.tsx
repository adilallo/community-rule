"use client";

import { memo } from "react";
import SectionNumber from "./SectionNumber";

import { normalizeNumberCardSize } from "../../lib/propNormalization";

export type NumberCardSizeValue =
  | "Small"
  | "Medium"
  | "Large"
  | "XLarge"
  | "small"
  | "medium"
  | "large"
  | "xlarge";

interface NumberCardProps {
  number: number;
  text: string;
  /**
   * Number card size. Accepts both PascalCase (Figma default) and lowercase (case-insensitive).
   * Figma uses PascalCase, codebase uses PascalCase - both are supported.
   */
  size?: NumberCardSizeValue;
  iconShape?: string;
  iconColor?: string;
}

const NumberCard = memo<NumberCardProps>(({ number, text, size: sizeProp }) => {
  // Base classes common to all sizes
  const baseClasses = "bg-[var(--color-surface-inverse-primary)] rounded-[12px] shadow-lg";

  // If size prop is provided, use explicit size classes
  // Otherwise, use responsive breakpoints for backward compatibility
  if (sizeProp) {
    // Normalize props to handle both PascalCase (Figma) and lowercase (codebase)
    const size = normalizeNumberCardSize(sizeProp);
    // Size-specific classes
    const sizeClasses = {
      Small: "flex flex-col items-end justify-center gap-4 p-5 relative",
      Medium: "flex flex-row items-center gap-8 p-8 relative",
      Large: "flex flex-col items-start justify-end gap-[22px] h-[238px] p-8 relative",
      XLarge: "flex flex-col items-start justify-end gap-[22px] h-[238px] p-8 relative",
    };

    // Text size classes
    const textClasses = {
      Small: "font-bricolage-grotesque font-medium text-[24px] leading-[32px] text-[#141414]",
      Medium: "font-bricolage-grotesque font-medium text-[24px] leading-[24px] text-[#141414]",
      Large: "font-bricolage-grotesque font-medium text-[24px] leading-[24px] text-[#141414]",
      XLarge: "font-bricolage-grotesque font-medium text-[32px] leading-[32px] text-[#141414]",
    };

    // Section number wrapper classes - Small doesn't need a wrapper
    const sectionNumberWrapperClasses = {
      Small: "relative shrink-0",
      Medium: "flex justify-start flex-shrink-0",
      Large: "absolute top-8 right-8",
      XLarge: "absolute top-8 right-8",
    };

    // Content container classes
    const contentClasses = {
      Small: "min-w-full relative shrink-0",
      Medium: "flex-1",
      Large: "absolute bottom-8 left-8 right-16",
      XLarge: "absolute bottom-8 left-8 right-16",
    };

    // Small variant has section number as direct child, others need wrapper
    if (size === "Small") {
      return (
        <div className={`${baseClasses} ${sizeClasses[size]}`}>
          {/* Section Number - Direct child for Small */}
          <SectionNumber number={number} />
          
          {/* Card Content */}
          <p className={textClasses[size]}>
            {text}
          </p>
        </div>
      );
    }

    return (
      <div className={`${baseClasses} ${sizeClasses[size]}`}>
        {/* Section Number */}
        <div className={sectionNumberWrapperClasses[size]}>
          <SectionNumber number={number} />
        </div>

        {/* Card Content */}
        <div className={contentClasses[size]}>
          <p className={textClasses[size]}>
            {text}
          </p>
        </div>
      </div>
    );
  }

  // Responsive breakpoints for backward compatibility (matches original behavior)
  // Maps to: Small (mobile) -> Medium (sm) -> Large (lg) -> XLarge (xl)
  return (
    <div className={`${baseClasses} flex flex-col gap-4 p-5 sm:flex-row sm:gap-8 sm:p-8 sm:items-center lg:flex-col lg:gap-[22px] lg:items-start lg:justify-end lg:p-8 lg:relative lg:h-[238px]`}>
      {/* Section Number - Responsive positioning */}
      <div className="flex justify-end items-end sm:justify-start sm:flex-shrink-0 lg:absolute lg:top-8 lg:right-8">
        <SectionNumber number={number} />
      </div>

      {/* Card Content - Responsive positioning */}
      <div className="sm:flex-1 lg:absolute lg:bottom-8 lg:left-8 lg:right-16">
        <p className="font-bricolage-grotesque font-medium text-[24px] leading-[32px] sm:leading-[24px] sm:text-[24px] lg:text-[24px] lg:leading-[24px] xl:text-[32px] xl:leading-[32px] text-[#141414]">
          {text}
        </p>
      </div>
    </div>
  );
});

NumberCard.displayName = "NumberCard";

export default NumberCard;
