import React, { Children, type ReactNode } from "react";
import { getAssetPath, ASSETS } from "../../../../lib/assetUtils";
import SelectDropdown from "./SelectDropdown";
import SelectOption from "./SelectOption";
import type { SelectOptionData } from "./SelectInput.types";

export interface SelectInputViewProps {
  label?: string;
  placeholder: string;
  state: "default" | "active" | "hover" | "focus" | "selected";
  disabled: boolean;
  error: boolean;
  className: string;
  options?: SelectOptionData[];
  children?: ReactNode;
  // Computed props from container
  selectId: string;
  labelId: string;
  isOpen: boolean;
  selectedValue: string;
  displayText: string;
  isFilled: boolean;
  // Callbacks
  onButtonClick: () => void;
  onButtonKeyDown: (_e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onButtonMouseDown?: () => void;
  onButtonFocus?: () => void;
  onButtonBlur?: () => void;
  onOptionClick: (_value: string, _text: string) => void;
  // Refs
  selectRef: React.RefObject<HTMLButtonElement>;
  menuRef: React.RefObject<HTMLDivElement>;
  // Additional props
  ariaLabelledby?: string;
  ariaInvalid?: boolean;
}

export function SelectInputView({
  label,
  placeholder: _placeholder,
  state,
  disabled,
  error,
  options,
  children,
  selectId,
  labelId,
  isOpen,
  selectedValue,
  displayText,
  isFilled,
  onButtonClick,
  onButtonKeyDown,
  onButtonMouseDown,
  onButtonFocus,
  onButtonBlur,
  onOptionClick,
  selectRef,
  menuRef,
  ariaLabelledby,
  ariaInvalid,
}: SelectInputViewProps) {
  // Styles based on Figma design
  const containerClasses = "flex flex-col gap-[8px]";
  const labelClasses = "text-[14px] leading-[20px] font-medium font-inter text-[var(--color-content-default-primary)]";

  // Button styles per Figma
  const getButtonClasses = (): string => {
    const baseClasses = `
      w-full
      h-[40px]
      px-[12px]
      py-[8px]
      text-[16px]
      font-medium
      leading-[20px]
      rounded-[8px]
      border
      border-solid
      flex
      items-center
      justify-between
      gap-[12px]
      transition-all
      duration-200
      focus:outline-none
      focus:ring-0
      cursor-pointer
      appearance-none
      m-0
    `.trim().replace(/\s+/g, " ");

    if (disabled) {
      return `${baseClasses} bg-[var(--color-surface-default-secondary)] text-[var(--color-content-inverse-tertiary,#2d2d2d)] border-[var(--color-border-default-primary)] cursor-not-allowed opacity-40`;
    }

    if (error) {
      return `${baseClasses} bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] border-2 border-[var(--color-border-default-utility-negative)]`;
    }

    if (state === "focus") {
      // Focus state: secondary background, tertiary border, with focus ring
      return `${baseClasses} bg-[var(--color-surface-default-secondary)] text-[var(--color-content-default-primary)] border border-solid border-[var(--color-border-default-tertiary)]`;
    }

    if (state === "active" || isOpen) {
      // Active state per Figma: secondary background, tertiary border
      return `${baseClasses} bg-[var(--color-surface-default-secondary)] text-[var(--color-content-default-primary)] border-[var(--color-border-default-tertiary)]`;
    }

    // Default state per Figma: secondary background, primary border (subtle)
    return `${baseClasses} bg-[var(--color-surface-default-secondary)] text-[var(--color-content-default-primary)] border-[var(--color-border-default-primary)]`;
  };

  const buttonClasses = getButtonClasses();

  // Text color based on filled state
  const textColorClass = isFilled
    ? "text-[var(--color-content-default-primary)]"
    : "text-[var(--color-content-default-tertiary,#b4b4b4)]";

  // Chevron icon
  const chevronClasses = `w-5 h-5 text-[var(--color-content-default-primary)] transition-transform duration-200 ${
    isOpen ? "rotate-180" : ""
  }`;

  return (
    <div className={containerClasses}>
      {label && (
        <div className="flex flex-wrap gap-[var(--measures-spacing-200,4px_8px)] items-baseline pr-[var(--measures-spacing-100,4px)] relative shrink-0 w-full">
          <div className="flex gap-[var(--measures-spacing-050,2px)] items-center relative shrink-0">
            <label
              id={labelId}
              className={labelClasses}
            >
              {label}
            </label>
            <div className="relative shrink-0 size-[12px]">
              <img
                src={getAssetPath(ASSETS.ICON_HELP)}
                alt="Help"
                className="block max-w-none size-full"
              />
            </div>
          </div>
        </div>
      )}
      <div className="relative">
        <button
          ref={selectRef}
          id={selectId}
          disabled={disabled}
          className={buttonClasses}
          aria-labelledby={ariaLabelledby}
          aria-invalid={ariaInvalid}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onClick={onButtonClick}
          onKeyDown={onButtonKeyDown}
          onMouseDown={onButtonMouseDown}
          onFocus={onButtonFocus}
          onBlur={onButtonBlur}
        >
          <span className={`flex-1 text-left pr-[32px] ${textColorClass}`}>
            {displayText}
          </span>
          <div className="flex items-center justify-center shrink-0">
            <svg
              className={chevronClasses}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>
        {state === "focus" && (
          <div
            className="absolute border-2 border-solid border-[var(--color-border-inverse-primary)] inset-0 rounded-[8px] shadow-[0px_0px_0px_2px_var(--color-border-default-primary)] pointer-events-none z-10"
            aria-hidden="true"
          />
        )}

        {isOpen && (
          <div
            ref={menuRef}
            className="absolute top-full left-0 right-0 z-50 mt-1"
          >
            <SelectDropdown>
              {options && Array.isArray(options)
                ? options.map((option) => (
                    <SelectOption
                      key={option.value}
                      selected={option.value === selectedValue}
                      size="medium"
                      onClick={() => onOptionClick(option.value, option.label)}
                    >
                      {option.label}
                    </SelectOption>
                  ))
                : Children.map(children, (child) => {
                    if (
                      React.isValidElement(child) &&
                      child.type === "option"
                    ) {
                      const optionProps = child.props as {
                        value: string;
                        children: ReactNode;
                      };
                      return (
                        <SelectOption
                          key={optionProps.value}
                          selected={optionProps.value === selectedValue}
                          size="medium"
                          onClick={() =>
                            onOptionClick(
                              optionProps.value,
                              String(optionProps.children),
                            )
                          }
                        >
                          {optionProps.children}
                        </SelectOption>
                      );
                    }
                    return child;
                  })}
            </SelectDropdown>
          </div>
        )}
      </div>
    </div>
  );
}
