export interface NavigationItemProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children?: React.ReactNode;
  variant?: "default";
  size?: "default" | "xsmall";
  className?: string;
  disabled?: boolean;
}

export interface NavigationItemViewProps {
  href: string;
  children?: React.ReactNode;
  disabled: boolean;
  className: string;
  combinedStyles: string;
}
