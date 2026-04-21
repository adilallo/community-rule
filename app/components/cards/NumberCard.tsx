"use client";

import { memo } from "react";
import SectionNumber from "../sections/SectionNumber";

export type NumberCardSizeValue = "small" | "medium" | "large" | "xlarge";

interface NumberCardProps {
  number: number;
  text: string;
  size?: NumberCardSizeValue;
  iconShape?: string;
  iconColor?: string;
}

const NumberCard = memo<NumberCardProps>(({ number, text, size: sizeProp }) => {
  const baseClasses =
    "bg-[var(--color-surface-inverse-primary)] rounded-[12px] shadow-lg";

  if (sizeProp) {
    const size = sizeProp;
    const sizeClasses = {
      small: "flex flex-col items-end justify-center gap-4 p-5 relative",
      medium: "flex flex-row items-center gap-8 p-8 relative",
      large:
        "flex flex-col items-start justify-end gap-[22px] h-[238px] p-8 relative",
      xlarge:
        "flex flex-col items-start justify-end gap-[22px] h-[238px] p-8 relative",
    };

    const textClasses = {
      small:
        "font-bricolage-grotesque font-medium text-[24px] leading-[32px] text-[#141414]",
      medium:
        "font-bricolage-grotesque font-medium text-[24px] leading-[24px] text-[#141414]",
      large:
        "font-bricolage-grotesque font-medium text-[24px] leading-[24px] text-[#141414]",
      xlarge:
        "font-bricolage-grotesque font-medium text-[32px] leading-[32px] text-[#141414]",
    };

    const sectionNumberWrapperClasses = {
      small: "relative shrink-0",
      medium: "flex justify-start flex-shrink-0",
      large: "absolute top-8 right-8",
      xlarge: "absolute top-8 right-8",
    };

    const contentClasses = {
      small: "min-w-full relative shrink-0",
      medium: "flex-1",
      large: "absolute bottom-8 left-8 right-16",
      xlarge: "absolute bottom-8 left-8 right-16",
    };

    if (size === "small") {
      return (
        <div className={`${baseClasses} ${sizeClasses[size]}`}>
          {/* Section Number - Direct child for Small */}
          <SectionNumber number={number} />

          {/* Card Content */}
          <p className={textClasses[size]}>{text}</p>
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
          <p className={textClasses[size]}>{text}</p>
        </div>
      </div>
    );
  }

  // Responsive breakpoints for backward compatibility (matches original behavior)
  // Maps to: Small (mobile) -> Medium (sm) -> Large (lg) -> XLarge (xl)
  return (
    <div
      className={`${baseClasses} flex flex-col gap-4 p-5 sm:flex-row sm:gap-8 sm:p-8 sm:items-center lg:flex-col lg:gap-[22px] lg:items-start lg:justify-end lg:p-8 lg:relative lg:h-[238px]`}
    >
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
