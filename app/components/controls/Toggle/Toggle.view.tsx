import { forwardRef } from "react";
import type { ToggleViewProps } from "./Toggle.types";

export const ToggleView = forwardRef<HTMLButtonElement, ToggleViewProps>(
  (
    {
      toggleId,
      labelId,
      checked,
      disabled,
      label,
      showIcon,
      showText,
      icon,
      text,
      containerClasses,
      labelClasses,
      toggleClasses,
      onClick,
      onKeyDown,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
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
            onClick={onClick}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            className={toggleClasses}
            {...rest}
          >
            {showIcon && <span className="italic">{icon}</span>}
            {showText && <span>{text}</span>}
          </button>
        </div>
      </div>
    );
  },
);

ToggleView.displayName = "ToggleView";
