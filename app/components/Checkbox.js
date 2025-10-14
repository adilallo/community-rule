"use client";

import React, { memo, useId } from "react";

/**
 * Checkbox
 * A basic controlled checkbox with visual modes and interaction states.
 * This is a minimal first pass; visuals will be refined collaboratively.
 */
const Checkbox = memo(
  ({
    checked = false,
    mode = "standard", // "standard" | "inverse"
    state = "default", // "default" | "hover" | "focus"
    disabled = false,
    label,
    className = "",
    onChange,
    id,
    name,
    value,
    ariaLabel,
    ...props
  }) => {
    const isInverse = mode === "inverse";

    // Base tokens (rough placeholders leveraging existing CSS variables)
    const colorSurface = isInverse
      ? "var(--color-surface-inverse-primary)"
      : "var(--color-surface-default-primary)";
    const colorContent = isInverse
      ? "var(--color-content-inverse-primary)"
      : "var(--color-content-default-primary)";
    const colorBrand = isInverse
      ? "var(--color-content-inverse-brand-primary)"
      : "var(--color-content-default-brand-primary)";

    // Visual container depending on state
    const baseBox = `flex items-center justify-center shrink-0 w-[var(--measures-sizing-024)] h-[var(--measures-sizing-024)] rounded-[var(--measures-radius-medium)] transition-all duration-200 ease-in-out`;

    const stateStyles = {
      default: "",
      hover: "",
      focus: "",
    };

    // Background behavior:
    // - Standard: background does not change on check; only checkmark appears
    // - Inverse: transparent background, checkmark appears on check
    const backgroundWhenChecked = isInverse
      ? "var(--color-surface-default-transparent)"
      : "var(--color-surface-default-primary)";
    const checkGlyphColor = checked
      ? isInverse
        ? "var(--color-content-inverse-primary)"
        : "var(--color-border-default-brand-primary)"
      : "transparent";
    const labelColor = colorContent;

    const combinedBoxStyles = `${baseBox} ${stateStyles[state]}`;

    // Force visible outline for standard / default / unchecked
    // Outline classes instead of inline styles so hover can override
    const defaultOutlineClass = isInverse
      ? "outline outline-1 outline-[var(--color-border-inverse-primary)]"
      : "outline outline-1 outline-[var(--color-border-default-tertiary)]";

    // Apply brand outline only on actual :hover, and only when standard/unchecked
    const conditionalHoverOutlineClass =
      "hover:outline hover:outline-1 hover:outline-[var(--color-border-default-brand-primary)]";

    // Focus state for standard/unchecked with brand primary color and specific blur/spread
    const conditionalFocusClass =
      "focus:outline focus:outline-1 focus:outline-[var(--color-border-default-utility-info)] focus:shadow-[0_0_10px_1px_var(--color-surface-inverse-brand-primary)]";

    const handleToggle = (e) => {
      if (disabled) return;
      onChange?.({
        checked: !checked,
        value,
        event: e,
      });
    };

    // Generate unique ID for accessibility if not provided
    const generatedId = useId();
    const checkboxId = id || `checkbox-${generatedId}`;

    const accessibilityProps = {
      role: "checkbox",
      "aria-checked": checked ? "true" : "false",
      ...(disabled && { "aria-disabled": "true", tabIndex: -1 }),
      ...(!disabled && { tabIndex: 0 }),
      ...(ariaLabel && { "aria-label": ariaLabel }),
      ...(label && !ariaLabel && { "aria-labelledby": `${checkboxId}-label` }),
      id: checkboxId,
      ...props,
    };

    return (
      <label
        className={`inline-flex items-center gap-[8px] cursor-pointer select-none ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        } ${className}`}
        onMouseDown={(e) => e.preventDefault()}
      >
        <span
          {...accessibilityProps}
          onClick={handleToggle}
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
        >
          {/* Simple check glyph */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 12 12"
            aria-hidden="true"
            focusable="false"
          >
            <polyline
              points="2.5 6 5 8.5 10 3.5"
              stroke={checkGlyphColor}
              strokeWidth="1.25"
              fill="none"
              strokeLinecap="square"
              strokeLinejoin="miter"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </span>
        {label && (
          <span
            id={`${checkboxId}-label`}
            className="font-inter text-[14px] leading-[18px]"
            style={{ color: labelColor }}
          >
            {label}
          </span>
        )}
        {/* Hidden native input for form compatibility (optional for now) */}
        <input
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          onChange={() => {}}
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          readOnly
        />
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
