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
      "font-['Inter'] text-[10px] leading-[12.5px] font-medium tracking-[0%]",
    large:
      "font-['Inter'] text-[16px] leading-[20px] font-medium tracking-[0%]",
    xlarge:
      "font-['Inter'] text-[24px] leading-[28px] font-normal tracking-[0%]",
  };

  const variantStyles = {
    default:
      "bg-[var(--color-surface-inverse-primary)] text-[var(--color-content-inverse-primary)] hover:bg-[var(--color-surface-inverse-primary)] hover:text-[var(--color-content-inverse-brand-primary)] hover:outline-[var(--border-color-default-brandprimary)] hover:outline-inset active:bg-[var(--color-surface-inverse-brand-primary)] active:text-[var(--color-content-inverse-primary)] active:outline-[var(--border-color-default-brandprimary)] active:outline-offset-1 disabled:bg-[var(--color-surface-default-secondary)] disabled:text-[var(--color-content-inverse-tertiary)] disabled:cursor-not-allowed disabled:opacity-50",
    secondary:
      "bg-transparent text-[var(--color-content-default-brand-primary)] hover:text-[var(--color-content-default-primary)] focus:outline-1 focus:outline-inset focus:outline-[var(--border-color-default-tertiary)] focus:shadow-[0_0_10px_1px_#FFFDD2] focus:blur-[0px] active:outline-[1.5px] active:outline-inset active:outline-[var(--color-content-default-brand-primary)] active:bg-[var(--color-surface-default-brand-primary)] active:text-[var(--color-content-inverse-primary)] disabled:bg-[var(--color-surface-default-secondary)] disabled:text-[var(--color-content-inverse-tertiary)] disabled:cursor-not-allowed disabled:opacity-50",
  };

  const hoverOutlineStyles = {
    xsmall: "hover:outline-1",
    small: "hover:outline-1",
    large: "hover:outline-2",
    xlarge: "hover:outline-[2.5px]",
  };

  const focusStyles = "focus:shadow-[0_0_10px_1px_#FFFDD2] focus:outline-none";

  const baseStyles = `inline-flex items-center justify-start box-border ${sizeStyles[size]} rounded-[var(--radius-measures-radius-full)] ${fontStyles[size]} transition-all duration-200 cursor-pointer ${variantStyles[variant]} ${hoverOutlineStyles[size]} ${focusStyles}`;

  let finalVariant = variant;
  if (disabled) {
    finalVariant = "default";
  }

  const combinedStyles = `${baseStyles} ${className}`;

  const accessibilityProps = {
    ...(ariaLabel && { "aria-label": ariaLabel }),
    ...(target && { target }),
    ...(rel && { rel }),
  };

  if (href && !disabled) {
    return (
      <a
        href={href}
        className={combinedStyles}
        onClick={onClick}
        {...accessibilityProps}
        {...props}
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
      {...props}
    >
      {children}
    </button>
  );
}
