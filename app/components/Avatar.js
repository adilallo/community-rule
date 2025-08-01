export default function Avatar({
  src,
  alt,
  size = "small",
  className = "",
  ...props
}) {
  // Size styles - avatars scale to fit inside the 60px container
  const sizeStyles = {
    small: "w-4 h-4", // 16px x 16px to fit in 60px container
    // Add more sizes as needed: medium, large, xlarge
  };

  const baseStyles = `rounded-[var(--radius-measures-radius-full)] object-cover ${sizeStyles[size]} ${className}`;

  return <img src={src} alt={alt} className={baseStyles} {...props} />;
}
