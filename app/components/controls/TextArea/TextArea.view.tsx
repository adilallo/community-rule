import { forwardRef } from "react";
import { getAssetPath, ASSETS } from "../../../../lib/assetUtils";
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
      textHint = false,
      formHeader = true,
      showHelpIcon = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={containerClasses}>
        {formHeader && label && (
          <div className="flex flex-wrap gap-[var(--measures-spacing-200,4px_8px)] items-baseline pr-[var(--measures-spacing-100,4px)] relative shrink-0 w-full">
            <div className="flex gap-[var(--measures-spacing-050,2px)] items-center relative shrink-0">
              <label
                id={labelId}
                htmlFor={textareaId}
                className={`${labelClasses} font-inter font-medium text-[var(--color-content-default-secondary)]`}
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
        {textHint && (
          <div className="flex items-start relative shrink-0 w-full">
            <p className="flex-[1_0_0] font-inter font-normal leading-[16px] min-h-px min-w-px relative text-[color:var(--color-content-default-tertiary,#b4b4b4)] text-[length:var(--sizing-300,12px)]">
              Hint text here
            </p>
          </div>
        )}
      </div>
    );
  },
);

TextAreaView.displayName = "TextAreaView";
