"use client";

import { memo } from "react";
import { useComponentId } from "../../hooks";
import { CheckboxView } from "./Checkbox.view";
import type { CheckboxProps } from "./Checkbox.types";

const CheckboxContainer = memo<CheckboxProps>(
  ({
    checked = false,
    mode = "standard",
    state = "default",
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

    const handleToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
      if (disabled) return;
      onChange?.({
        checked: !checked,
        value,
        event: e,
      });
    };

    // Generate unique ID for accessibility if not provided
    const { id: checkboxId, labelId } = useComponentId("checkbox", id);

    const accessibilityProps = {
      role: "checkbox" as const,
      "aria-checked": checked,
      ...(disabled && { "aria-disabled": true, tabIndex: -1 }),
      ...(!disabled && { tabIndex: 0 }),
      ...(ariaLabel && { "aria-label": ariaLabel }),
      ...(label && !ariaLabel && { "aria-labelledby": labelId }),
      id: checkboxId,
      ...props,
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleToggle(e);
      }
    };

    return (
      <CheckboxView
        labelId={labelId}
        checked={checked}
        mode={mode}
        state={state}
        disabled={disabled}
        label={label}
        name={name}
        value={value}
        className={className}
        combinedBoxStyles={combinedBoxStyles}
        defaultOutlineClass={defaultOutlineClass}
        conditionalHoverOutlineClass={conditionalHoverOutlineClass}
        conditionalFocusClass={conditionalFocusClass}
        backgroundWhenChecked={backgroundWhenChecked}
        checkGlyphColor={checkGlyphColor}
        labelColor={labelColor}
        accessibilityProps={accessibilityProps}
        onToggle={handleToggle}
        onKeyDown={handleKeyDown}
      />
    );
  },
);

CheckboxContainer.displayName = "Checkbox";

export default CheckboxContainer;
