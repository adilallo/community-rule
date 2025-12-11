import React, { memo } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?:
    | "default"
    | "secondary"
    | "primary"
    | "outlined"
    | "dark"
    | "inverse";
  size?: "xsmall" | "small" | "medium" | "large" | "xlarge";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}

const Button = memo<ButtonProps>(
  ({
    children,
    variant = "default",
    size = "xsmall",
    className = "",
    disabled = false,
    type = "button",
    onClick,
    href,
    target,
    rel,
    ariaLabel,
    ...props
  }) => {
    const sizeStyles: Record<string, string> = {
      xsmall:
        "px-[var(--spacing-scale-006)] py-[var(--spacing-scale-004)] gap-[var(--spacing-scale-001)]",
      small:
        "px-[var(--spacing-measures-spacing-008)] py-[var(--spacing-measures-spacing-008)] gap-[var(--spacing-scale-004)]",
      medium: "p-[var(--spacing-scale-010)] gap-[var(--spacing-scale-004)]",
      large:
        "px-[var(--spacing-scale-012)] py-[var(--spacing-scale-010)] gap-[var(--spacing-scale-004)]",
      xlarge:
        "px-[var(--spacing-scale-020)] py-[var(--spacing-scale-012)] gap-[var(--spacing-scale-008)]",
    };

    const fontStyles: Record<string, string> = {
      xsmall: "font-inter text-[10px] leading-[12px] font-medium tracking-[0%]",
      small: "font-inter text-[12px] leading-[14px] font-medium tracking-[0%]",
      medium: "font-inter text-[14px] leading-[16px] font-medium tracking-[0%]",
      large: "font-inter text-[16px] leading-[20px] font-medium tracking-[0%]",
      xlarge: "font-inter text-[24px] leading-[28px] font-normal tracking-[0%]",
    };

    const variantStyles: Record<string, string> = {
      default:
        "bg-[var(--color-surface-inverse-primary)] text-[var(--color-content-inverse-primary)] hover:bg-[var(--color-surface-inverse-primary)] hover:text-[var(--color-content-inverse-brand-primary)] hover:outline-[var(--border-color-default-brandprimary)] hover:outline-inset hover:scale-[1.02] hover:shadow-lg focus:shadow-[0_0_10px_1px_var(--color-surface-default-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-content-default-brand-primary)] focus:ring-offset-1 focus:scale-[1.02] active:bg-[var(--color-surface-inverse-brand-primary)] active:text-[var(--color-content-inverse-primary)] active:outline-[var(--border-color-default-brandprimary)] active:outline-offset-1 active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-default-secondary)] disabled:text-[var(--color-content-inverse-tertiary)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100 disabled:hover:shadow-none disabled:hover:outline-none",
      secondary:
        "bg-transparent text-[var(--color-content-default-brand-primary)] hover:text-[var(--color-content-default-primary)] hover:scale-[1.02] hover:bg-transparent hover:outline-none focus:outline-1 focus:outline-inset focus:outline-[var(--border-color-default-tertiary)] focus:shadow-[0_0_10px_1px_var(--color-surface-default-brand-primary)] focus:blur-[0px] active:bg-[var(--color-surface-default-brand-primary)] active:text-[var(--color-content-inverse-primary)] active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-default-secondary)] disabled:text-[var(--color-content-inverse-tertiary)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100",
      primary:
        "bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] hover:bg-[var(--color-surface-default-primary)] hover:text-[var(--color-content-default-brand-primary)] hover:scale-[1.02] focus:bg-[var(--color-surface-default-primary)] focus:text-[var(--color-content-default-brand-primary)] focus:outline-none focus:shadow-[0_0_10px_1px_var(--color-surface-default-brand-primary)] focus:blur-[0px] focus:scale-[1.02] active:bg-[var(--color-surface-default-brand-primary)] active:text-[var(--color-content-inverse-primary)] active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-inverse-secondary)] disabled:text-[var(--color-content-default-primary)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100",
      outlined:
        "bg-transparent text-[var(--color-content-default-primary)] border-[1.5px] border-[var(--color-content-default-primary)] hover:bg-transparent hover:text-[var(--color-content-default-brand-primary)] hover:border-[1.5px] hover:border-[var(--color-content-default-brand-primary)] hover:scale-[1.02] focus:bg-transparent focus:text-[var(--color-content-default-primary)] focus:outline-none focus:border-[1.5px] focus:border-[var(--color-content-default-primary)] focus:shadow-[0_0_10px_1px_var(--color-surface-default-brand-primary)] focus:blur-[0px] focus:scale-[1.02] active:bg-[var(--color-surface-default-brand-primary)] active:text-[var(--color-content-inverse-primary)] active:border-transparent active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-default-secondary)] disabled:text-[var(--color-content-inverse-tertiary)] disabled:border-[1.5px] disabled:border-[var(--color-surface-default-secondary)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100",
      dark: "bg-transparent text-[var(--color-content-inverse-primary)] border border-[var(--border-color-default-primary)] hover:bg-transparent hover:text-[var(--color-content-inverse-brand-primary)] hover:border hover:border-[var(--border-color-inverse-brandprimary)] hover:scale-[1.02] focus:bg-transparent focus:text-[var(--color-content-inverse-primary)] focus:outline-none focus:border focus:border-[var(--border-color-default-primary)] focus:shadow-[0_0_10px_1px_var(--color-surface-default-brand-primary)] focus:blur-[0px] focus:scale-[1.02] active:bg-[var(--color-surface-default-brand-primary)] active:text-[var(--color-content-inverse-primary)] active:border-transparent active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-inverse-secondary)] disabled:text-[var(--color-content-default-primary)] disabled:border-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100",
      inverse:
        "bg-transparent text-[var(--color-content-inverse-primary)] hover:text-[var(--color-content-inverse-brand-primary)] hover:scale-[1.02] hover:bg-transparent hover:outline-none focus:outline-1 focus:outline-inset focus:outline-[var(--border-color-default-tertiary)] focus:shadow-[0_0_10px_1px_var(--color-surface-default-tertiary)] focus:blur-[0px] active:bg-[var(--color-surface-default-brand-primary)] active:text-[var(--color-content-inverse-primary)] active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-inverse-secondary)] disabled:text-[var(--color-content-default-primary)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100",
    };

    const hoverOutlineStyles: Record<string, string> = {
      xsmall: "hover:outline-1",
      small: "hover:outline-1",
      medium: "hover:outline-1",
      large: "hover:outline-2",
      xlarge: "hover:outline-[2.5px]",
    };

    // Only apply outline styles to default and secondary variants, not primary, outlined, dark, or inverse
    const outlineStyles =
      variant === "primary" ||
      variant === "outlined" ||
      variant === "dark" ||
      variant === "inverse"
        ? ""
        : hoverOutlineStyles[size];

    const baseStyles = `inline-flex items-center justify-start box-border ${sizeStyles[size]} rounded-[var(--radius-measures-radius-full)] ${fontStyles[size]} transition-all duration-500 ease-in-out cursor-pointer ${variantStyles[variant]} ${outlineStyles}`;
    const combinedStyles = `${baseStyles} ${className}`;

    const sharedA11y = {
      ...(ariaLabel && { "aria-label": ariaLabel }),
      ...(disabled && { "aria-disabled": true }),
      tabIndex: disabled ? -1 : 0,
    };

    if (href && !disabled) {
      const anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
        href,
        className: combinedStyles,
        onClick,
        ...sharedA11y,
        ...(target && { target }),
        ...(rel && { rel }),
      };

      return <a {...anchorProps}>{children}</a>;
    }

    const buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
      type,
      className: combinedStyles,
      disabled,
      onClick,
      ...sharedA11y,
      ...props,
    };

    return <button {...buttonProps}>{children}</button>;
  },
);

Button.displayName = "Button";

export default Button;
