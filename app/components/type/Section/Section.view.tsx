"use client";

import { memo } from "react";
import type { SectionProps } from "./Section.types";

/**
 * Figma: **Section** (22002:30757) — vertical rail + category + stacked content
 * (typically **TextBlock** children inside Community Rule).
 */

const SECTION_LINE_COLOR = "var(--color-border-default-tertiary, #464646)";

const CATEGORY_CLASS =
  "font-inter font-medium text-[16px] leading-[20px] text-[var(--color-content-invert-secondary,#1f1f1f)] shrink-0 w-full min-w-0";

function SectionView({
  categoryName,
  showRail = true,
  children,
  className = "",
}: SectionProps) {
  const inner = (
    <div className="flex min-w-0 flex-1 flex-col gap-4" style={{ gap: "16px" }}>
      <p className={CATEGORY_CLASS}>{categoryName}</p>
      <div className="flex min-w-0 flex-col gap-6">{children}</div>
    </div>
  );

  if (!showRail) {
    return (
      <div className={`flex min-w-0 flex-col ${className}`.trim()} data-name="Section">
        {inner}
      </div>
    );
  }

  return (
    <div
      className={`flex min-w-0 items-stretch gap-3 ${className}`.trim()}
      style={{ gap: "12px" }}
      data-name="Section"
    >
      <div
        className="w-px shrink-0 self-stretch"
        style={{ backgroundColor: SECTION_LINE_COLOR }}
        aria-hidden
      />
      {inner}
    </div>
  );
}

SectionView.displayName = "SectionView";

export default memo(SectionView);
