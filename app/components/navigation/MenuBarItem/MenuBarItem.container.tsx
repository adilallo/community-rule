"use client";

import { memo } from "react";
import MenuBarItemView from "./MenuBarItem.view";
import type { MenuBarItemProps } from "./MenuBarItem.types";
import {
  normalizeMenuBarItemState,
  normalizeMenuBarItemMode,
  normalizeMenuBarItemSize,
} from "../../../../lib/propNormalization";

const MenuBarItemContainer = memo<MenuBarItemProps>(
  ({
    href = "#",
    children,
    state: stateProp,
    mode: modeProp,
    icon: _icon = false,
    size: sizeProp = "X Small",
    className = "",
    disabled = false,
    reducedPadding = false,
    ariaLabel,
    ...props
  }) => {
    const state = normalizeMenuBarItemState(stateProp, "default");
    const mode = normalizeMenuBarItemMode(modeProp, "default");
    const size = normalizeMenuBarItemSize(sizeProp, "X Small");

    // Size styles based on Figma specifications
    const sizeStyles: Record<
      "X Small" | "Small" | "Medium" | "Large" | "X Large",
      string
    > = {
      "X Small": reducedPadding ? "px-[var(--spacing-scale-004)] py-[var(--spacing-scale-002)]" : "px-[var(--spacing-scale-004)] py-[var(--spacing-scale-002)]",
      Small: "px-[var(--spacing-scale-004)] py-[var(--spacing-scale-002)]",
      Medium: reducedPadding ? "px-[var(--spacing-scale-002)] py-[var(--spacing-scale-008)] h-[32px]" : "px-[var(--spacing-scale-008)] py-[var(--spacing-scale-008)] h-[32px]",
      Large: "px-[var(--spacing-scale-016)] py-[var(--spacing-scale-016)] h-[44px]",
      "X Large": "px-[var(--spacing-scale-016)] py-[var(--spacing-scale-016)] h-[44px]",
    };

    // Text styles based on Figma specifications
    const textStyles: Record<
      "X Small" | "Small" | "Medium" | "Large" | "X Large",
      string
    > = {
      "X Small":
        "font-inter text-[10px] leading-[12px] font-medium tracking-[0%]",
      Small:
        "font-inter text-[12px] leading-[14px] font-medium tracking-[0%]",
      Medium:
        "font-inter text-[12px] leading-[14px] font-medium tracking-[0%]",
      Large:
        "font-inter text-[16px] leading-[20px] font-medium tracking-[0%]",
      "X Large":
        "font-inter text-[24px] leading-[28px] font-normal tracking-[0%]",
    };

    // State styles for Default mode (yellow text on dark background)
    const defaultModeStyles: Record<
      "default" | "hover" | "selected",
      string
    > = {
      default:
        "bg-transparent text-[var(--color-content-default-brand-primary,#fefcc9)] hover:bg-[var(--color-gray-800)] hover:text-[var(--color-content-default-brand-primary,#fefcc9)]",
      hover:
        "bg-[var(--color-gray-800)] text-[var(--color-content-default-brand-primary,#fefcc9)]",
      selected:
        "border border-[var(--color-border-default-brand-primary,#fdfaa8)] text-[var(--color-content-default-brand-primary,#fefcc9)] bg-transparent hover:bg-[var(--color-gray-800)]",
    };

    // State styles for Inverse mode (black text on yellow background)
    const inverseModeStyles: Record<
      "default" | "hover" | "selected",
      string
    > = {
      default:
        "bg-transparent text-[var(--color-content-inverse-primary,black)] hover:bg-[var(--color-surface-brand-accent,#4d4a00)] hover:text-[var(--color-content-inverse-primary,black)]",
      hover:
        "bg-[var(--color-surface-brand-accent,#4d4a00)] text-[var(--color-content-inverse-primary,black)]",
      selected:
        "border border-[var(--color-border-default-primary,#141414)] text-[var(--color-content-inverse-primary,black)] bg-transparent hover:bg-[var(--color-surface-brand-accent,#4d4a00)]",
    };

    // Get state styles based on mode
    const stateStyles =
      mode === "inverse" ? inverseModeStyles : defaultModeStyles;

    // Base styles
    const baseStyles = `inline-flex items-center whitespace-nowrap ${sizeStyles[size]} ${textStyles[size]} rounded-[var(--radius-measures-radius-full)] transition-all duration-200 ease-in-out cursor-pointer`;

    // Interactive styles
    const interactiveStyles =
      "hover:scale-[1.02] active:scale-[0.98] focus:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100";

    // Disabled styles
    const disabledStyles = disabled
      ? "bg-[var(--color-surface-default-tertiary)] text-[var(--color-content-default-tertiary)]"
      : "";

    // Combine all styles
    const combinedStyles = `${baseStyles} ${stateStyles[state]} ${interactiveStyles} ${disabledStyles} ${className}`;

    const accessibilityProps = {
      ...(ariaLabel && { "aria-label": ariaLabel }),
      ...(disabled && { "aria-disabled": true }),
      ...(state === "selected" && { "aria-current": "page" as const }),
      role: "menuitem" as const,
      tabIndex: disabled ? -1 : 0,
      ...props,
    };

    return (
      <MenuBarItemView
        href={href}
        disabled={disabled}
        className={className}
        combinedStyles={combinedStyles}
        accessibilityProps={accessibilityProps}
      >
        {children}
      </MenuBarItemView>
    );
  },
);

MenuBarItemContainer.displayName = "MenuBarItem";

export default MenuBarItemContainer;
