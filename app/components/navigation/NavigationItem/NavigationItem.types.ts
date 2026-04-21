export type NavigationItemVariantValue = "default";
export type NavigationItemSizeValue = "default" | "xsmall";

export interface NavigationItemProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "isActive"
> {
  href?: string;
  children?: React.ReactNode;
  /**
   * Navigation item variant.
   */
  variant?: NavigationItemVariantValue;
  /**
   * Navigation item size.
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
