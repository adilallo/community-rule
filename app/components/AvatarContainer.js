export default function AvatarContainer({
  children,
  size = "small",
  className = "",
  ...props
}) {
  const sizeStyles = {
    small: "flex -space-x-[var(--spacing-scale-008)]",
    medium: "flex -space-x-[9px]",
    large: "flex -space-x-[var(--spacing-scale-010)]",
    xlarge: "flex -space-x-[13px]",
  };

  const baseStyles = `items-center ${sizeStyles[size]} ${className}`;

  return (
    <div className={baseStyles} {...props}>
      {children}
    </div>
  );
}
