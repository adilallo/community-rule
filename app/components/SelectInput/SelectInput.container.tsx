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
import { SelectInputView } from "./SelectInput.view";
import type { SelectInputProps } from "./SelectInput.types";

const SelectInputContainer = forwardRef<HTMLButtonElement, SelectInputProps>(
  (
    {
      id,
      label,
      state: externalState = "default",
      disabled = false,
      error = false,
      placeholder = "Choose an option",
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
    const selectId = id || `select-input-${generatedId}`;
    const labelId = `${selectId}-label`;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || "");
    const selectRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Internal state management: track if focused and how (mouse vs keyboard)
    const [isFocused, setIsFocused] = useState(false);
    const [focusMethod, setFocusMethod] = useState<"mouse" | "keyboard" | null>(null);
    const wasMouseDownRef = useRef(false);

    // Determine if we should auto-manage focus (only when state is "default" or undefined)
    const shouldAutoManageFocus = externalState === "default" || externalState === undefined;

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
        if (selectRef.current) {
          selectRef.current.focus();
        }
      },
      [onChange],
    );

    // Handle mouse down to detect mouse clicks
    const handleMouseDown = useCallback(() => {
      if (!disabled && shouldAutoManageFocus) {
        wasMouseDownRef.current = true;
      }
    }, [disabled, shouldAutoManageFocus]);

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

    // Handle focus to detect mouse vs keyboard
    const handleFocus = useCallback(() => {
      if (disabled) return;

      const method = wasMouseDownRef.current ? "mouse" : "keyboard";

      if (shouldAutoManageFocus) {
        setIsFocused(true);
        setFocusMethod(method);
        wasMouseDownRef.current = false;
      }
    }, [disabled, shouldAutoManageFocus]);

    // Handle blur
    const handleBlur = useCallback(() => {
      if (shouldAutoManageFocus) {
        setIsFocused(false);
        setFocusMethod(null);
        wasMouseDownRef.current = false;
      }
    }, [shouldAutoManageFocus]);

    // Determine actual state:
    // - Active: when clicked (mouse focus) or when dropdown is open
    // - Focus: when tabbed (keyboard focus)
    // - Default: when not focused
    const actualState = shouldAutoManageFocus
      ? isOpen || isFocused
        ? focusMethod === "mouse" || isOpen
          ? "active"
          : "focus"
        : "default"
      : externalState;

    // Determine if select is filled (has selected value)
    const isFilled = Boolean(selectedValue && selectedValue.trim().length > 0);

    // Get display text for selected value
    const getDisplayText = (): string => {
      if (!selectedValue) return placeholder;

      if (options && Array.isArray(options)) {
        const selectedOption = options.find(
          (option) => option.value === selectedValue,
        );
        return selectedOption ? selectedOption.label : placeholder;
      }

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
      <SelectInputView
        label={label}
        placeholder={placeholder}
        state={actualState}
        disabled={disabled}
        error={error}
        className={className}
        options={options}
        selectId={selectId}
        labelId={labelId}
        isOpen={isOpen}
        selectedValue={selectedValue}
        displayText={getDisplayText()}
        isFilled={isFilled}
        onButtonClick={handleSelectClick}
        onButtonKeyDown={handleKeyDown}
        onButtonMouseDown={handleMouseDown}
        onButtonFocus={handleFocus}
        onButtonBlur={handleBlur}
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

SelectInputContainer.displayName = "SelectInput";

export default memo(SelectInputContainer);
