"use client";

import { memo, useCallback } from "react";
import IncrementerView from "./Incrementer.view";
import type { IncrementerProps } from "./Incrementer.types";

/**
 * Figma: "Control / Incrementer" (`17857:30943`). A compact `[ - value + ]`
 * row used for numeric step inputs (e.g. a percentage setting).
 *
 * For a labelled variant that matches "Control / Incrementer Block"
 * (`19883:13283`), compose with `IncrementerBlock` instead.
 */
const IncrementerContainer = ({
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
}: IncrementerProps) => {
  const clampedValue = Math.min(Math.max(value, min), max);
  const atMin = clampedValue <= min;
  const atMax = clampedValue >= max;

  const handleDecrement = useCallback(() => {
    if (disabled || atMin) return;
    onChange(Math.max(min, clampedValue - step));
  }, [disabled, atMin, onChange, min, clampedValue, step]);

  const handleIncrement = useCallback(() => {
    if (disabled || atMax) return;
    onChange(Math.min(max, clampedValue + step));
  }, [disabled, atMax, onChange, max, clampedValue, step]);

  return (
    <IncrementerView
      displayValue={formatValue ? formatValue(clampedValue) : clampedValue}
      disabled={disabled}
      atMin={atMin}
      atMax={atMax}
      onDecrement={handleDecrement}
      onIncrement={handleIncrement}
      decrementAriaLabel={decrementAriaLabel}
      incrementAriaLabel={incrementAriaLabel}
      className={className}
    />
  );
};

IncrementerContainer.displayName = "Incrementer";

export default memo(IncrementerContainer);
