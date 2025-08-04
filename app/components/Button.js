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
      "bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] border-2 border-[var(--border-color-default-primary)] hover:bg-[var(--color-surface-default-secondary)] hover:text-[var(--color-content-default-primary)] hover:border-[var(--border-color-default-primary)] active:bg-[var(--color-surface-default-tertiary)] active:text-[var(--color-content-default-primary)] active:border-[var(--border-color-default-primary)] disabled:bg-[var(--color-surface-default-secondary)] disabled:text-[var(--color-content-default-tertiary)] disabled:border-[var(--color-content-default-tertiary)] disabled:cursor-not-allowed disabled:opacity-50",
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
