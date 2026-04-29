import { memo } from "react";

export type AvatarSizeValue = "small" | "medium" | "large" | "xlarge";

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  size?: AvatarSizeValue;
  className?: string;
}

const Avatar = memo<AvatarProps>(
  ({ src, alt, size: sizeProp = "small", className = "", ...props }) => {
    const size = sizeProp;
    const sizeStyles: Record<string, string> = {
      small:
        "w-[var(--spacing-scale-016)] h-[var(--spacing-scale-016)] border-[1.5px] border-[#FFFFFF4D] border-solid",
      medium: "w-[var(--spacing-scale-018)] h-[var(--spacing-scale-018)]",
      large: "w-[var(--spacing-scale-024)] h-[var(--spacing-scale-024)]",
      xlarge: "w-[var(--spacing-scale-032)] h-[var(--spacing-scale-032)]",
    };

    const baseStyles = `rounded-[var(--radius-measures-radius-full)] object-cover box-border ${sizeStyles[size]} ${className}`;

    return (
      /* eslint-disable-next-line @next/next/no-img-element -- avatar image from URL */
      <img src={src} alt={alt} className={baseStyles} {...props} />
    );
  },
);

Avatar.displayName = "Avatar";

export default Avatar;
