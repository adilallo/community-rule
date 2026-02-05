"use client";

import { memo, forwardRef, useState, useRef } from "react";
import { useComponentId, useFormField } from "../../hooks";
import { TextInputView } from "./TextInput.view";
import type { TextInputProps } from "./TextInput.types";
import { normalizeInputState } from "../../../lib/propNormalization";

const TextInputContainer = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      state: externalStateProp = "default",
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
      showHelpIcon = true,
      ...props
    },
    ref,
  ) => {
    // Normalize props to handle both PascalCase (Figma) and lowercase (codebase)
    const externalState = normalizeInputState(externalStateProp);
    
    // Generate unique ID for accessibility if not provided
    const { id: inputId, labelId } = useComponentId("text-input", id);

    // Internal state management: track if focused and how (mouse vs keyboard)
    const [isFocused, setIsFocused] = useState(false);
    const [focusMethod, setFocusMethod] = useState<"mouse" | "keyboard" | null>(null);
    const wasMouseDownRef = useRef(false);

    // Determine if we should auto-manage focus (only when state is "default" or undefined)
    // If state is "active", "hover", or "focus", respect it and don't override
    const shouldAutoManageFocus = externalState === "default" || externalState === undefined;

    // Determine actual state:
    // - Active: when clicked (mouse focus)
    // - Focus: when tabbed (keyboard focus)
    // - Default: when not focused
    const actualState = shouldAutoManageFocus
      ? isFocused
        ? focusMethod === "mouse"
          ? "active"
          : "focus"
        : "default"
      : externalState;

    // Determine if input is filled (has value)
    const isFilled = Boolean(value && value.trim().length > 0);

    // Fixed size styles (medium only per Figma designs)
    const sizeStyles = {
      input: "h-[40px] px-[12px] py-[8px] text-[16px]",
      label: "text-[14px] leading-[20px] font-medium",
      container: "gap-[8px]",
      radius: "var(--measures-radius-200,8px)",
    };

    // State styles based on Figma designs
    const getStateStyles = (): {
      input: string;
      label: string;
      inputWrapper: string;
      focusRing: string;
    } => {
      if (disabled) {
        return {
          input:
            "bg-[var(--color-surface-default-secondary)] text-[var(--color-content-inverse-tertiary,#2d2d2d)] border border-solid border-[var(--color-border-default-primary)] cursor-not-allowed",
          label: "text-[var(--color-content-default-secondary)]",
          inputWrapper: "relative",
          focusRing: "",
        };
      }

      if (error) {
        const filledStyles = isFilled
          ? "font-medium leading-[20px]"
          : "font-normal leading-[24px]";
        return {
          input: `bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] border-2 border-solid border-[var(--color-border-default-utility-negative)] ${filledStyles}`,
          label: "text-[var(--color-content-default-secondary)]",
          inputWrapper: "relative",
          focusRing: "",
        };
      }

      switch (actualState) {
        case "active": {
          const filledStyles = isFilled
            ? "font-medium leading-[20px]"
            : "font-normal leading-[24px]";
          return {
            input: `bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] border-2 border-solid border-[var(--color-border-default-tertiary)] ${filledStyles}`,
            label: "text-[var(--color-content-default-secondary)]",
            inputWrapper: "relative",
            focusRing: "",
          };
        }
        case "focus": {
          const filledStyles = isFilled
            ? "font-medium leading-[20px]"
            : "font-normal leading-[24px]";
          return {
            input: `bg-[var(--color-surface-default-secondary)] text-[var(--color-content-default-primary)] border border-solid border-[var(--color-border-default-tertiary)] ${filledStyles}`,
            label: "text-[var(--color-content-default-secondary)]",
            inputWrapper: "relative",
            focusRing:
              "absolute border-2 border-solid border-[var(--color-border-inverse-primary)] inset-0 rounded-[var(--measures-radius-200,8px)] shadow-[0px_0px_0px_2px_var(--color-border-default-primary)] pointer-events-none",
          };
        }
        default: {
          const filledStyles = isFilled
            ? "font-medium leading-[20px]"
            : "font-normal leading-[24px]";
          // Default state uses primary border (matches Figma - border color same as background, so border is subtle)
          return {
            input: `bg-[var(--color-surface-default-secondary)] text-[var(--color-content-default-primary)] border border-solid border-[var(--color-border-default-primary)] ${filledStyles}`,
            label: "text-[var(--color-content-default-secondary)]",
            inputWrapper: "relative",
            focusRing: "",
          };
        }
      }
    };

    const stateStyles = getStateStyles();

    // Container classes (default label variant only)
    const containerClasses = `flex flex-col ${sizeStyles.container}`;

    const labelClasses = `${sizeStyles.label} font-inter`;

    // Base classes without border (border is added in state styles)
    const inputClasses = `
       w-full transition-all duration-200 ease-in-out
       focus:outline-none focus:ring-0
       placeholder:text-[var(--color-content-default-tertiary,#b4b4b4)]
       ${sizeStyles.input}
       ${stateStyles.input}
       ${className}
     `.trim();

    // Text color for filled text (placeholder color is handled above)
    const textColorClass = isFilled
      ? "text-[var(--color-content-default-primary)]"
      : "text-[var(--color-content-default-tertiary,#b4b4b4)]";

    // Form field handlers with disabled state handling
    const { handleChange, handleBlur } = useFormField<HTMLInputElement>(disabled, {
      onChange,
      onBlur: (e) => {
        if (shouldAutoManageFocus) {
          setIsFocused(false);
          setFocusMethod(null);
          wasMouseDownRef.current = false;
        }
        onBlur?.(e);
      },
    });

    // Handle mouse down to detect mouse clicks
    const handleMouseDown = () => {
      if (!disabled && shouldAutoManageFocus) {
        wasMouseDownRef.current = true;
      }
    };

    // Custom focus handler to detect mouse vs keyboard
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (disabled) return;
      
      // Detect if focus came from keyboard (Tab) or mouse (click)
      // If mouseDown was detected before focus, it's a mouse click (active)
      // Otherwise, it's keyboard navigation (focus)
      const method = wasMouseDownRef.current ? "mouse" : "keyboard";
      
      if (shouldAutoManageFocus) {
        setIsFocused(true);
        setFocusMethod(method);
        // Reset mouse down flag after focus is processed
        wasMouseDownRef.current = false;
      }
      
      onFocus?.(e);
    };

    return (
      <TextInputView
        ref={ref}
        inputId={inputId}
        labelId={labelId}
        state={actualState}
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
        inputClasses={`${inputClasses} ${textColorClass}`}
        borderRadius={sizeStyles.radius}
        handleChange={handleChange}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
        handleMouseDown={handleMouseDown}
        showHelpIcon={showHelpIcon}
        isFilled={isFilled}
        inputWrapperClasses={stateStyles.inputWrapper}
        focusRingClasses={stateStyles.focusRing}
        {...props}
      />
    );
  },
);

TextInputContainer.displayName = "TextInput";

export default memo(TextInputContainer);
