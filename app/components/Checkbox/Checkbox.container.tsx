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
    const isStandard = mode === "standard";

    // Generate unique ID for accessibility if not provided
    const { id: checkboxId, labelId } = useComponentId("checkbox", id);

    // Base box styles per Figma
    const baseBox = `
      flex
      items-center
      justify-center
      shrink-0
      w-[24px]
      h-[24px]
      rounded-[4px]
      transition-all
      duration-200
      ease-in-out
    `.trim().replace(/\s+/g, " ");

    // Get box styles based on state and checked status per Figma designs
    const getBoxStyles = (): string => {
      // Standard mode styles
      if (isStandard) {
        // Default state: tertiary border, with hover and focus states via CSS
        // Hover changes border to brand primary color
        // Focus removes border and shows shadow (double ring: 2px white inner, 4px dark outer)
        return `${baseBox} bg-[var(--color-surface-default-primary)] border border-solid border-[var(--color-border-default-tertiary,#464646)] hover:border-[var(--color-border-default-brand-primary,#fdfaa8)] focus:border-transparent focus:shadow-[0px_0px_0px_2px_var(--color-border-invert-primary,white),0px_0px_0px_4px_var(--color-border-default-primary,#141414)] focus:outline-none`;
      }

      // Inverse mode styles per Figma
      if (isInverse) {
        // Inverse: transparent background, white border
        // Hover changes border to brand primary color
        // Focus shows shadow (2px dark inner, 4px white outer) - note: reversed from standard
        return `${baseBox} bg-transparent border border-solid border-[var(--color-border-invert-primary,white)] hover:border-[var(--color-border-default-brand-primary,#fdfaa8)] focus:shadow-[0px_0px_0px_2px_var(--color-border-default-primary,#141414),0px_0px_0px_4px_var(--color-border-invert-primary,white)] focus:outline-none`;
      }

      return baseBox;
    };

    const combinedBoxStyles = getBoxStyles();

    // Checkmark color per Figma
    const checkGlyphColor = checked
      ? isStandard
        ? "var(--color-content-default-brand-primary, #fefcc9)" // Light yellow/cream for standard mode
        : "var(--color-content-inverse-primary, #000000)" // Black for inverse mode
      : "transparent";

    // Label color
    const labelColor = isInverse
      ? "var(--color-content-inverse-primary)"
      : "var(--color-content-default-primary)";

    const handleToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
      if (disabled) return;
      onChange?.({
        checked: !checked,
        value,
        event: e,
      });
    };

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
