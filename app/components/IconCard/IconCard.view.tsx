"use client";

import type { IconCardViewProps } from "./IconCard.types";

export function IconCardView({
  icon,
  title,
  description,
  className,
  onClick,
  onKeyDown,
}: IconCardViewProps) {
  return (
    <div
      className={`border border-[var(--color-border-default-primary)] flex flex-col h-[350px] items-start justify-between p-[var(--measures-spacing-020)] relative w-[288px] bg-transparent cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-brand-primary)] focus:ring-offset-2 ${className}`}
      tabIndex={0}
      role="button"
      aria-label={`${title}: ${description}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {/* Icon */}
      <div className="shrink-0 w-[36px] h-[36px] flex items-center justify-center">
        {icon}
      </div>

      {/* Title - Centered with auto space above and below */}
      <h3 className="font-inter font-normal text-[32px] leading-[36px] text-[var(--color-content-default-primary)] w-full">
        {title}
      </h3>

      {/* Description */}
      <p className="font-inter font-medium text-[10px] leading-[14px] uppercase text-[var(--color-content-default-primary)] w-full">
        {description}
      </p>
    </div>
  );
}
