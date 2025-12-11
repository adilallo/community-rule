import React, { memo } from "react";

interface MenuBarProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
  size?: "xsmall" | "default" | "medium" | "large";
}

const MenuBar = memo<MenuBarProps>(
  ({ children, className = "", size = "default", ...props }) => {
    const sizeStyles: Record<string, string> = {
      xsmall:
        "px-[var(--spacing-scale-004)] py-[var(--spacing-scale-004)] gap-[var(--spacing-scale-001)] rounded-[4px]",
      default:
        "px-[var(--spacing-scale-004)] py-[var(--spacing-scale-004)] gap-[var(--spacing-scale-001)]",
      medium:
        "px-[var(--spacing-scale-004)] py-[var(--spacing-scale-004)] gap-[var(--spacing-scale-004)]",
      large:
        "px-[var(--spacing-scale-004)] py-[var(--spacing-scale-004)] gap-[var(--spacing-scale-012)]",
    };

    const baseStyles = `flex items-center ${sizeStyles[size]} ${className}`;

    return (
      <nav
        className={baseStyles}
        role="menubar"
        aria-label="Main navigation menu"
        {...props}
      >
        {children}
      </nav>
    );
  }
);

MenuBar.displayName = "MenuBar";

export default MenuBar;
