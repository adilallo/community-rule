export default function Button({
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
}) {
  const sizeStyles = {
    xsmall:
      "px-[var(--spacing-scale-006)] py-[var(--spacing-scale-004)] gap-[var(--spacing-scale-001)]",
    small:
      "px-[var(--spacing-measures-spacing-008)] py-[var(--spacing-measures-spacing-008)] gap-[var(--spacing-scale-004)]",
    large:
      "px-[var(--spacing-scale-012)] py-[var(--spacing-scale-010)] gap-[var(--spacing-scale-004)]",
    xlarge:
      "px-[var(--spacing-scale-020)] py-[var(--spacing-scale-012)] gap-[var(--spacing-scale-008)]",
  };

  const fontStyles = {
    xsmall:
      "font-['Inter'] text-[10px] leading-[12px] font-medium tracking-[0%]",
    small:
      "font-['Inter'] text-[12px] leading-[14px] font-medium tracking-[0%]",
    large:
      "font-['Inter'] text-[16px] leading-[20px] font-medium tracking-[0%]",
    xlarge:
      "font-['Inter'] text-[24px] leading-[28px] font-normal tracking-[0%]",
  };

  const variantStyles = {
    default:
      "bg-[var(--color-surface-inverse-primary)] text-[var(--color-content-inverse-primary)] hover:bg-[var(--color-surface-inverse-primary)] hover:text-[var(--color-content-inverse-brand-primary)] hover:outline-[var(--border-color-default-brandprimary)] hover:outline-inset hover:scale-[1.02] hover:shadow-lg active:bg-[var(--color-surface-inverse-brand-primary)] active:text-[var(--color-content-inverse-primary)] active:outline-[var(--border-color-default-brandprimary)] active:outline-offset-1 active:scale-[0.98] disabled:bg-[var(--color-surface-default-secondary)] disabled:text-[var(--color-content-inverse-tertiary)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100 disabled:hover:shadow-none",
    secondary:
      "bg-transparent text-[var(--color-content-default-brand-primary)] hover:text-[var(--color-content-default-primary)] hover:scale-[1.02] hover:bg-[var(--color-surface-default-tertiary)] focus:outline-1 focus:outline-inset focus:outline-[var(--border-color-default-tertiary)] focus:shadow-[0_0_10px_1px_#FFFDD2] focus:blur-[0px] active:outline-[1.5px] active:outline-inset active:outline-[var(--color-content-default-brand-primary)] active:bg-[var(--color-surface-default-brand-primary)] active:text-[var(--color-content-inverse-primary)] active:scale-[0.98] disabled:bg-[var(--color-surface-default-secondary)] disabled:text-[var(--color-content-inverse-tertiary)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100",
  };

  const hoverOutlineStyles = {
    xsmall: "hover:outline-1",
    small: "hover:outline-1",
    large: "hover:outline-2",
    xlarge: "hover:outline-[2.5px]",
  };

  const focusStyles =
    "focus:shadow-[0_0_10px_1px_#FFFDD2] focus:outline-none focus:ring-1 focus:ring-[var(--color-content-default-brand-primary)] focus:ring-offset-1 focus:scale-[1.02]";

  const baseStyles = `inline-flex items-center justify-start box-border ${sizeStyles[size]} rounded-[var(--radius-measures-radius-full)] ${fontStyles[size]} transition-all duration-200 ease-in-out cursor-pointer ${variantStyles[variant]} ${hoverOutlineStyles[size]} ${focusStyles}`;

  let finalVariant = variant;
  if (disabled) {
    finalVariant = "default";
  }

  const combinedStyles = `${baseStyles} ${className}`;

  const accessibilityProps = {
    ...(ariaLabel && { "aria-label": ariaLabel }),
    ...(disabled && { "aria-disabled": "true" }),
    ...(target && { target }),
    ...(rel && { rel }),
    tabIndex: disabled ? -1 : 0,
    ...props,
  };

  if (href && !disabled) {
    return (
      <a
        href={href}
        className={combinedStyles}
        onClick={onClick}
        {...accessibilityProps}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedStyles}
      disabled={disabled}
      onClick={onClick}
      {...accessibilityProps}
    >
      {children}
    </button>
  );
}
