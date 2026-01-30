"use client";

import { memo, useCallback, useId, forwardRef } from "react";
import { ToggleGroupView } from "./ToggleGroup.view";
import type { ToggleGroupProps } from "./ToggleGroup.types";

const ToggleGroupContainer = memo(
  forwardRef<HTMLButtonElement, ToggleGroupProps>((props, _ref) => {
    const {
      children,
      className = "",
      position = "left",
      state = "default",
      showText = true,
      ariaLabel,
      onChange,
      onFocus,
      onBlur,
      ...rest
    } = props;

    const groupId = useId();

    // Position-based styling for border radius
    const getPositionStyles = useCallback((pos: string): string => {
      switch (pos) {
        case "left":
          return "rounded-l-[var(--measures-radius-medium)] rounded-r-none";
        case "middle":
          return "rounded-none";
        case "right":
          return "rounded-r-[var(--measures-radius-medium)] rounded-l-none";
        default:
          return "rounded-[var(--measures-radius-medium)]";
      }
    }, []);

    // State-based styling
    const getStateStyles = useCallback((state: string): string => {
      switch (state) {
        case "hover":
          return "bg-[var(--color-magenta-magenta100)] text-[var(--color-content-default-primary)]";
        case "focus":
          return "bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] shadow-[0_0_5px_1px_#3281F8]";
        case "selected":
          return "bg-[var(--color-magenta-magenta100)] text-[var(--color-content-default-primary)] shadow-[inset_0_0_0_1px_var(--color-border-default-secondary)]";
        case "default":
        default:
          return "bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)]";
      }
    }, []);

    const positionStyles = getPositionStyles(position);
    const stateStyles = getStateStyles(state);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onChange) {
          onChange(e);
        }
      },
      [onChange],
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLButtonElement>) => {
        if (onFocus) {
          onFocus(e);
        }
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLButtonElement>) => {
        if (onBlur) {
          onBlur(e);
        }
      },
      [onBlur],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (onChange) {
            onChange(e);
          }
        }
      },
      [onChange],
    );

    const toggleClasses = `
      ${positionStyles}
      ${stateStyles}
      py-[var(--measures-spacing-008)]
      px-[var(--measures-spacing-008)]
      gap-[var(--measures-spacing-008)]
      font-inter
      font-medium
      text-[12px]
      leading-[12px]
      cursor-pointer
      transition-all
      duration-200
      focus:outline-none
      focus-visible:shadow-[0_0_5px_1px_#3281F8]
      hover:bg-[var(--color-magenta-magenta100)]
      flex
      items-center
      justify-center
      ${className}
    `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <ToggleGroupView
        groupId={groupId}
        className={className}
        position={position}
        state={state}
        showText={showText}
        ariaLabel={ariaLabel}
        toggleClasses={toggleClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      >
        {children}
      </ToggleGroupView>
    );
  }),
);

ToggleGroupContainer.displayName = "ToggleGroup";

export default ToggleGroupContainer;
