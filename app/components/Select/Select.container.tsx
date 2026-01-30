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
  useEffect,
} from "react";
import { useClickOutside } from "../../hooks";
import { SelectView } from "./Select.view";
import type { SelectProps } from "./Select.types";

const SelectContainer = forwardRef<HTMLButtonElement, SelectProps>(
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

    // Sync internal state with external value prop
    useEffect(() => {
      if (value !== undefined && value !== selectedValue) {
        setSelectedValue(value);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

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
        case "small": {
          const smallHeight =
            labelVariant === "horizontal" ? "h-[30px]" : "h-[32px]";
          return `${baseStyles} ${smallHeight} pl-[12px] pr-[36px] py-[8px] text-[10px] leading-[14px]`;
        }
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

    const chevronClasses = `${
      size === "large" ? "w-5 h-5" : "w-4 h-4"
    } text-[var(--color-content-default-primary)] transition-transform duration-200 ${
      isOpen ? "rotate-180" : ""
    }`;

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
      <SelectView
        label={label}
        placeholder={placeholder}
        size={size}
        state={state}
        disabled={disabled}
        error={error}
        labelVariant={labelVariant}
        className={className}
        options={options}
        selectId={selectId}
        labelId={labelId}
        isOpen={isOpen}
        selectedValue={selectedValue}
        displayText={getDisplayText()}
        selectClasses={selectClasses}
        labelClasses={labelClasses}
        containerClasses={containerClasses}
        chevronClasses={chevronClasses}
        onButtonClick={handleSelectClick}
        onButtonKeyDown={handleKeyDown}
        onOptionClick={handleOptionSelect}
        selectRef={selectRef}
        menuRef={menuRef}
        ariaLabelledby={label ? labelId : undefined}
        ariaInvalid={error}
        {...props}
      />
    );
  },
);

SelectContainer.displayName = "Select";

export default memo(SelectContainer);
