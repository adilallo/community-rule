"use client";

import { memo, useCallback, useId } from "react";
import { RadioButtonView } from "./RadioButton.view";
import type { RadioButtonProps } from "./RadioButton.types";
import { normalizeMode, normalizeState } from "../../../lib/propNormalization";

const RadioButtonContainer = ({
  checked = false,
  mode: modeProp = "standard",
  state: stateProp = "default", // This state prop is now only for static display in Storybook/Preview
  indicator: _indicator = true, // From Figma: whether to show the indicator dot (currently not used in view)
  disabled = false,
  label,
  onChange,
  id,
  name,
  value,
  ariaLabel,
  className = "",
}: RadioButtonProps) => {
  // Normalize props to handle both PascalCase (Figma) and lowercase (codebase)
  const mode = normalizeMode(modeProp);
  const state = normalizeState(stateProp);
  
  // If state is "selected", it means checked in Figma terms
  const normalizedState = state === "selected" || checked ? "selected" : state;
  
  const isInverse = mode === "inverse";
  const isStandard = mode === "standard";

  // Base box styles per Figma - 24px size, circular
  const baseBox = `
    flex
    items-center
    justify-center
    shrink-0
    w-[24px]
    h-[24px]
    rounded-full
    transition-all
    duration-200
    ease-in-out
    p-[4px]
  `.trim().replace(/\s+/g, " ");

  // Get box styles based on mode and checked status per Figma designs
  const getBoxStyles = (): string => {
    // Standard mode styles
    if (isStandard) {
      // Default state: tertiary border (or brand primary when checked), with hover and focus states via CSS
      // Hover changes border to brand primary color
      // Focus shows shadow (double ring: 2px white inner, 4px dark outer)
      // When checked, border is brand primary (but changes to invert tertiary on focus)
      const defaultBorder = checked
        ? "border-[var(--color-border-default-brand-primary,#fdfaa8)]"
        : "border-[var(--color-border-default-tertiary,#464646)]";
      
      // When focused and checked, border should be invert tertiary (#2d2d2d) per Figma
      const focusBorder = checked
        ? "focus:border-[var(--color-content-invert-tertiary,#2d2d2d)]"
        : "focus:border-[var(--color-border-default-tertiary,#464646)]";
      
      return `${baseBox} bg-[var(--color-surface-default-primary)] border border-solid ${defaultBorder} hover:border-[var(--color-border-default-brand-primary,#fdfaa8)] ${focusBorder} focus:shadow-[0px_0px_0px_2px_var(--color-border-invert-primary,white),0px_0px_0px_4px_var(--color-border-default-primary,#141414)] focus:outline-none`;
    }

    // Inverse mode styles
    if (isInverse) {
      // Default state: white border (or brand primary when checked), transparent background
      // Hover changes border to inverse brand primary color (#6c6701) for both selected and unselected
      // Focus shows shadow (double ring: 2px dark inner, 4px white outer)
      // When checked, border is brand primary (but changes to white on focus)
      const defaultBorder = checked
        ? "border-[var(--color-border-default-brand-primary,#fdfaa8)]"
        : "border-[var(--color-border-invert-primary,white)]";
      
      // Hover border: inverse brand primary for both selected and unselected per Figma
      const hoverBorder = "hover:border-[var(--color-border-invert-brand-primary,#6c6701)]";
      
      // Focus border: when focused and checked, border should be white per Figma
      const focusBorder = checked
        ? "focus:border-[var(--color-border-invert-primary,white)]"
        : "focus:border-[var(--color-border-invert-primary,white)]";
      
      return `${baseBox} bg-transparent border border-solid ${defaultBorder} ${hoverBorder} ${focusBorder} focus:shadow-[0px_0px_0px_2px_var(--color-border-default-primary,#141414),0px_0px_0px_4px_var(--color-border-invert-primary,white)] focus:outline-none`;
    }

    return baseBox;
  };

  const combinedBoxStyles = getBoxStyles();

  // Label color
  const labelColor = isInverse
    ? "var(--color-content-inverse-primary)"
    : "var(--color-content-default-primary)";

  // Generate unique ID for accessibility if not provided
  const generatedId = useId();
  const radioId = id || `radio-${generatedId}`;

  const handleToggle = useCallback(
    (_e: React.MouseEvent | React.KeyboardEvent) => {
      if (!disabled && onChange) {
        // Always call onChange when clicked, even if already checked
        // The parent (RadioGroup) will handle the logic
        onChange({ checked: true, value });
      }
    },
    [disabled, onChange, value],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle(e);
    }
  };

  return (
    <RadioButtonView
      radioId={radioId}
      checked={checked}
      mode={mode}
      state={normalizedState} // Normalized state (handles "selected" from Figma)
      disabled={disabled}
      label={label}
      name={name}
      value={value}
      ariaLabel={ariaLabel}
      className={className}
      combinedBoxStyles={combinedBoxStyles}
      labelColor={labelColor}
      onToggle={handleToggle}
      onKeyDown={handleKeyDown}
    />
  );
};

RadioButtonContainer.displayName = "RadioButton";

export default memo(RadioButtonContainer);
