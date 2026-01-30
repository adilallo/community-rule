import React, { Children, type ReactNode } from "react";
import SelectDropdown from "../SelectDropdown";
import SelectOption from "../SelectOption";
import type { SelectOptionData } from "./Select.types";

export interface SelectViewProps {
  label?: string;
  placeholder: string;
  size: "small" | "medium" | "large";
  state: "default" | "hover" | "focus";
  disabled: boolean;
  error: boolean;
  labelVariant: "default" | "horizontal";
  className: string;
  options?: SelectOptionData[];
  children?: ReactNode;
  // Computed props from container
  selectId: string;
  labelId: string;
  isOpen: boolean;
  selectedValue: string;
  displayText: string;
  selectClasses: string;
  labelClasses: string;
  containerClasses: string;
  chevronClasses: string;
  // Callbacks
  onButtonClick: () => void;
  onButtonKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onOptionClick: (value: string, text: string) => void;
  // Refs
  selectRef: React.RefObject<HTMLButtonElement>;
  menuRef: React.RefObject<HTMLDivElement>;
  // Additional props
  ariaLabelledby?: string;
  ariaInvalid?: boolean;
}

export function SelectView({
  label,
  placeholder,
  size,
  disabled,
  error,
  labelVariant,
  options,
  children,
  selectId,
  labelId,
  isOpen,
  selectedValue,
  displayText,
  selectClasses,
  labelClasses,
  containerClasses,
  chevronClasses,
  onButtonClick,
  onButtonKeyDown,
  onOptionClick,
  selectRef,
  menuRef,
  ariaLabelledby,
  ariaInvalid,
  ...props
}: SelectViewProps) {
  return (
    <div className={containerClasses}>
      {label && (
        <label
          id={labelId}
          htmlFor={selectId}
          className={`${labelClasses} text-[var(--color-content-default-secondary)]`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <button
          ref={selectRef}
          id={selectId}
          disabled={disabled}
          className={selectClasses}
          aria-labelledby={ariaLabelledby}
          aria-invalid={ariaInvalid}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onClick={onButtonClick}
          onKeyDown={onButtonKeyDown}
          {...props}
        >
          <span className="text-left">{displayText}</span>
        </button>
        <div className="absolute inset-y-0 right-0 flex items-center pr-[12px] pointer-events-none">
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
                      size={size}
                      onClick={() =>
                        onOptionClick(option.value, option.label)
                      }
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
                          size={size}
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
