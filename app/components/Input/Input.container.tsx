"use client";

import { memo, forwardRef } from "react";
import { useComponentId, useFormField } from "../../hooks";
import { InputView } from "./Input.view";
import type { InputProps } from "./Input.types";

const InputContainer = forwardRef<HTMLInputElement, InputProps>(
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
      type = "text",
      className = "",
      ...props
    },
    ref,
  ) => {
    // Generate unique ID for accessibility if not provided
    const { id: inputId, labelId } = useComponentId("input", id);

    // Size variants
    const sizeStyles: Record<
      string,
      {
        input: string;
        label: string;
        container: string;
        radius: string;
      }
    > = {
      small: {
        input:
          labelVariant === "horizontal"
            ? "h-[30px] px-[12px] py-[8px] text-[10px]"
            : "h-[32px] px-[12px] py-[8px] text-[10px]",
        label: "text-[12px] leading-[14px] font-medium",
        container: "gap-[4px]",
        radius: "var(--measures-radius-small)",
      },
      medium: {
        input: "h-[36px] px-[12px] py-[8px] text-[14px] leading-[20px]",
        label: "text-[14px] leading-[16px] font-medium",
        container: "gap-[8px]",
        radius: "var(--measures-radius-medium)",
      },
      large: {
        input: "h-[40px] px-[12px] py-[8px] text-[16px] leading-[24px]",
        label: "text-[16px] leading-[20px] font-medium",
        container: "gap-[12px]",
        radius: "var(--measures-radius-large)",
      },
    };

    // State styles
    const getStateStyles = (): {
      input: string;
      label: string;
    } => {
      if (disabled) {
        return {
          input:
            "bg-[var(--color-content-default-secondary)] text-[var(--color-content-default-primary)] border border-[var(--color-border-default-tertiary)] cursor-not-allowed",
          label: "text-[var(--color-content-default-secondary)]",
        };
      }

      if (error) {
        return {
          input:
            "bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] border border-[var(--color-border-default-utility-negative)]",
          label: "text-[var(--color-content-default-secondary)]",
        };
      }

      switch (state) {
        case "active":
          return {
            input:
              "bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] border border-[var(--color-border-default-tertiary)]",
            label: "text-[var(--color-content-default-secondary)]",
          };
        case "hover":
          return {
            input:
              "bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] border border-[var(--color-border-default-tertiary)] shadow-[0_0_0_2px_var(--color-border-default-tertiary)]",
            label: "text-[var(--color-content-default-secondary)]",
          };
        case "focus":
          return {
            input:
              "bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] border border-[var(--color-border-default-utility-info)] shadow-[0_0_5px_3px_#3281F8]",
            label: "text-[var(--color-content-default-secondary)]",
          };
        default:
          return {
            input:
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

    const inputClasses = `
       w-full border transition-all duration-200 ease-in-out
       focus:outline-none focus:ring-0
       ${currentSize.input}
       ${stateStyles.input}
       ${className}
     `.trim();

    // Form field handlers with disabled state handling
    const { handleChange, handleFocus, handleBlur } =
      useFormField<HTMLInputElement>(disabled, {
        onChange,
        onFocus,
        onBlur,
      });

    return (
      <InputView
        ref={ref}
        inputId={inputId}
        labelId={labelId}
        size={size}
        labelVariant={labelVariant}
        state={state}
        disabled={disabled}
        error={error}
        label={label}
        placeholder={placeholder}
        value={value}
        name={name}
        type={type}
        className={className}
        containerClasses={containerClasses}
        labelClasses={labelClasses}
        inputClasses={inputClasses}
        borderRadius={currentSize.radius}
        handleChange={handleChange}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
        {...props}
      />
    );
  },
);

InputContainer.displayName = "Input";

export default memo(InputContainer);
