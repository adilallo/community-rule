import { memo } from "react";

export type AvatarContainerSizeValue = "small" | "medium" | "large" | "xlarge";

interface AvatarContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  size?: AvatarContainerSizeValue;
  className?: string;
}

const AvatarContainer = memo<AvatarContainerProps>(
  ({ children, size: sizeProp = "small", className = "", ...props }) => {
    const size = sizeProp;
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
