export default function Avatar({
  src,
  alt,
  size = "small",
  className = "",
  ...props
}) {
  const sizeStyles = {
    small: "w-[16px] h-[16px]",
    medium: "w-[18px] h-[18px]",
    xlarge: "w-[32px] h-[32px]",
  };

  const baseStyles = `rounded-[var(--radius-measures-radius-full)] object-cover ${sizeStyles[size]} ${className}`;

  return <img src={src} alt={alt} className={baseStyles} {...props} />;
}
