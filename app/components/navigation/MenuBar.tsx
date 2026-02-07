"use client";

import { memo } from "react";
import { useTranslation } from "../../contexts/MessagesContext";
import { normalizeMenuBarSize } from "../../../lib/propNormalization";

export type MenuBarSizeValue =
  | "X Small"
  | "Small"
  | "Medium"
  | "Large"
  | "X Large";

interface MenuBarProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
  /**
   * Menu bar size. Uses Figma format: "X Small", "Small", "Medium", "Large", "X Large".
   * @default "X Small"
   */
  size?: MenuBarSizeValue;
}

const MenuBar = memo<MenuBarProps>(
  ({ children, className = "", size: sizeProp = "X Small", ...props }) => {
    const size = normalizeMenuBarSize(sizeProp);
    const t = useTranslation("menuBar");
    
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

MenuBar.displayName = "MenuBar";

export default MenuBar;
