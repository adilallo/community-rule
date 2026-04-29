"use client";

import { memo } from "react";
import type { HeaderLockupViewProps } from "./HeaderLockup.types";

function HeaderLockupView({
  title,
  description,
  justification,
  size,
  palette,
  titleId,
}: HeaderLockupViewProps) {
  const isL = size === "L";
  const isLeft = justification === "left";
  const isInverse = palette === "inverse";

  const titleColorClass = isInverse
    ? "text-[var(--color-content-invert-primary)]"
    : "text-[var(--color-content-default-primary,white)]";
  const descriptionColorClass = isInverse
    ? "text-[#2d2d2d]"
    : "text-[var(--color-content-default-tertiary,#b4b4b4)]";

  return (
    <div
      className={`flex flex-col gap-[var(--measures-spacing-200,8px)] py-[12px] relative ${
        isLeft ? "items-start" : "items-center"
      }`}
    >
      {/* Title */}
      <div className="flex items-center relative shrink-0 w-full">
        <h1
          id={titleId}
          className={`flex-[1_0_0] min-h-px min-w-px overflow-hidden relative ${titleColorClass} text-ellipsis whitespace-pre-wrap ${
            isLeft ? "text-left" : "text-center"
          } ${
            isL
              ? "font-bricolage-grotesque font-extrabold text-[36px] leading-[44px]"
              : "font-bricolage-grotesque font-bold text-[28px] leading-[36px]"
          }`}
        >
          {title}
        </h1>
      </div>

      {/* Description */}
      {description != null &&
        !(typeof description === "string" && description.length === 0) &&
        (typeof description === "string" ? (
          <p
            className={`font-inter font-normal max-w-[640px] overflow-hidden relative shrink-0 ${descriptionColorClass} text-ellipsis w-full whitespace-pre-wrap ${
              isLeft ? "" : "text-center"
            } ${
              isL ? "text-[18px] leading-[1.3]" : "text-[14px] leading-[20px]"
            }`}
          >
            {description}
          </p>
        ) : (
          <div
            className={`font-inter font-normal max-w-[640px] overflow-hidden relative shrink-0 ${descriptionColorClass} text-ellipsis w-full whitespace-pre-wrap ${
              isLeft ? "" : "text-center"
            } ${
              isL ? "text-[18px] leading-[1.3]" : "text-[14px] leading-[20px]"
            }`}
          >
            {description}
          </div>
        ))}
    </div>
  );
}

HeaderLockupView.displayName = "HeaderLockupView";

export default memo(HeaderLockupView);
