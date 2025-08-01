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
  // Size styles
  const sizeStyles = {
    xsmall:
      "px-[var(--spacing-scale-006)] py-[var(--spacing-scale-004)] gap-[var(--spacing-scale-001)]",
    small:
      "px-[var(--spacing-measures-spacing-008)] py-[var(--spacing-measures-spacing-008)] gap-[var(--spacing-scale-004)]",
    // Add more sizes as needed: medium, large, xlarge
  };

  // Font styles based on size
  const fontStyles = {
    xsmall:
      "font-['Inter'] text-[10px] leading-[12px] font-medium tracking-[0%]",
    small:
      "font-['Inter'] text-[10px] leading-[12.5px] font-medium tracking-[0%]",
  };

  // Variant styles
  const variantStyles = {
    default:
      "bg-[var(--color-surface-inverse-primary)] text-[var(--color-content-inverse-primary)] border-2 border-transparent hover:bg-[var(--color-surface-inverse-primary)] hover:text-[var(--color-content-inverse-brand-primary)] hover:border-[var(--border-color-default-brandprimary)] active:bg-[var(--color-surface-inverse-brand-primary)] active:text-[var(--color-content-inverse-primary)] active:border-[var(--border-color-default-brandprimary)] focus:bg-[var(--color-surface-inverse-primary)] focus:text-[var(--color-content-inverse-primary)] focus:shadow-[0_0_10px_#FFFDD2] focus:outline-none disabled:bg-[var(--color-surface-default-secondary)] disabled:text-[var(--color-content-inverse-tertiary)] disabled:cursor-not-allowed disabled:opacity-50",
    secondary:
      "bg-transparent text-[var(--color-content-default-primary)] border-2 border-[var(--color-content-default-primary)] hover:bg-[var(--color-surface-default-tertiary)] hover:text-[var(--color-content-default-primary)] active:bg-[var(--color-surface-default-secondary)] active:text-[var(--color-content-default-primary)] focus:bg-transparent focus:text-[var(--color-content-default-primary)] focus:shadow-[0_0_10px_#FFFDD2] focus:outline-none disabled:bg-[var(--color-surface-default-tertiary)] disabled:text-[var(--color-content-default-tertiary)] disabled:border-[var(--color-content-default-tertiary)] disabled:cursor-not-allowed disabled:opacity-50",
  };

  const baseStyles = `inline-flex items-center justify-start ${sizeStyles[size]} rounded-[var(--radius-measures-radius-full)] ${fontStyles[size]} transition-all duration-200 cursor-pointer`;

  // Determine which variant to use
  let finalVariant = variant;
  if (disabled) {
    finalVariant = "default"; // The disabled state is handled by disabled: utilities
  }

  const combinedStyles = `${baseStyles} ${variantStyles[finalVariant]} ${className}`;

  // Accessibility attributes
  const accessibilityProps = {
    ...(ariaLabel && { "aria-label": ariaLabel }),
    ...(disabled && { "aria-disabled": true }),
    ...(onClick && { role: "button", tabIndex: 0 }),
  };

  // If href is provided, render as anchor tag
  if (href && !disabled) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={combinedStyles}
        {...accessibilityProps}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Render as button
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
