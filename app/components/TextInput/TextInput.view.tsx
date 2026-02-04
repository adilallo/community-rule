import { forwardRef } from "react";
import { getAssetPath, ASSETS } from "../../../lib/assetUtils";
import type { TextInputViewProps } from "./TextInput.types";

export const TextInputView = forwardRef<HTMLInputElement, TextInputViewProps>(
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
      error: _error,
      className: _className,
      containerClasses,
      labelClasses,
      inputClasses,
      borderRadius,
      handleChange,
      handleFocus,
      handleBlur,
      handleMouseDown,
      showHelpIcon = true,
      inputWrapperClasses = "relative",
      focusRingClasses = "",
    },
    ref,
  ) => {
    return (
      <div className={containerClasses}>
        {label && (
          <div className="flex flex-wrap gap-[var(--measures-spacing-200,4px_8px)] items-baseline pr-[var(--measures-spacing-100,4px)] relative shrink-0 w-full">
            <div className="flex gap-[var(--measures-spacing-050,2px)] items-center relative shrink-0">
              <label
                id={labelId}
                htmlFor={inputId}
                className={`${labelClasses} font-inter font-medium text-[var(--color-content-default-primary)]`}
              >
                {label}
              </label>
              {showHelpIcon && (
                <div className="relative shrink-0 size-[12px]">
                  <img
                    src={getAssetPath(ASSETS.ICON_HELP)}
                    alt="Help"
                    className="block max-w-none size-full"
                  />
                </div>
              )}
            </div>
          </div>
        )}
        <div className={inputWrapperClasses}>
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
              onMouseDown={handleMouseDown}
              disabled={disabled}
              className={inputClasses}
              style={{ borderRadius }}
            />
          </div>
          {focusRingClasses && (
            <div className={focusRingClasses} aria-hidden="true" />
          )}
        </div>
      </div>
    );
  },
);

TextInputView.displayName = "TextInputView";
