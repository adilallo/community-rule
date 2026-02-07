export type MenuBarItemSizeValue =
  | "X Small"
  | "Small"
  | "Medium"
  | "Large"
  | "X Large";

export type MenuBarItemStateValue =
  | "default"
  | "hover"
  | "selected";

export type MenuBarItemModeValue =
  | "default"
  | "inverse";

export interface MenuBarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children?: React.ReactNode;
  /**
   * Menu bar item state: "default", "hover", or "selected".
   * @default "default"
   */
  state?: MenuBarItemStateValue;
  /**
   * Menu bar item mode. Default mode has yellow text on dark background.
   * Inverse mode has black text on yellow background (for folderTop variant).
   * @default "default"
   */
  mode?: MenuBarItemModeValue;
  /**
   * Whether to show an icon (for future icon support).
   * @default false
   */
  icon?: boolean;
  /**
   * Menu bar item size. Uses Figma format: "X Small", "Small", "Medium", "Large", "X Large".
   * @default "X Small"
   */
  size?: MenuBarItemSizeValue;
  className?: string;
  disabled?: boolean;
  /**
   * Whether to use reduced padding (for "use cases" button).
   * @default false
   */
  reducedPadding?: boolean;
  ariaLabel?: string;
}

export interface MenuBarItemViewProps {
  href: string;
  children?: React.ReactNode;
  disabled: boolean;
  className: string;
  combinedStyles: string;
  accessibilityProps: React.HTMLAttributes<HTMLAnchorElement | HTMLSpanElement>;
}
