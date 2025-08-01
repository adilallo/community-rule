export default function AvatarContainer({
  children,
  size = "small",
  className = "",
  ...props
}) {
  // Size styles - container sizes to fit content, not fixed dimensions
  const sizeStyles = {
    small: "flex -space-x-2", // Just flex with -8px spacing, no fixed width/height
    // Add more sizes as needed: medium, large, xlarge
  };

  const baseStyles = `items-center ${sizeStyles[size]} ${className}`;

  return (
    <div className={baseStyles} {...props}>
      {children}
    </div>
  );
}
