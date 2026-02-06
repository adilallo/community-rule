export type MenuBarItemSizeValue =
  | "default"
  | "xsmall"
  | "xsmallUseCases"
  | "home"
  | "homeMd"
  | "homeUseCases"
  | "large"
  | "largeUseCases"
  | "homeXlarge"
  | "xlarge"
  | "Default"
  | "XSmall"
  | "XSmallUseCases"
  | "Home"
  | "HomeMd"
  | "HomeUseCases"
  | "Large"
  | "LargeUseCases"
  | "HomeXlarge"
  | "XLarge";

export type MenuBarItemVariantValue = "default" | "home" | "Default" | "Home";

export interface MenuBarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children?: React.ReactNode;
  /**
   * Menu bar item variant. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  variant?: MenuBarItemVariantValue;
  /**
   * Menu bar item size. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  size?: MenuBarItemSizeValue;
  className?: string;
  disabled?: boolean;
  isActive?: boolean;
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
