"use client";

import type { TagViewProps } from "./Tag.types";

/**
 * Tag view – Figma 17861-22238; **`Selection`** (Figma Card / CardSelection, `16775:28762`).
 */
export function TagView({ variant, children, className }: TagViewProps) {
  const isRecommended = variant === "recommended";
  const bgClass = isRecommended
    ? "bg-[var(--color-surface-inverse-brand-accent)]"
    : "bg-[var(--color-gray-1000)]";
  const textClass = isRecommended
    ? "text-[var(--color-content-inverse-brand-primary)]"
    : "text-[var(--color-gray-000)]";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[2px] px-1 py-0.5 font-inter text-[10px] font-medium uppercase leading-3 ${bgClass} ${textClass} ${className}`}
      role="status"
    >
      {children}
    </span>
  );
}
