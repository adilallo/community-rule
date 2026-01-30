import { forwardRef } from "react";
import type { TextAreaViewProps } from "./TextArea.types";

export const TextAreaView = forwardRef<HTMLTextAreaElement, TextAreaViewProps>(
  (
    {
      textareaId,
      labelId,
      label,
      placeholder,
      value,
      name,
      disabled,
      className: _className,
      rows,
      containerClasses,
      labelClasses,
      textareaClasses,
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
            style={{ borderRadius }}
            aria-disabled={disabled}
            aria-invalid={props["aria-invalid"]}
            {...props}
          />
        </div>
      </div>
    );
  },
);

TextAreaView.displayName = "TextAreaView";
