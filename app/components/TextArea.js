"use client";

import React, { memo, useCallback, forwardRef, useId } from "react";

const TextArea = forwardRef(
  (
    {
      size = "medium",
      labelVariant = "default",
      state = "default",
      disabled = false,
      error = false,
      label,
      placeholder,
      value,
      onChange,
      onFocus,
      onBlur,
      id,
      name,
      className = "",
      rows,
      ...props
    },
    ref
  ) => {
    // Generate unique ID for accessibility if not provided
    const generatedId = useId();
    const textareaId = id || `textarea-${generatedId}`;

    // Size variants with specific heights and radius for TextArea
    const sizeStyles = {
      small: {
        textarea:
          labelVariant === "horizontal"
            ? "h-[60px] px-[12px] py-[8px] text-[10px]"
            : "h-[60px] px-[12px] py-[8px] text-[10px]",
        label: "text-[12px] leading-[14px] font-medium",
        container: "gap-[4px]",
        radius: "var(--measures-radius-xsmall)",
      },
      medium: {
        textarea:
          labelVariant === "horizontal"
            ? "h-[110px] px-[12px] py-[8px] text-[14px] leading-[20px]"
            : "h-[100px] px-[12px] py-[8px] text-[14px] leading-[20px]",
        label: "text-[14px] leading-[16px] font-medium",
        container: "gap-[8px]",
        radius: "var(--measures-radius-xsmall)",
      },
      large: {
        textarea: "h-[150px] px-[12px] py-[8px] text-[16px] leading-[24px]",
        label: "text-[16px] leading-[20px] font-medium",
        container: "gap-[12px]",
        radius: "var(--measures-radius-small)",
      },
    };

    // State styles
    const getStateStyles = () => {
      if (disabled) {
        return {
          textarea:
            "bg-[var(--color-content-default-secondary)] text-[var(--color-content-default-primary)] border border-[var(--color-border-default-tertiary)] cursor-not-allowed",
          label: "text-[var(--color-content-default-secondary)]",
        };
      }

      if (error) {
        return {
          textarea:
            "bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] border border-[var(--color-border-default-utility-negative)]",
          label: "text-[var(--color-content-default-secondary)]",
        };
      }

      switch (state) {
        case "active":
          return {
            textarea:
              "bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] border border-[var(--color-border-default-tertiary)]",
            label: "text-[var(--color-content-default-secondary)]",
          };
        case "hover":
          return {
            textarea:
              "bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] border border-[var(--color-border-default-tertiary)] shadow-[0_0_0_2px_var(--color-border-default-tertiary)]",
            label: "text-[var(--color-content-default-secondary)]",
          };
        case "focus":
          return {
            textarea:
              "bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] border border-[var(--color-border-default-utility-info)] shadow-[0_0_5px_3px_#3281F8]",
            label: "text-[var(--color-content-default-secondary)]",
          };
        default:
          return {
            textarea:
              "bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] border border-[var(--color-border-default-tertiary)] hover:shadow-[0_0_0_2px_var(--color-border-default-tertiary)]",
            label: "text-[var(--color-content-default-secondary)]",
          };
      }
    };

    const stateStyles = getStateStyles();
    const currentSize = sizeStyles[size];

    // Container classes based on label variant
    const containerClasses =
      labelVariant === "horizontal"
        ? `flex items-center gap-[12px]`
        : `flex flex-col ${currentSize.container}`;

    const labelClasses =
      labelVariant === "horizontal"
        ? `${currentSize.label} font-inter min-w-fit`
        : `${currentSize.label} font-inter`;

    const textareaClasses = `
       w-full border transition-all duration-200 ease-in-out
       focus:outline-none focus:ring-0 resize-none
       ${currentSize.textarea}
       ${stateStyles.textarea}
       ${className}
     `.trim();

    const handleChange = useCallback(
      (e) => {
        if (!disabled && onChange) {
          onChange(e);
        }
      },
      [disabled, onChange]
    );

    const handleFocus = useCallback(
      (e) => {
        if (!disabled && onFocus) {
          onFocus(e);
        }
      },
      [disabled, onFocus]
    );

    const handleBlur = useCallback(
      (e) => {
        if (!disabled && onBlur) {
          onBlur(e);
        }
      },
      [disabled, onBlur]
    );

    return (
      <div className={containerClasses}>
        {label && (
          <label
            htmlFor={textareaId}
            className={`${labelClasses} font-inter font-medium text-[var(--color-content-default-secondary)]`}
          >
            {label}
          </label>
        )}
        <div className={disabled ? "opacity-40" : ""}>
          <textarea
            ref={ref}
            id={textareaId}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            rows={rows}
            className={textareaClasses}
            style={{ borderRadius: currentSize.radius }}
            aria-disabled={disabled}
            aria-invalid={error}
            {...props}
          />
        </div>
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default memo(TextArea);
