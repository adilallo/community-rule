import React, { memo } from "react";

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  size?: "small" | "medium" | "large" | "xlarge";
  className?: string;
}

const Avatar = memo<AvatarProps>(
  ({ src, alt, size = "small", className = "", ...props }) => {
    const sizeStyles: Record<string, string> = {
      small: "w-[var(--spacing-scale-016)] h-[var(--spacing-scale-016)]",
      medium: "w-[18px] h-[18px]",
      large: "w-[var(--spacing-scale-024)] h-[var(--spacing-scale-024)]",
      xlarge: "w-[var(--spacing-scale-032)] h-[var(--spacing-scale-032)]",
    };

    const baseStyles = `rounded-[var(--radius-measures-radius-full)] object-cover ${sizeStyles[size]} ${className}`;

    return <img src={src} alt={alt} className={baseStyles} {...props} />;
  },
);

Avatar.displayName = "Avatar";

export default Avatar;
