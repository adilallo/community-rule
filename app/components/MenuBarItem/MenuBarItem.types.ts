export interface MenuBarItemProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children?: React.ReactNode;
  variant?: "default" | "home";
  size?:
    | "default"
    | "xsmall"
    | "xsmallUseCases"
    | "home"
    | "homeMd"
    | "homeUseCases"
    | "large"
    | "largeUseCases"
    | "homeXlarge"
    | "xlarge";
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
