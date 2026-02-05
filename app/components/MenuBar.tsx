"use client";

import { memo } from "react";
import { useTranslation } from "../contexts/MessagesContext";
import { normalizeMenuBarSize } from "../../lib/propNormalization";

export type MenuBarSizeValue =
  | "xsmall"
  | "default"
  | "medium"
  | "large"
  | "XSmall"
  | "Default"
  | "Medium"
  | "Large";

interface MenuBarProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
  /**
   * Menu bar size. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  size?: MenuBarSizeValue;
}

const MenuBar = memo<MenuBarProps>(
  ({ children, className = "", size: sizeProp = "default", ...props }) => {
    // Normalize props to handle both PascalCase (Figma) and lowercase (codebase)
    const size = normalizeMenuBarSize(sizeProp);
    const t = useTranslation("menuBar");
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
