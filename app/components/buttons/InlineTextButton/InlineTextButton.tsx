"use client";

import { memo } from "react";

export interface InlineTextButtonProps {
  /**
   * Button label content.
   */
  children: React.ReactNode;
  /**
   * Click handler.
   */
  onClick?: (_event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Extra class names. Use `className` to override typography/color when the
   * button must inherit parent font-size/leading (e.g. mid-paragraph usage).
   */
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
  /** When set, removes the default underline (e.g. inverse surfaces). */
  underline?: boolean;
  "data-testid"?: string;
}

/**
 * Small text-styled button for in-paragraph "link"-like controls (expand,
 * add, etc.). The Figma "link" treatment is a tertiary-colored underline with
 * a 3px underline-offset and inherited typography, which sits between a real
 * anchor and a styled `Button`.
 *
 * Use this anywhere a `<button>` is needed inline with body copy — do not use
 * for primary/secondary actions (reach for `Button` instead).
 */
function InlineTextButtonComponent({
  children,
  onClick,
  className = "",
  disabled = false,
  ariaLabel,
  type = "button",
  underline = true,
  "data-testid": dataTestId,
}: InlineTextButtonProps) {
  const baseClasses = [
    "cursor-pointer border-none bg-transparent p-0",
    underline
      ? "font-inter font-normal text-[length:inherit] leading-[inherit] text-[color:var(--color-content-default-tertiary,#b4b4b4)] underline decoration-solid underline-offset-[3px]"
      : "text-[length:inherit] leading-[inherit] text-[color:inherit] no-underline",
    "hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-invert-primary)] disabled:cursor-not-allowed disabled:opacity-60",
  ].join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid={dataTestId}
      className={`${baseClasses} ${className}`.trim()}
    >
      {children}
    </button>
  );
}

InlineTextButtonComponent.displayName = "InlineTextButton";

export default memo(InlineTextButtonComponent);
