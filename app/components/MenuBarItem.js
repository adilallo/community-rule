export default function MenuBarItem({
  href = "#",
  children,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
  ...props
}) {
  const variantStyles = {
    default:
      "bg-transparent text-[var(--color-content-default-brand-primary)] hover:bg-[var(--color-surface-default-tertiary)] hover:text-[var(--color-content-default-brand-primary)] active:bg-transparent active:text-[var(--color-content-default-brand-primary)] disabled:bg-[var(--color-surface-default-tertiary)] disabled:text-[var(--color-content-default-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed",
    home: "bg-transparent text-[var(--color-content-inverse-primary)] hover:bg-[var(--color-content-default-brand-accent)] hover:text-[var(--color-content-inverse-primary)] active:bg-transparent active:text-[var(--color-content-inverse-primary)] disabled:bg-[var(--color-surface-default-tertiary)] disabled:text-[var(--color-content-default-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed",
  };

  const activeOutlineStyles = {
    xsmall:
      "active:outline-1 active:outline-[var(--color-content-default-primary)]",
    default:
      "active:outline-1 active:outline-[var(--color-content-default-brand-primary)]",
    homeMd:
      "active:outline-[1.5px] active:outline-[var(--color-content-default-brand-primary)]",
    large:
      "active:outline-[1.75px] active:outline-[var(--color-content-default-brand-primary)]",
    xlarge:
      "active:outline-2 active:outline-[var(--color-content-default-brand-primary)]",
  };

  const homeOutlineStyles = {
    xsmall:
      "active:outline-1 active:outline-[var(--color-content-default-primary)]",
    xsmallUseCases:
      "active:outline-1 active:outline-[var(--color-content-default-primary)]",
    default:
      "active:outline-[1.5px] active:outline-[var(--color-content-default-primary)]",
    homeMd:
      "active:outline-[1.5px] active:outline-[var(--color-content-default-primary)]",
    homeUseCases:
      "active:outline-[1.5px] active:outline-[var(--color-content-default-primary)]",
    large:
      "active:outline-[1.75px] active:outline-[var(--color-content-default-primary)]",
    xlarge:
      "active:outline-2 active:outline-[var(--color-content-default-primary)]",
  };

  const sizeStyles = {
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
      "px-[var(--spacing-scale-012)] py-[var(--spacing-scale-012)] gap-[var(--spacing-scale-004)]",
    xlarge:
      "px-[var(--spacing-scale-016)] py-[var(--spacing-scale-008)] gap-[var(--spacing-scale-004)]",
  };

  const smallTextStyle =
    "font-['Inter'] text-[10px] leading-[12px] font-medium tracking-[0%]";
  const mediumTextStyle =
    "font-['Inter'] text-[12px] leading-[14px] font-medium tracking-[0%]";
  const largeTextStyle =
    "font-['Inter'] text-[16px] leading-[20px] font-medium tracking-[0%]";
  const xlargeTextStyle =
    "font-['Inter'] text-[24px] leading-[28px] font-normal tracking-[0%]";

  const textStyles = {
    default: smallTextStyle,
    xsmall: smallTextStyle,
    xsmallUseCases: smallTextStyle,
    home: smallTextStyle,
    homeMd: mediumTextStyle,
    homeUseCases: mediumTextStyle,
    large: largeTextStyle,
    xlarge: xlargeTextStyle,
  };

  const baseStyles = `inline-flex items-center ${sizeStyles[size]} rounded-[var(--radius-measures-radius-full)] ${textStyles[size]} transition-all duration-200 cursor-pointer`;

  let finalVariant = variant;
  if (disabled) {
    finalVariant = "default";
  }

  const combinedStyles = `${baseStyles} ${variantStyles[finalVariant]} ${
    finalVariant === "home"
      ? homeOutlineStyles[size]
      : activeOutlineStyles[size]
  } ${className}`;

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
}
