export type MenuItemSizeValue =
  | "X Small"
  | "Small"
  | "Medium"
  | "Large"
  | "X Large";

export type MenuItemStateValue = "default" | "hover" | "selected";

export type MenuItemModeValue = "default" | "inverse";

export interface MenuItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  /** When set, renders a `<button type="button">` instead of a link (e.g. open login modal). */
  buttonOnClick?: () => void;
  children?: React.ReactNode;
  /**
   * Menu item state: "default", "hover", or "selected".
   * @default "default"
   */
  state?: MenuItemStateValue;
  /**
   * Menu item mode. Default mode has yellow text on dark background.
   * Inverse mode has black text on yellow background (for folderTop variant).
   * @default "default"
   */
  mode?: MenuItemModeValue;
  /**
   * Whether to show an icon (for future icon support).
   * @default false
   */
  icon?: boolean;
  /**
   * Menu item size. Uses Figma format: "X Small", "Small", "Medium", "Large", "X Large".
   * @default "X Small"
   */
  size?: MenuItemSizeValue;
  className?: string;
  disabled?: boolean;
  /**
   * Whether to use reduced padding (for "use cases" button).
   * @default false
   */
  reducedPadding?: boolean;
  ariaLabel?: string;
}

export interface MenuItemViewProps {
  href: string;
  buttonOnClick?: () => void;
  children?: React.ReactNode;
  disabled: boolean;
  className: string;
  combinedStyles: string;
  accessibilityProps: React.HTMLAttributes<
    HTMLAnchorElement | HTMLSpanElement | HTMLButtonElement
  >;
}
