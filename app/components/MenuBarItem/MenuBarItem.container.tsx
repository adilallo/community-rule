"use client";

import { memo } from "react";
import MenuBarItemView from "./MenuBarItem.view";
import type { MenuBarItemProps } from "./MenuBarItem.types";

const MenuBarItemContainer = memo<MenuBarItemProps>(
  ({
    href = "#",
    children,
    variant = "default",
    size = "default",
    className = "",
    disabled = false,
    isActive = false,
    ariaLabel,
    ...props
  }) => {
    const variantStyles: Record<string, string> = {
      default:
        "bg-transparent text-[var(--color-content-default-brand-primary)] hover:bg-[var(--color-surface-default-tertiary)] hover:text-[var(--color-content-default-brand-primary)] hover:scale-[1.02] active:bg-transparent active:text-[var(--color-content-default-brand-primary)] active:scale-[0.98] disabled:bg-[var(--color-surface-default-tertiary)] disabled:text-[var(--color-content-default-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100",
      home: "bg-transparent text-[var(--color-content-inverse-primary)] hover:bg-[var(--color-content-default-brand-accent)] hover:text-[var(--color-content-inverse-primary)] hover:scale-[1.02] active:bg-transparent active:text-[var(--color-content-inverse-primary)] active:scale-[0.98] disabled:bg-[var(--color-surface-default-tertiary)] disabled:text-[var(--color-content-default-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100",
    };

    const activeOutlineStyles: Record<string, string> = {
      xsmall:
        "active:outline-1 active:outline-[var(--color-content-default-primary)] focus:outline-1 focus:outline-[var(--color-content-default-primary)]",
      xsmallUseCases:
        "active:outline-1 active:outline-[var(--color-content-default-primary)] focus:outline-1 focus:outline-[var(--color-content-default-primary)]",
      default:
        "active:outline-[1.5px] active:outline-[var(--color-content-default-brand-primary)] focus:outline-[1.5px] focus:outline-[var(--color-content-default-brand-primary)]",
      homeMd:
        "active:outline-[1.5px] active:outline-[var(--color-content-default-brand-primary)] focus:outline-[1.5px] focus:outline-[var(--color-content-default-brand-primary)]",
      homeUseCases:
        "active:outline-[1.5px] active:outline-[var(--color-content-default-brand-primary)] focus:outline-[1.5px] focus:outline-[var(--color-content-default-brand-primary)]",
      large:
        "active:outline-[1.75px] active:outline-[var(--color-content-default-brand-primary)] focus:outline-[1.75px] focus:outline-[var(--color-content-default-brand-primary)]",
      largeUseCases:
        "active:outline-[1.75px] active:outline-[var(--color-content-default-brand-primary)] focus:outline-[1.75px] focus:outline-[var(--color-content-default-brand-primary)]",
      homeXlarge:
        "active:outline-[2px] active:outline-[var(--color-content-default-brand-primary)] focus:outline-[2px] focus:outline-[var(--color-content-default-brand-primary)]",
      xlarge:
        "active:outline-2 active:outline-[var(--color-content-default-brand-primary)] focus:outline-2 focus:outline-[var(--color-content-default-brand-primary)]",
    };

    const homeOutlineStyles: Record<string, string> = {
      xsmall:
        "active:outline-1 active:outline-[var(--color-content-default-primary)] focus:outline-1 focus:outline-[var(--color-content-default-primary)]",
      xsmallUseCases:
        "active:outline-1 active:outline-[var(--color-content-default-primary)] focus:outline-1 focus:outline-[var(--color-content-default-primary)]",
      default:
        "active:outline-[1.5px] active:outline-[var(--color-content-default-primary)] focus:outline-[1.5px] focus:outline-[var(--color-content-default-primary)]",
      homeMd:
        "active:outline-[1.5px] active:outline-[var(--color-content-default-primary)] focus:outline-[1.5px] focus:outline-[var(--color-content-default-primary)]",
      homeUseCases:
        "active:outline-[1.5px] active:outline-[var(--color-content-default-primary)] focus:outline-[1.5px] focus:outline-[var(--color-content-default-primary)]",
      largeUseCases:
        "active:outline-[1.75px] active:outline-[var(--color-content-default-primary)] focus:outline-[1.75px] focus:outline-[var(--color-content-default-primary)]",
      large:
        "active:outline-[1.75px] active:outline-[var(--color-content-default-primary)] focus:outline-[1.75px] focus:outline-[var(--color-content-default-primary)]",
      homeXlarge:
        "active:outline-[2px] active:outline-[var(--color-content-default-primary)] focus:outline-[2px] focus:outline-[var(--color-content-default-primary)]",
      xlarge:
        "active:outline-2 active:outline-[var(--color-content-default-primary)] focus:outline-2 focus:outline-[var(--color-content-default-primary)]",
    };

    const activeStateStyles: Record<string, string> = {
      xsmall:
        "!outline-1 !outline-[var(--color-content-default-brand-primary)] !text-[var(--color-content-default-brand-primary)] focus:!outline-1 focus:!outline-[var(--color-content-default-brand-primary)]",
      xsmallUseCases:
        "!outline-1 !outline-[var(--color-content-default-brand-primary)] !text-[var(--color-content-default-brand-primary)] focus:!outline-1 focus:!outline-[var(--color-content-default-brand-primary)]",
      default:
        "!outline-[1.5px] !outline-[var(--color-content-default-brand-primary)] !text-[var(--color-content-default-brand-primary)] focus:!outline-[1.5px] focus:!outline-[var(--color-content-default-brand-primary)]",
      homeMd:
        "!outline-[1.5px] !outline-[var(--color-content-default-brand-primary)] !text-[var(--color-content-default-brand-primary)] focus:!outline-[1.5px] focus:!outline-[var(--color-content-default-brand-primary)]",
      homeUseCases:
        "!outline-[1.5px] !outline-[var(--color-content-default-brand-primary)] !text-[var(--color-content-default-brand-primary)] focus:!outline-[1.5px] focus:!outline-[var(--color-content-default-brand-primary)]",
      large:
        "!outline-[1.75px] !outline-[var(--color-content-default-brand-primary)] !text-[var(--color-content-default-brand-primary)] focus:!outline-[1.75px] focus:!outline-[var(--color-content-default-brand-primary)]",
      largeUseCases:
        "!outline-[1.75px] !outline-[var(--color-content-default-brand-primary)] !text-[var(--color-content-default-brand-primary)] focus:!outline-[1.75px] focus:!outline-[var(--color-content-default-brand-primary)]",
      homeXlarge:
        "!outline-[2px] !outline-[var(--color-content-default-brand-primary)] !text-[var(--color-content-default-brand-primary)] focus:!outline-[2px] focus:!outline-[var(--color-content-default-brand-primary)]",
      xlarge:
        "!outline-2 !outline-[var(--color-content-default-brand-primary)] !text-[var(--color-content-default-brand-primary)] focus:!outline-2 focus:!outline-[var(--color-content-default-brand-primary)]",
    };

    const sizeStyles: Record<string, string> = {
      default:
        "px-[var(--spacing-measures-spacing-016)] py-[var(--spacing-measures-spacing-016)] gap-[var(--spacing-scale-004)]",
      xsmall:
        "px-[var(--spacing-scale-004)] py-[var(--spacing-scale-002)] gap-[var(--spacing-scale-004)]",
      xsmallUseCases:
        "px-[var(--spacing-scale-002)] py-[var(--spacing-scale-002)] gap-[var(--spacing-scale-004)]",
      homeMd:
        "px-[var(--spacing-scale-008)] py-[var(--spacing-scale-008)] gap-[var(--spacing-scale-004)]",
      homeUseCases:
        "px-[var(--spacing-scale-002)] py-[var(--spacing-scale-008)] gap-[var(--spacing-scale-004)]",
      large:
        "px-[var(--spacing-scale-012)] py-[var(--spacing-scale-012)] gap-[var(--spacing-scale-004)] h-[44px]",
      largeUseCases:
        "px-[var(--spacing-scale-012)] py-[var(--spacing-scale-012)] gap-[var(--spacing-scale-004)] h-[44px]",
      homeXlarge:
        "px-[var(--spacing-scale-016)] py-[var(--spacing-scale-016)] gap-[var(--spacing-scale-004)] h-[44px]",
      xlarge:
        "px-[var(--spacing-scale-016)] py-[var(--spacing-scale-008)] gap-[var(--spacing-scale-004)] h-[44px]",
    };

    const smallTextStyle =
      "font-inter text-[10px] leading-[12px] font-medium tracking-[0%]";
    const mediumTextStyle =
      "font-inter text-[12px] leading-[14px] font-medium tracking-[0%]";
    const largeTextStyle =
      "font-inter text-[16px] leading-[20px] font-medium tracking-[0%]";
    const xlargeTextStyle =
      "font-inter text-[24px] leading-[28px] font-normal tracking-[0%]";

    const textStyles: Record<string, string> = {
      default: smallTextStyle,
      xsmall: smallTextStyle,
      xsmallUseCases: smallTextStyle,
      home: smallTextStyle,
      homeMd: mediumTextStyle,
      homeUseCases: mediumTextStyle,
      large: largeTextStyle,
      largeUseCases: largeTextStyle,
      homeXlarge: xlargeTextStyle,
      xlarge: xlargeTextStyle,
    };

    const baseStyles = `inline-flex items-center ${sizeStyles[size]} rounded-[var(--radius-measures-radius-full)] ${textStyles[size]} transition-all duration-200 ease-in-out cursor-pointer focus:scale-[1.02]`;

    let finalVariant = variant;
    if (disabled) {
      finalVariant = "default";
    }

    const combinedStyles = `${baseStyles} ${variantStyles[finalVariant]} ${
      finalVariant === "home"
        ? homeOutlineStyles[size]
        : activeOutlineStyles[size]
    } ${isActive ? activeStateStyles[size] : ""} ${className}`;

    const accessibilityProps = {
      ...(ariaLabel && { "aria-label": ariaLabel }),
      ...(disabled && { "aria-disabled": true }),
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
