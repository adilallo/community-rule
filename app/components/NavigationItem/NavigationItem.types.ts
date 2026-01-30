export interface NavigationItemProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "isActive"
> {
  href?: string;
  children?: React.ReactNode;
  variant?: "default";
  size?: "default" | "xsmall";
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
