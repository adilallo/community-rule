"use client";

import React, {
  forwardRef,
  useId,
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
} from "react";
import ContextMenu from "./ContextMenu";
import ContextMenuItem from "./ContextMenuItem";
import ContextMenuSection from "./ContextMenuSection";
import ContextMenuDivider from "./ContextMenuDivider";

const Select = forwardRef(
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
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${useId()}`;
    const labelId = `${selectId}-label`;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || "");
    const selectRef = useRef(null);
    const menuRef = useRef(null);

    // Handle click outside to close menu
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target) &&
          selectRef.current &&
          !selectRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen]);

    // Handle option selection
    const handleOptionSelect = useCallback(
      (optionValue, optionText) => {
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
      [onChange]
    );

    // Handle select button click
    const handleSelectClick = useCallback(() => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    }, [disabled, isOpen]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (e) => {
        if (disabled) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(!isOpen);
        } else if (e.key === "Escape") {
          setIsOpen(false);
        }
      },
      [disabled, isOpen]
    );

    const getSizeStyles = () => {
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

    const getLabelSizeStyles = () => {
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

    const getStateStyles = () => {
      if (disabled) {
        return {
          select:
            "bg-[var(--color-content-default-secondary)] border-[var(--color-border-default-tertiary)] cursor-not-allowed opacity-40",
          label: "text-[var(--color-content-default-primary)]",
        };
      }

      if (error) {
        return {
          select: "border-[var(--color-border-default-utility-negative)]",
          label: "text-[var(--color-content-default-primary)]",
        };
      }

      switch (state) {
        case "hover":
          return {
            select:
              "border-[var(--color-border-default-tertiary)] shadow-[0_0_0_2px_var(--color-border-default-tertiary)]",
            label: "text-[var(--color-content-default-primary)]",
          };
        case "focus":
          return {
            select:
              "border-[var(--color-border-default-utility-info)] shadow-[0_0_5px_3px_#3281F8]",
            label: "text-[var(--color-content-default-primary)]",
          };
        default:
          return {
            select: "border-[var(--color-border-default-tertiary)]",
            label: "text-[var(--color-content-default-primary)]",
          };
      }
    };

    const getBorderRadius = () => {
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
    const getDisplayText = () => {
      if (!selectedValue) return placeholder;

      // Handle options prop
      if (props.options && Array.isArray(props.options)) {
        const selectedOption = props.options.find(
          (option) => option.value === selectedValue
        );
        return selectedOption ? selectedOption.label : placeholder;
      }

      // Handle children (option elements)
      const selectedOption = React.Children.toArray(children).find(
        (child) => child.props.value === selectedValue
      );
      return selectedOption ? selectedOption.props.children : placeholder;
    };

    return (
      <div className={containerClasses}>
        {label && (
          <label id={labelId} htmlFor={selectId} className={labelClasses}>
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
              <ContextMenu>
                {props.options && Array.isArray(props.options)
                  ? props.options.map((option) => (
                      <ContextMenuItem
                        key={option.value}
                        selected={option.value === selectedValue}
                        size={size}
                        onClick={() =>
                          handleOptionSelect(option.value, option.label)
                        }
                      >
                        {option.label}
                      </ContextMenuItem>
                    ))
                  : React.Children.map(children, (child) => {
                      if (child.type === "option") {
                        return (
                          <ContextMenuItem
                            key={child.props.value}
                            selected={child.props.value === selectedValue}
                            size={size}
                            onClick={() =>
                              handleOptionSelect(
                                child.props.value,
                                child.props.children
                              )
                            }
                          >
                            {child.props.children}
                          </ContextMenuItem>
                        );
                      }
                      return child;
                    })}
              </ContextMenu>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";

export default memo(Select);
