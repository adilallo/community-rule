"use client";

import { memo } from "react";
import { useTranslation } from "../../contexts/MessagesContext";

export type MenuSizeValue =
  | "X Small"
  | "Small"
  | "Medium"
  | "Large"
  | "X Large";

interface MenuProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
  /**
   * Menu size. Uses Figma format: "X Small", "Small", "Medium", "Large", "X Large".
   * @default "X Small"
   */
  size?: MenuSizeValue;
}

const Menu = memo<MenuProps>(
  ({ children, className = "", size: sizeProp = "X Small", ...props }) => {
    const size = sizeProp ?? "X Small";
    const t = useTranslation("menu");

    // Size styles based on Figma specifications
    const sizeStyles: Record<
      "X Small" | "Small" | "Medium" | "Large" | "X Large",
      string
    > = {
      "X Small":
        "px-[var(--spacing-scale-004)] py-[var(--spacing-scale-004)] gap-[var(--spacing-scale-001)] rounded-[var(--spacing-scale-004)]",
      Small:
        "px-[var(--spacing-scale-004)] py-[var(--spacing-scale-004)] gap-[var(--spacing-scale-004)] rounded-[var(--spacing-scale-004)]",
      Medium:
        "px-[var(--spacing-scale-004)] py-[var(--spacing-scale-004)] gap-[var(--spacing-scale-004)] rounded-[var(--spacing-scale-004)]",
      Large:
        "px-[var(--spacing-scale-004)] py-[var(--spacing-scale-004)] gap-[var(--spacing-scale-012)] rounded-[var(--spacing-scale-004)]",
      "X Large":
        "px-[var(--spacing-scale-004)] py-[var(--spacing-scale-004)] gap-[var(--spacing-scale-012)] rounded-[var(--spacing-scale-004)]",
    };

    const baseStyles = `flex items-center ${sizeStyles[size]} ${className}`;

    return (
      <nav
        className={baseStyles}
        role="menubar"
        aria-label={t("ariaLabel")}
        {...props}
      >
        {children}
      </nav>
    );
  },
);

Menu.displayName = "Menu";

export default Menu;
