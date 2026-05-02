"use client";

import { memo } from "react";

/**
 * Figma: Community Rule System — **Vertical button** (`19787:10896`).
 *
 * Tile control: column layout, brand-primary border on transparent surface,
 * 32px icon slot + centered 14/18 medium label (label rendered by `children`).
 */
export interface VerticalProps {
  children: React.ReactNode;
  onClick?: (_event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
  "data-testid"?: string;
}

function VerticalComponent({
  children,
  onClick,
  className = "",
  disabled = false,
  ariaLabel,
  type = "button",
  "data-testid": dataTestId,
}: VerticalProps) {
  const base =
    "box-border flex w-[90px] shrink-0 cursor-pointer flex-col items-center gap-[var(--spacing-scale-008)] rounded-[var(--spacing-scale-004)] border border-solid border-[var(--color-border-default-brand-primary)] bg-transparent px-[var(--spacing-scale-008)] py-[var(--spacing-scale-012)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-invert-primary)] disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid={dataTestId}
      className={`${base} ${className}`.trim()}
    >
      {children}
    </button>
  );
}

VerticalComponent.displayName = "Vertical";

export default memo(VerticalComponent);
