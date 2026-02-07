import { memo } from "react";
import type {
  SizeValue,
  ButtonTypeValue,
  ButtonPaletteValue,
  ButtonStateValue,
} from "../../../lib/propNormalization";
import {
  normalizeSize,
  normalizeButtonType,
  normalizeButtonPalette,
} from "../../../lib/propNormalization";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  /**
   * Button type (Figma prop). Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   * @default "filled"
   */
  buttonType?: ButtonTypeValue;
  /**
   * Button palette (Figma prop). Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses "Invert", codebase uses "inverse" - both are supported.
   * @default "default"
   */
  palette?: ButtonPaletteValue;
  /**
   * Button size. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   * @default "xsmall"
   */
  size?: SizeValue;
  /**
   * Button state (Figma prop). Accepts both lowercase and PascalCase (case-insensitive).
   * @default "default"
   */
  state?: ButtonStateValue;
  /**
   * Whether to show a leading icon (Figma prop).
   * @default false
   */
  hasIconLeading?: boolean;
  /**
   * Whether to show a following icon (Figma prop).
   * @default false
   */
  hasIconFollowing?: boolean;
  /**
   * Whether to show text (Figma prop).
   * @default true
   */
  hasText?: boolean;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (
    _e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}

const Button = memo<ButtonProps>(
  ({
    children,
    buttonType: typeProp,
    palette: paletteProp,
    size: sizeProp = "xsmall",
    state: _stateProp,
    hasIconLeading = false,
    hasIconFollowing = false,
    hasText = true,
    className = "",
    disabled = false,
    type: htmlType = "button",
    onClick,
    href,
    target,
    rel,
    ariaLabel,
    ...props
  }) => {
    // Normalize props
    const buttonType = normalizeButtonType(typeProp, "filled");
    const buttonPalette = normalizeButtonPalette(paletteProp, "default");
    const size = normalizeSize(sizeProp);
    // State prop is for Figma alignment - actual state is handled by CSS pseudo-classes
    // We accept it for API alignment but don't use it for styling (CSS handles states)

    // Map type + palette to variant string for styling (internal use only)
    const getVariantFromTypeAndPalette = (
      type: typeof buttonType,
      palette: typeof buttonPalette,
    ): string => {
      if (type === "filled" && palette === "default") return "filled";
      if (type === "filled" && palette === "inverse") return "filled-inverse";
      if (type === "outline" && palette === "default") return "outline";
      if (type === "outline" && palette === "inverse") return "outline-inverse";
      if (type === "ghost" && palette === "default") return "ghost";
      if (type === "ghost" && palette === "inverse") return "ghost-inverse";
      if (type === "danger" && palette === "default") return "danger";
      // danger + inverse
      return "danger-inverse";
    };

    const variant = getVariantFromTypeAndPalette(buttonType, buttonPalette);

    const sizeStyles: Record<string, string> = {
      xsmall:
        "p-[var(--spacing-scale-004)] gap-[var(--spacing-scale-002)]",
      small:
        "p-[var(--spacing-scale-008)] gap-[var(--spacing-scale-002)]",
      medium: "p-[var(--spacing-scale-010)] gap-[var(--spacing-scale-004)]",
      large:
        "p-[var(--spacing-scale-012)] gap-[var(--spacing-scale-006)]",
      xlarge:
        "p-[var(--spacing-scale-016)] gap-[var(--spacing-scale-008)]",
    };

    const fontStyles: Record<string, string> = {
      xsmall: "font-inter text-[10px] leading-[12px] font-medium tracking-[0%]",
      small: "font-inter text-[12px] leading-[14px] font-medium tracking-[0%]",
      medium: "font-inter text-[14px] leading-[16px] font-medium tracking-[0%]",
      large: "font-inter text-[16px] leading-[20px] font-medium tracking-[0%]",
      xlarge: "font-inter text-[24px] leading-[28px] font-normal tracking-[0%]",
    };

    const variantStyles: Record<string, string> = {
      filled:
        "bg-[var(--color-surface-inverse-primary)] text-[var(--color-content-inverse-primary)] border-[1.5px] border-transparent hover:bg-[var(--color-surface-inverse-primary)] hover:text-[var(--color-content-invert-brand-primary)] hover:border-[var(--color-border-invert-brand-primary)] hover:scale-[1.02] focus:bg-[var(--color-surface-inverse-primary)] focus:text-[var(--color-content-invert-brand-primary)] focus:outline-none focus:border-transparent focus:shadow-[0_0_0px_2px_var(--color-border-default-primary),0_0_0px_4px_var(--color-border-invert-primary)] focus:scale-[1.02] active:bg-[var(--color-surface-invert-brand-primary)] active:text-[var(--color-content-invert-primary)] active:border-[var(--color-border-invert-brand-primary)] active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-default-secondary)] disabled:text-[var(--color-content-invert-tertiary)] disabled:border-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100",
      "filled-inverse":
        "bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] border-[1.5px] border-transparent hover:bg-[var(--color-surface-default-primary)] hover:text-[var(--color-content-default-brand-primary)] hover:border-[var(--color-border-default-brand-primary)] hover:scale-[1.02] focus:bg-[var(--color-surface-default-primary)] focus:text-[var(--color-content-default-brand-primary)] focus:outline-none focus:border-transparent focus:shadow-[0_0_0px_2px_var(--color-border-invert-primary),0_0_0px_4px_var(--color-border-default-primary)] focus:scale-[1.02] active:bg-[var(--color-surface-default-brand-primary)] active:text-[var(--color-content-default-primary)] active:border-[var(--color-border-default-brand-primary)] active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-invert-secondary)] disabled:text-[var(--color-content-default-tertiary)] disabled:border-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100",
      outline:
        "bg-transparent text-[var(--color-content-default-primary)] border-[1.5px] border-[var(--color-border-invert-primary)] hover:bg-transparent hover:text-[var(--color-content-default-brand-primary)] hover:border-[1.5px] hover:border-[var(--color-border-default-brand-primary)] hover:scale-[1.02] focus:bg-transparent focus:text-[var(--color-content-default-primary)] focus:outline-none focus:border-[1.5px] focus:border-[var(--color-border-invert-primary)] focus:shadow-[0_0_0px_2px_var(--color-border-default-primary),0_0_0px_4px_var(--color-border-invert-primary)] focus:scale-[1.02] active:bg-transparent active:text-[var(--color-content-default-primary)] active:border-[1.5px] active:border-[var(--color-border-default-brand-primary)] active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-default-secondary)] disabled:text-[var(--color-content-invert-tertiary)] disabled:border-[1.5px] disabled:border-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100",
      "outline-inverse": "bg-transparent text-[var(--color-content-invert-primary)] border-[1.5px] border-[var(--color-border-default-primary)] hover:bg-transparent hover:text-[var(--color-content-invert-brand-primary)] hover:border-[1.5px] hover:border-[var(--color-border-invert-brand-primary)] hover:scale-[1.02] focus:bg-transparent focus:text-[var(--color-content-invert-primary)] focus:outline-none focus:border-[1.5px] focus:border-[var(--color-border-default-primary)] focus:shadow-[0_0_0px_2px_var(--color-border-invert-primary),0_0_0px_4px_var(--color-border-default-primary)] focus:scale-[1.02] active:bg-transparent active:text-[var(--color-content-invert-primary)] active:border-[1.5px] active:border-[var(--color-border-invert-brand-primary)] active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-invert-secondary)] disabled:text-[var(--color-content-default-tertiary)] disabled:border-[1.5px] disabled:border-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100",
      ghost:
        "bg-transparent text-[var(--color-content-default-brand-primary)] border-[1.5px] border-transparent hover:bg-transparent hover:text-[var(--color-content-default-primary)] hover:border-transparent hover:scale-[1.02] focus:bg-transparent focus:text-[var(--color-content-default-brand-primary)] focus:outline-none focus:border-transparent focus:shadow-[0_0_0px_2px_var(--color-border-default-primary),0_0_0px_4px_var(--color-border-invert-primary)] focus:scale-[1.02] active:bg-transparent active:text-[var(--color-content-default-primary)] active:border-[var(--color-border-default-brand-primary)] active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-default-secondary)] disabled:text-[var(--color-content-invert-tertiary)] disabled:border-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100",
      "ghost-inverse":
        "bg-transparent text-[var(--color-content-invert-primary)] border-[1.5px] border-transparent hover:bg-transparent hover:text-[var(--color-content-invert-primary)] hover:border-transparent hover:scale-[1.02] focus:bg-transparent focus:text-[var(--color-content-invert-brand-primary)] focus:outline-none focus:border-transparent focus:shadow-[0_0_0px_2px_var(--color-border-invert-primary),0_0_0px_4px_var(--color-border-default-primary)] focus:scale-[1.02] active:bg-[var(--color-surface-invert-brand-primary)] active:text-[var(--color-content-invert-primary)] active:border-[var(--color-border-invert-brand-primary)] active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-invert-secondary)] disabled:text-[var(--color-content-default-tertiary)] disabled:border-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100",
      danger:
        "bg-transparent text-[var(--color-border-default-negative-primary)] border border-[var(--color-border-default-negative-primary)] hover:bg-[var(--color-surface-invert-negative-secondary)] hover:text-[var(--color-border-default-negative-primary)] hover:border-[var(--color-border-default-negative-primary)] hover:scale-[1.02] focus:bg-transparent focus:text-[var(--color-border-default-negative-primary)] focus:outline-none focus:border-[var(--color-border-default-negative-primary)] focus:shadow-[0_0_0px_2px_var(--color-border-default-primary),0_0_0px_4px_var(--color-border-invert-primary)] focus:scale-[1.02] active:bg-[var(--color-surface-invert-negative-primary)] active:text-[var(--color-content-invert-negative-primary)] active:border-[1.5px] active:border-[var(--color-border-default-negative-primary)] active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-default-secondary)] disabled:text-[var(--color-content-inverse-tertiary)] disabled:border-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100",
      "danger-inverse":
        "bg-transparent text-[var(--color-content-invert-negative-primary)] border border-[var(--color-border-invert-negative-primary)] hover:bg-transparent hover:text-[var(--color-content-invert-negative-primary)] hover:border-[var(--color-border-invert-negative-primary)] hover:scale-[1.02] focus:bg-transparent focus:text-[var(--color-content-invert-negative-primary)] focus:outline-none focus:border-[var(--color-border-invert-negative-primary)] focus:shadow-[0_0_0px_2px_var(--color-border-invert-primary),0_0_0px_4px_var(--color-border-default-primary)] focus:scale-[1.02] active:bg-[var(--color-surface-default-negative-primary)] active:text-[var(--color-content-default-primary)] active:border-[1.5px] active:border-[var(--color-border-default-negative-primary)] active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-inverse-secondary)] disabled:text-[var(--color-content-default-tertiary)] disabled:border-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100",
    };

    const hoverOutlineStyles: Record<string, string> = {
      xsmall: "hover:outline-1",
      small: "hover:outline-1",
      medium: "hover:outline-1",
      large: "hover:outline-2",
      xlarge: "hover:outline-[2.5px]",
    };

    // Only apply outline styles to filled variant, not filled-inverse, outline, outline-inverse, ghost, ghost-inverse, danger, or danger-inverse
    const outlineStyles =
      variant === "filled-inverse" ||
      variant === "outline" ||
      variant === "outline-inverse" ||
      variant === "ghost" ||
      variant === "ghost-inverse" ||
      variant === "danger" ||
      variant === "danger-inverse"
        ? ""
        : hoverOutlineStyles[size];

    // Apply state-based styles if state prop is provided (overrides default hover/focus/active)
    // Note: State prop is informational for Figma alignment - actual state is handled by CSS pseudo-classes
    // For now, we maintain existing behavior and state prop is for documentation/alignment purposes

    const baseStyles = `inline-flex items-center justify-start box-border whitespace-nowrap shrink-0 ${sizeStyles[size]} rounded-[var(--radius-measures-radius-full)] ${fontStyles[size]} transition-all duration-500 ease-in-out cursor-pointer ${variantStyles[variant]} ${outlineStyles}`;
    const combinedStyles = `${baseStyles} ${className}`;

    const sharedA11y = {
      ...(ariaLabel && { "aria-label": ariaLabel }),
      ...(disabled && { "aria-disabled": true }),
      tabIndex: disabled ? -1 : 0,
    };

    // Filter children based on hasIconLeading, hasIconFollowing, hasText props
    // For now, we render all children but these props are available for future icon support
    const renderContent = () => {
      if (!hasText && !hasIconLeading && !hasIconFollowing) {
        return children; // If all are false, render children as-is (backward compatibility)
      }
      // TODO: When icon support is added, filter children based on these props
      return children;
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

      return <a {...anchorProps}>{renderContent()}</a>;
    }

    const buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
      type: htmlType,
      className: combinedStyles,
      disabled,
      onClick,
      ...sharedA11y,
      ...props,
    };

    return <button {...buttonProps}>{renderContent()}</button>;
  },
);

Button.displayName = "Button";

export default Button;
