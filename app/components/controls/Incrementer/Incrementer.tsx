"use client";

import { memo } from "react";

export interface IncrementerProps {
  value: number;
  /** Minimum value (default `-Infinity`). */
  min?: number;
  /** Maximum value (default `Infinity`). */
  max?: number;
  /** Step size applied to +/- actions (default `1`). */
  step?: number;
  onChange: (_next: number) => void;
  /**
   * Optional formatter for the displayed value. Receives the raw number and
   * should return the rendered content. Default: `String(value)`.
   */
  formatValue?: (_value: number) => React.ReactNode;
  /**
   * When true, the whole incrementer is non-interactive and the value renders
   * in the "inactive" (tertiary) color per Figma.
   */
  disabled?: boolean;
  /** Accessible label for the decrement button (default "Decrease"). */
  decrementAriaLabel?: string;
  /** Accessible label for the increment button (default "Increase"). */
  incrementAriaLabel?: string;
  className?: string;
}

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

/**
 * Figma: "Control / Incrementer" (`17857:30943`). A compact `[ - value + ]`
 * row used for numeric step inputs (e.g. a percentage setting).
 *
 * For a labelled variant that matches "Control / Incrementer Block"
 * (`19883:13283`), compose with {@link IncrementerBlock} instead.
 */
function IncrementerComponent({
  value,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  onChange,
  formatValue,
  disabled = false,
  decrementAriaLabel = "Decrease",
  incrementAriaLabel = "Increase",
  className = "",
}: IncrementerProps) {
  const clampedValue = Math.min(Math.max(value, min), max);
  const atMin = clampedValue <= min;
  const atMax = clampedValue >= max;

  const decrement = () => {
    if (disabled || atMin) return;
    onChange(Math.max(min, clampedValue - step));
  };
  const increment = () => {
    if (disabled || atMax) return;
    onChange(Math.min(max, clampedValue + step));
  };

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
        onClick={decrement}
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
        {formatValue ? formatValue(clampedValue) : clampedValue}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={disabled || atMax}
        aria-label={incrementAriaLabel}
        className={STEP_BUTTON_CLASSES}
      >
        <PlusIcon />
      </button>
    </div>
  );
}

IncrementerComponent.displayName = "Incrementer";

export default memo(IncrementerComponent);
