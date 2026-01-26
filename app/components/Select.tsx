"use client";

import React, {
  Children,
  type ReactElement,
  type ReactNode,
  forwardRef,
  useId,
  useState,
  useRef,
  useCallback,
  memo,
  useImperativeHandle,
} from "react";
import { useClickOutside } from "../hooks";
import SelectDropdown from "./SelectDropdown";
import SelectOption from "./SelectOption";

interface SelectOptionData {
  value: string;
  label: string;
}

interface SelectProps {
  id?: string;
  label?: string;
  labelVariant?: "default" | "horizontal";
  size?: "small" | "medium" | "large";
  state?: "default" | "hover" | "focus";
  disabled?: boolean;
  error?: boolean;
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
  value?: string;
  onChange?: (data: { target: { value: string; text: string } }) => void;
  options?: SelectOptionData[];
}

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      id,
      label,
      labelVariant = "default",
      size = "medium",
      state = "default",
      disabled = false,
      error = false,
      placeholder = "Select an option",
      className = "",
      children,
      value,
      onChange,
      options,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id || `select-${generatedId}`;
    const labelId = `${selectId}-label`;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || "");
    const selectRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(
      ref,
      () => selectRef.current as HTMLButtonElement | null,
    );

    // Handle click outside to close menu
    useClickOutside([menuRef, selectRef], () => setIsOpen(false), isOpen);

    // Handle option selection
    const handleOptionSelect = useCallback(
      (optionValue: string, optionText: string) => {
        setSelectedValue(optionValue);
        setIsOpen(false);
        if (onChange) {
          onChange({ target: { value: optionValue, text: optionText } });
        }
        // Return focus to the select button for accessibility
        if (selectRef.current) {
          selectRef.current.focus();
        }
      },
      [onChange],
    );

    // Handle select button click
    const handleSelectClick = useCallback(() => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    }, [disabled, isOpen]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(!isOpen);
        } else if (e.key === "Escape") {
          setIsOpen(false);
        }
      },
      [disabled, isOpen],
    );

    const getSizeStyles = (): string => {
      const baseStyles = "w-full";

      switch (size) {
        case "small":
          const smallHeight =
            labelVariant === "horizontal" ? "h-[30px]" : "h-[32px]";
          return `${baseStyles} ${smallHeight} pl-[12px] pr-[36px] py-[8px] text-[10px] leading-[14px]`;
        case "medium":
          return `${baseStyles} h-[36px] pl-[12px] pr-[36px] py-[8px] text-[14px] leading-[20px]`;
        case "large":
          return `${baseStyles} h-[40px] pl-[12px] pr-[40px] py-[8px] text-[16px] leading-[24px]`;
        default:
          return `${baseStyles} h-[36px] pl-[12px] pr-[36px] py-[8px] text-[14px] leading-[20px]`;
      }
    };

    const getLabelSizeStyles = (): string => {
      switch (size) {
        case "small":
          return "text-[12px] leading-[14px]";
        case "medium":
          return "text-[14px] leading-[16px]";
        case "large":
          return "text-[16px] leading-[20px]";
        default:
          return "text-[14px] leading-[16px]";
      }
    };

    const getStateStyles = (): {
      select: string;
      label: string;
    } => {
      if (disabled) {
        return {
          select:
            "bg-[var(--color-content-default-secondary)] border-[var(--color-border-default-tertiary)] cursor-not-allowed opacity-40",
          label: "text-[var(--color-content-default-secondary)]",
        };
      }

      if (error) {
        return {
          select: "border-[var(--color-border-default-utility-negative)]",
          label: "text-[var(--color-content-default-secondary)]",
        };
      }

      switch (state) {
        case "hover":
          return {
            select:
              "border-[var(--color-border-default-tertiary)] shadow-[0_0_0_2px_var(--color-border-default-tertiary)]",
            label: "text-[var(--color-content-default-secondary)]",
          };
        case "focus":
          return {
            select:
              "border-[var(--color-border-default-utility-info)] shadow-[0_0_5px_3px_#3281F8]",
            label: "text-[var(--color-content-default-secondary)]",
          };
        default:
          return {
            select: "border-[var(--color-border-default-tertiary)]",
            label: "text-[var(--color-content-default-secondary)]",
          };
      }
    };

    const getBorderRadius = (): string => {
      switch (size) {
        case "small":
          return "rounded-[var(--measures-radius-small)]";
        case "medium":
          return "rounded-[var(--measures-radius-medium)]";
        case "large":
          return "rounded-[var(--measures-radius-large)]";
        default:
          return "rounded-[var(--measures-radius-medium)]";
      }
    };

    const sizeStyles = getSizeStyles();
    const labelSizeStyles = getLabelSizeStyles();
    const stateStyles = getStateStyles();
    const borderRadius = getBorderRadius();

    const selectClasses = `
    ${sizeStyles}
    ${stateStyles.select}
    ${borderRadius}
    bg-[var(--color-background-default-primary)]
    text-[var(--color-content-default-primary)]
    border
    font-inter
    font-normal
    appearance-none
    cursor-pointer
    transition-all
    duration-200
    focus:outline-none
    focus-visible:border focus-visible:border-[var(--color-border-default-utility-info)] focus-visible:shadow-[0_0_5px_3px_#3281F8]
    text-left
    justify-start
    hover:shadow-[0_0_0_2px_var(--color-border-default-tertiary)]
    ${className}
  `
      .trim()
      .replace(/\s+/g, " ");

    const labelClasses = `
    ${labelSizeStyles}
    ${stateStyles.label}
    font-inter
    font-medium
    block
    mb-[4px]
  `
      .trim()
      .replace(/\s+/g, " ");

    const containerClasses =
      labelVariant === "horizontal"
        ? "flex items-center gap-[12px]"
        : "flex flex-col";

    // Get display text for selected value
    const getDisplayText = (): string => {
      if (!selectedValue) return placeholder;

      // Handle options prop
      if (options && Array.isArray(options)) {
        const selectedOption = options.find(
          (option) => option.value === selectedValue,
        );
        return selectedOption ? selectedOption.label : placeholder;
      }

      // Handle children (option elements)
      const selectedOption = Children.toArray(children).find(
        (
          child,
        ): child is ReactElement<{
          value: string;
          children: ReactNode;
        }> => {
          if (!React.isValidElement(child)) return false;
          const props = child.props as {
            value?: string;
            children?: ReactNode;
          };
          return props.value === selectedValue;
        },
      );
      return selectedOption
        ? String(selectedOption.props.children)
        : placeholder;
    };

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
            aria-labelledby={label ? labelId : undefined}
            aria-invalid={error}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            onClick={handleSelectClick}
            onKeyDown={handleKeyDown}
            {...props}
          >
            <span className="text-left">{getDisplayText()}</span>
          </button>
          <div className="absolute inset-y-0 right-0 flex items-center pr-[12px] pointer-events-none">
            <svg
              className={`${
                size === "large" ? "w-5 h-5" : "w-4 h-4"
              } text-[var(--color-content-default-primary)] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
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
                          handleOptionSelect(option.value, option.label)
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
                              handleOptionSelect(
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
  },
);

Select.displayName = "Select";

export default memo(Select);
