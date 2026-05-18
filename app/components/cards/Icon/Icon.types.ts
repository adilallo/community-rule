export interface IconProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
  /**
   * When false, renders a static tile (no button semantics or focus ring).
   * @default true
   */
  interactive?: boolean;
}

export interface IconViewProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className: string;
  interactive: boolean;
  /** Stable id for `aria-labelledby` when `interactive` is false. */
  layoutTitleId: string;
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}
