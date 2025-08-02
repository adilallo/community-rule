export default function MenuBar({
  children,
  className = "",
  size = "default",
  ...props
}) {
  const sizeStyles = {
    default:
      "px-[var(--spacing-scale-004)] py-[var(--spacing-scale-004)] gap-[var(--spacing-scale-001)]",
    large:
      "px-[var(--spacing-scale-004)] py-[var(--spacing-scale-004)] gap-[var(--spacing-scale-012)]",
  };

  const baseStyles = `flex items-center ${sizeStyles[size]} ${className}`;

  return (
    <nav className={baseStyles} {...props}>
      {children}
    </nav>
  );
}
