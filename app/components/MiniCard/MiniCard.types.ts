export interface MiniCardProps {
  children?: React.ReactNode;
  className?: string;
  backgroundColor?: string;
  panelContent?: string;
  label?: string;
  labelLine1?: string;
  labelLine2?: string;
  onClick?: () => void;
  href?: string;
  ariaLabel?: string;
}

export interface MiniCardViewProps {
  children?: React.ReactNode;
  className: string;
  backgroundColor: string;
  panelContent?: string;
  label?: string;
  labelLine1?: string;
  labelLine2?: string;
  computedAriaLabel: string;
  wrapperElement: "a" | "button" | "div";
  wrapperProps: React.AnchorHTMLAttributes<HTMLAnchorElement> &
    React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.HTMLAttributes<HTMLDivElement>;
}
