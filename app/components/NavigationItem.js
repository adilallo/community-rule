import React, { memo } from "react";

const NavigationItem = memo(
  ({
    href = "#",
    children,
    variant = "default",
    size = "default",
    className = "",
    disabled = false,
    ...props
  }) => {
    // Variant styles
    const variantStyles = {
      default:
        "bg-transparent text-[var(--color-content-default-brand-primary)] border border-transparent hover:bg-[var(--color-surface-default-tertiary)] hover:text-[var(--color-content-default-brand-primary)] active:bg-transparent active:text-[var(--color-content-default-brand-primary)] active:border-[var(--color-content-default-brand-primary)] disabled:bg-[var(--color-surface-default-tertiary)] disabled:text-[var(--color-content-default-tertiary)] disabled:border-[var(--color-content-default-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed",
    };

    // Size styles
    const sizeStyles = {
      default:
        "px-[var(--spacing-scale-016)] py-[var(--spacing-scale-016)] gap-[var(--spacing-scale-004)]",
      xsmall:
        "px-[var(--spacing-scale-004)] py-[var(--spacing-scale-002)] gap-[var(--spacing-scale-004)]",
    };

    // Text styles based on size
    const textStyles = {
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

    const combinedStyles = `${baseStyles} ${variantStyles[finalVariant]} ${className}`;

    if (disabled) {
      return (
        <span className={combinedStyles} {...props}>
          {children}
        </span>
      );
    }

    return (
      <a href={href} className={combinedStyles} {...props}>
        {children}
      </a>
    );
  },
);

NavigationItem.displayName = "NavigationItem";

export default NavigationItem;
