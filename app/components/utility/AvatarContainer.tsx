import { memo } from "react";
import { normalizeSize } from "../../../lib/propNormalization";

export type AvatarContainerSizeValue = "small" | "medium" | "large" | "xlarge" | "Small" | "Medium" | "Large" | "XLarge";

interface AvatarContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /**
   * Avatar container size. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  size?: AvatarContainerSizeValue;
  className?: string;
}

const AvatarContainer = memo<AvatarContainerProps>(
  ({ children, size: sizeProp = "small", className = "", ...props }) => {
    // Normalize props to handle both PascalCase (Figma) and lowercase (codebase)
    const size = normalizeSize(sizeProp, "small");
    const sizeStyles: Record<string, string> = {
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
  },
);

AvatarContainer.displayName = "AvatarContainer";

export default AvatarContainer;
