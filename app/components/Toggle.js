import React, { memo, useCallback, useId, forwardRef } from "react";

const Toggle = forwardRef(
  (
    {
      label,
      checked = false,
      onChange,
      onFocus,
      onBlur,
      disabled = false,
      state = "default",
      showIcon = false,
      showText = false,
      icon = "I",
      text = "Toggle",
      className = "",
      ...props
    },
    ref
  ) => {
    const toggleId = useId();
    const labelId = useId();

    // Size styles - single size with specific dimensions
    const sizeStyles = {
      toggle: "h-[var(--measures-sizing-032)] px-[16px] py-[8px] gap-[4px]",
      label: "text-[12px] leading-[16px]",
    };

    // State styles
    const getStateStyles = () => {
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

    const handleKeyDown = useCallback(
      (e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          if (onChange) {
            onChange(e);
          }
        }
      },
      [disabled, onChange]
    );

    return (
      <div className={containerClasses}>
        {label && (
          <label
            id={labelId}
            htmlFor={toggleId}
            className={`${labelClasses} text-[var(--color-content-default-secondary)]`}
          >
            {label}
          </label>
        )}
        <div className={disabled ? "opacity-40" : ""}>
          <button
            ref={ref}
            id={toggleId}
            type="button"
            role="switch"
            aria-checked={checked}
            aria-labelledby={label ? labelId : undefined}
            disabled={disabled}
            onClick={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={toggleClasses}
            {...props}
          >
            {showIcon && <span className="italic">{icon}</span>}
            {showText && <span>{text}</span>}
          </button>
        </div>
      </div>
    );
  }
);

Toggle.displayName = "Toggle";

export default memo(Toggle);
