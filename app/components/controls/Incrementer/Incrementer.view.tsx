"use client";

import { memo } from "react";
import type { IncrementerViewProps } from "./Incrementer.types";

const STEP_BUTTON_CLASSES =
  "bg-[var(--color-surface-default-secondary,#141414)] text-[var(--color-content-default-primary,#fff)] inline-flex shrink-0 items-center justify-center overflow-clip rounded-[var(--measures-radius-full,9999px)] px-[var(--space-200,8px)] py-[var(--measures-spacing-150,6px)] transition-[background,color,transform] duration-200 ease-in-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-invert-primary,#fff)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-default-primary,#000)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100";

function MinusIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="block size-[12px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="block size-[12px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IncrementerView({
  displayValue,
  disabled,
  atMin,
  atMax,
  onDecrement,
  onIncrement,
  decrementAriaLabel,
  incrementAriaLabel,
  className,
}: IncrementerViewProps) {
  const valueColor = disabled
    ? "text-[color:var(--color-content-default-tertiary,#b4b4b4)]"
    : "text-[color:var(--color-content-default-primary,#fff)]";

  return (
    <div
      className={`inline-flex items-center gap-[16px] ${className}`.trim()}
      data-figma-node="17857:30943"
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={disabled || atMin}
        aria-label={decrementAriaLabel}
        className={STEP_BUTTON_CLASSES}
      >
        <MinusIcon />
      </button>
      <span
        aria-live="polite"
        className={`shrink-0 whitespace-nowrap font-inter text-[length:var(--sizing-350,14px)] font-medium leading-[18px] ${valueColor}`}
      >
        {displayValue}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={disabled || atMax}
        aria-label={incrementAriaLabel}
        className={STEP_BUTTON_CLASSES}
      >
        <PlusIcon />
      </button>
    </div>
  );
}

IncrementerView.displayName = "IncrementerView";

export default memo(IncrementerView);
