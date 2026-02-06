"use client";

import { memo, useCallback, useId, forwardRef } from "react";
import { ToggleView } from "./Toggle.view";
import type { ToggleProps } from "./Toggle.types";
import { normalizeState } from "../../../../lib/propNormalization";

const ToggleContainer = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      label,
      checked = false,
      onChange,
      onFocus,
      onBlur,
      disabled = false,
      state: stateProp = "default",
      showIcon = false,
      showText = false,
      icon = "I",
      text = "Toggle",
      className = "",
      ...props
    },
    ref,
  ) => {
    // Normalize props to handle both PascalCase (Figma) and lowercase (codebase)
    const state = normalizeState(stateProp);
    const toggleId = useId();
    const labelId = useId();

    // Size styles - single size with specific dimensions
    const sizeStyles = {
      toggle: "h-[var(--measures-sizing-032)] px-[16px] py-[8px] gap-[4px]",
      label: "text-[12px] leading-[16px]",
    };

    // State styles
    const getStateStyles = (): {
      toggle: string;
      label: string;
    } => {
      if (disabled) {
        return {
          toggle:
            "bg-[var(--color-surface-default-tertiary)] text-[var(--color-content-default-tertiary)] cursor-not-allowed",
          label: "text-[var(--color-content-default-secondary)]",
        };
      }

      if (checked) {
        switch (state) {
          case "hover":
            return {
              toggle:
                "bg-[var(--color-surface-default-secondary)] text-[var(--color-content-default-primary)]",
              label: "text-[var(--color-content-default-secondary)]",
            };
          case "focus":
            return {
              toggle:
                "bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] shadow-[0_0_5px_1px_#3281F8]",
              label: "text-[var(--color-content-default-secondary)]",
            };
          default:
            return {
              toggle:
                "bg-[var(--color-magenta-magenta100)] text-[var(--color-content-default-primary)] shadow-[0_0_0_1px_var(--color-border-default-brand-primary)]",
              label: "text-[var(--color-content-default-secondary)]",
            };
        }
      } else {
        switch (state) {
          case "hover":
            return {
              toggle:
                "bg-[var(--color-surface-default-secondary)] text-[var(--color-content-default-primary)]",
              label: "text-[var(--color-content-default-secondary)]",
            };
          case "focus":
            return {
              toggle:
                "bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] shadow-[0_0_5px_1px_#3281F8]",
              label: "text-[var(--color-content-default-secondary)]",
            };
          default:
            return {
              toggle:
                "bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)]",
              label: "text-[var(--color-content-default-secondary)]",
            };
        }
      }
    };

    const stateStyles = getStateStyles();
    const currentSize = sizeStyles;

    // Container classes
    const containerClasses = "flex flex-col gap-[4px]";

    const labelClasses = `${currentSize.label} font-inter font-medium`;

    const toggleClasses = `
      ${currentSize.toggle}
      ${stateStyles.toggle}
      rounded-full
      font-inter
      font-normal
      text-[12px]
      leading-[16px]
      cursor-pointer
      transition-all
      duration-200
      focus:outline-none
      focus-visible:shadow-[0_0_5px_1px_#3281F8]
      ${!checked ? "hover:!bg-[var(--color-surface-default-secondary)]" : ""}
      flex
      items-center
      justify-center
      gap-[4px]
      ${className}
    `
      .trim()
      .replace(/\s+/g, " ");

    const handleChange = useCallback(
      (
        e:
          | React.MouseEvent<HTMLButtonElement>
          | React.KeyboardEvent<HTMLButtonElement>,
      ) => {
        if (!disabled && onChange) {
          onChange(e);
        }
      },
      [disabled, onChange],
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLButtonElement>) => {
        if (!disabled && onFocus) {
          onFocus(e);
        }
      },
      [disabled, onFocus],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLButtonElement>) => {
        if (!disabled && onBlur) {
          onBlur(e);
        }
      },
      [disabled, onBlur],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          if (onChange) {
            onChange(e);
          }
        }
      },
      [disabled, onChange],
    );

    return (
      <ToggleView
        ref={ref}
        toggleId={toggleId}
        labelId={labelId}
        checked={checked}
        disabled={disabled}
        state={state}
        label={label}
        showIcon={showIcon}
        showText={showText}
        icon={icon}
        text={text}
        className={className}
        containerClasses={containerClasses}
        labelClasses={labelClasses}
        toggleClasses={toggleClasses}
        onClick={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    );
  },
);

ToggleContainer.displayName = "Toggle";

export default memo(ToggleContainer);
