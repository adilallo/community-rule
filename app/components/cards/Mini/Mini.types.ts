export interface MiniProps {
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
  /** Figma Feature-Grid mini tile shell (18847:22410). */
  featureGridShell?: boolean;
  panelWidth?: number;
  panelHeight?: number;
  panelImageClassName?: string;
}

export interface MiniViewProps {
  children?: React.ReactNode;
  className: string;
  backgroundColor: string;
  panelContent?: string;
  label?: string;
  labelLine1?: string;
  labelLine2?: string;
  computedAriaLabel: string;
  wrapperElement: "a" | "button" | "div";
  wrapperProps:
    | React.AnchorHTMLAttributes<HTMLAnchorElement>
    | React.ButtonHTMLAttributes<HTMLButtonElement>
    | React.HTMLAttributes<HTMLDivElement>;
  featureGridShell?: boolean;
  panelWidth?: number;
  panelHeight?: number;
  panelImageClassName?: string;
}
