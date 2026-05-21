"use client";

import type { IconViewProps } from "./Icon.types";

export function IconView({
  icon,
  title,
  description,
  className,
  interactive,
  layoutTitleId,
  onClick,
  onKeyDown,
}: IconViewProps) {
  const interactionClass = interactive
    ? "cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-brand-primary)] focus:ring-offset-2"
    : "cursor-default";

  return (
    <div
      data-figma-node="22084-859659"
      className={`relative flex h-[350px] w-full min-w-[240px] max-w-[480px] flex-col items-start justify-between border border-solid border-[var(--color-border-default-secondary)] bg-transparent p-[var(--measures-spacing-020)] ${interactionClass} ${className}`}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? "button" : "article"}
      aria-label={interactive ? `${title}: ${description}` : undefined}
      aria-labelledby={interactive ? undefined : layoutTitleId}
      onClick={interactive ? onClick : undefined}
      onKeyDown={interactive ? onKeyDown : undefined}
    >
      {/* Icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center">
        {icon}
      </div>

      {/* Title — Figma XX Large / Label (32 / 36) */}
      <h3
        id={interactive ? undefined : layoutTitleId}
        className="w-full text-left font-inter text-[32px] font-normal leading-[36px] text-[var(--color-content-default-primary)]"
      >
        {title}
      </h3>

      {/* Body: X Small / Paragraph (12/16) per Figma; 14/20 on md–<lg only (Section 22084-859062) */}
      <p className="w-full text-left font-inter font-normal text-[length:var(--text-x-small-paragraph)] leading-[length:var(--text-x-small-paragraph--line-height)] text-[var(--color-content-default-primary)] md:text-[length:var(--text-small-paragraph)] md:leading-[length:var(--text-small-paragraph--line-height)] lg:text-[length:var(--text-x-small-paragraph)] lg:leading-[length:var(--text-x-small-paragraph--line-height)]">
        {description}
      </p>
    </div>
  );
}
