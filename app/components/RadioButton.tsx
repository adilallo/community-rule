"use client";

import React, { memo, useCallback, useId } from "react";

interface RadioButtonProps {
  checked?: boolean;
  mode?: "standard" | "inverse";
  state?: "default" | "hover" | "focus";
  disabled?: boolean;
  label?: string;
  onChange?: (data: { checked: boolean; value?: string }) => void;
  id?: string;
  name?: string;
  value?: string;
  ariaLabel?: string;
  className?: string;
}

const RadioButton = ({
  checked = false,
  mode = "standard",
  state = "default",
  disabled = false,
  label,
  onChange,
  id,
  name,
  value,
  ariaLabel,
  className = "",
  ...props
}: RadioButtonProps) => {
  const isInverse = mode === "inverse";

  // Base tokens (using same design tokens as Checkbox)
  const colorContent = isInverse
    ? "var(--color-content-inverse-primary)"
    : "var(--color-content-default-primary)";

  // Visual container depending on state
  const baseBox = `flex items-center justify-center shrink-0 w-[var(--measures-sizing-024)] h-[var(--measures-sizing-024)] rounded-[var(--measures-radius-medium)] transition-all duration-200 ease-in-out`;

  const stateStyles: Record<string, string> = {
    default: "",
    hover: "",
    focus: "",
  };

  // Background behavior:
  // - Standard: background does not change on check; only dot appears
  // - Inverse: transparent background, dot appears on check
  const backgroundWhenChecked = isInverse
    ? "var(--color-surface-default-transparent)"
    : "var(--color-surface-default-primary)";

  // Dot color for selected state
  const dotColor = checked
    ? isInverse
      ? "var(--color-content-inverse-primary)"
      : "var(--color-border-default-brand-primary)"
    : "transparent";
  const labelColor = colorContent;

  const combinedBoxStyles = `${baseBox} ${stateStyles[state]}`;

  // Force visible outline for standard / default / unchecked
  const defaultOutlineClass = isInverse
    ? "outline outline-1 outline-[var(--color-border-inverse-primary)]"
    : "outline outline-1 outline-[var(--color-border-default-tertiary)]";

  // Apply brand outline only on actual :hover
  // Standard mode uses default brand primary, inverse mode uses inverse brand primary
  const conditionalHoverOutlineClass = isInverse
    ? "hover:outline hover:outline-1 hover:outline-[var(--color-border-inverse-brand-primary)]"
    : "hover:outline hover:outline-1 hover:outline-[var(--color-border-default-brand-primary)]";

  // Focus state for standard/unchecked with brand primary color and specific blur/spread
  const conditionalFocusClass =
    "focus:outline focus:outline-1 focus:outline-[var(--color-border-default-utility-info)] focus:shadow-[0_0_10px_1px_var(--color-surface-inverse-brand-primary)]";

  // Generate unique ID for accessibility if not provided
  const generatedId = useId();
  const radioId = id || `radio-${generatedId}`;

  const handleToggle = useCallback(
    (_e: React.MouseEvent | React.KeyboardEvent) => {
      if (!disabled && onChange && !checked) {
        onChange({ checked: true, value });
      }
    },
    [disabled, onChange, checked, value],
  );

  return (
    <label
      className={`inline-flex items-center gap-[8px] cursor-pointer select-none ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      } ${className}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={handleToggle}
    >
      <span
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            handleToggle(e);
          }
        }}
        className={`${combinedBoxStyles} ${defaultOutlineClass} ${conditionalHoverOutlineClass} ${conditionalFocusClass} p-[var(--measures-spacing-004)]`}
        style={{
          backgroundColor: backgroundWhenChecked,
        }}
        tabIndex={0}
        role="radio"
        aria-checked={checked}
        {...(disabled && { "aria-disabled": true })}
        {...(ariaLabel && { "aria-label": ariaLabel })}
        {...(label && !ariaLabel && { "aria-labelledby": `${radioId}-label` })}
        id={radioId}
      >
        {/* Radio dot */}
        <div
          className="w-[16px] h-[16px] rounded-full transition-all duration-200"
          style={{
            backgroundColor: dotColor,
          }}
        />
      </span>
      {label && (
        <span
          id={`${radioId}-label`}
          className="font-inter text-[14px] leading-[18px]"
          style={{ color: labelColor }}
        >
          {label}
        </span>
      )}
      {/* Hidden input for form submission */}
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => {}}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        {...props}
      />
    </label>
  );
};

RadioButton.displayName = "RadioButton";

export default memo(RadioButton);
