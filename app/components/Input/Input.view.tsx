import { forwardRef } from "react";
import type { InputViewProps } from "./Input.types";

export const InputView = forwardRef<HTMLInputElement, InputViewProps>(
  (
    {
      inputId,
      labelId,
      label,
      placeholder,
      value,
      name,
      type,
      disabled,
      className,
      containerClasses,
      labelClasses,
      inputClasses,
      borderRadius,
      handleChange,
      handleFocus,
      handleBlur,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={containerClasses}>
        {label && (
          <label
            id={labelId}
            htmlFor={inputId}
            className={`${labelClasses} font-inter font-medium text-[var(--color-content-default-secondary)]`}
          >
            {label}
          </label>
        )}
        <div className={disabled ? "opacity-40" : ""}>
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            className={inputClasses}
            style={{ borderRadius }}
            {...props}
          />
        </div>
      </div>
    );
  },
);

InputView.displayName = "InputView";
