export type NavigationItemVariantValue = "default" | "Default";
export type NavigationItemSizeValue = "default" | "xsmall" | "Default" | "XSmall";

export interface NavigationItemProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "isActive"
> {
  href?: string;
  children?: React.ReactNode;
  /**
   * Navigation item variant. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  variant?: NavigationItemVariantValue;
  /**
   * Navigation item size. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  size?: NavigationItemSizeValue;
  className?: string;
  disabled?: boolean;
  isActive?: boolean;
}

export interface NavigationItemViewProps {
  href: string;
  children?: React.ReactNode;
  disabled: boolean;
  className: string;
  combinedStyles: string;
}
