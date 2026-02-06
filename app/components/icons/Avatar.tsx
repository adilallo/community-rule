import { memo } from "react";
import { normalizeSize } from "../../../lib/propNormalization";

export type AvatarSizeValue = "small" | "medium" | "large" | "xlarge" | "Small" | "Medium" | "Large" | "XLarge";

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /**
   * Avatar size. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  size?: AvatarSizeValue;
  className?: string;
}

const Avatar = memo<AvatarProps>(
  ({ src, alt, size: sizeProp = "small", className = "", ...props }) => {
    // Normalize props to handle both PascalCase (Figma) and lowercase (codebase)
    const size = normalizeSize(sizeProp, "small");
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
