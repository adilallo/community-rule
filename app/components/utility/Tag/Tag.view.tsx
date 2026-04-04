"use client";

import type { TagViewProps } from "./Tag.types";

/**
 * Tag view – Figma 17861-22238.
 * Recommended: light yellow bg (#F6EEA7), dark text (#3F3F3F).
 * Selected: dark bg (#3F3F3F), white text (#FFFFFF).
 * Typography: Inter Medium 10px, line-height 12, uppercase.
 */
export function TagView({ variant, children, className }: TagViewProps) {
  const isRecommended = variant === "recommended";
  const bgClass = isRecommended ? "bg-[#F6EEA7]" : "bg-[#3F3F3F]";
  const textClass = isRecommended ? "text-[#3F3F3F]" : "text-[#FFFFFF]";

  return (
    <span
      className={`inline-flex w-[6rem] min-w-[6rem] items-center justify-center rounded px-2 py-0.5 font-inter text-[10px] font-medium uppercase leading-3 ${bgClass} ${textClass} ${className}`}
      role="status"
    >
      {children}
    </span>
  );
}
