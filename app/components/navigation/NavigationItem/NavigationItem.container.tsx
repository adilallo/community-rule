"use client";

import { memo } from "react";
import NavigationItemView from "./NavigationItem.view";
import type { NavigationItemProps } from "./NavigationItem.types";
import { normalizeNavigationItemVariant, normalizeNavigationItemSize } from "../../../../lib/propNormalization";

const NavigationItemContainer = memo<NavigationItemProps>(
  ({
    href = "#",
    children,
    variant: variantProp = "default",
    size: sizeProp = "default",
    className = "",
    disabled = false,
    isActive = false,
    ...props
  }) => {
    // Normalize props to handle both PascalCase (Figma) and lowercase (codebase)
    const variant = normalizeNavigationItemVariant(variantProp);
    const size = normalizeNavigationItemSize(sizeProp);
    // Variant styles
    const variantStyles: Record<string, string> = {
      default:
        "bg-transparent text-[var(--color-content-default-brand-primary)] border border-transparent hover:bg-[var(--color-surface-default-tertiary)] hover:text-[var(--color-content-default-brand-primary)] active:bg-transparent active:text-[var(--color-content-default-brand-primary)] active:border-[var(--color-content-default-brand-primary)] disabled:bg-[var(--color-surface-default-tertiary)] disabled:text-[var(--color-content-default-tertiary)] disabled:border-[var(--color-content-default-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed",
    };

    // Size styles
    const sizeStyles: Record<string, string> = {
      default:
        "px-[var(--spacing-scale-016)] py-[var(--spacing-scale-016)] gap-[var(--spacing-scale-004)]",
      xsmall:
        "px-[var(--spacing-scale-004)] py-[var(--spacing-scale-002)] gap-[var(--spacing-scale-004)]",
    };

    // Text styles based on size
    const textStyles: Record<string, string> = {
      default:
        "font-inter text-[10px] leading-[12px] font-medium tracking-[0%]",
      xsmall: "font-inter text-[10px] leading-[12px] font-medium tracking-[0%]",
    };

    const baseStyles = `inline-flex items-center ${sizeStyles[size]} rounded-[var(--radius-measures-radius-full)] ${textStyles[size]} transition-all duration-200 cursor-pointer`;

    // Determine which variant to use
    let finalVariant = variant;
    if (disabled) {
      finalVariant = "default"; // The disabled state is handled by disabled: utilities
    }

    // Active state styling
    const activeStyles = isActive
      ? "!border-[var(--color-content-default-brand-primary)] !text-[var(--color-content-default-brand-primary)]"
      : "";

    const combinedStyles = `${baseStyles} ${variantStyles[finalVariant]} ${activeStyles} ${className}`;

    return (
      <NavigationItemView
        href={href}
        disabled={disabled}
        className={className}
        combinedStyles={combinedStyles}
        {...props}
      >
        {children}
      </NavigationItemView>
    );
  },
);

NavigationItemContainer.displayName = "NavigationItem";

export default NavigationItemContainer;
