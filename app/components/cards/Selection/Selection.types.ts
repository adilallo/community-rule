export interface SelectionProps {
  label: string;
  supportText?: string;
  recommended?: boolean;
  selected?: boolean;
  orientation: "horizontal" | "vertical";
  showInfoIcon?: boolean;
  /** Optional id for the root (e.g. `data-card-id` for focus after modal close). */
  id?: string;
  className?: string;
  onClick?: () => void;
}

export interface SelectionViewProps {
  label: string;
  supportText: string;
  recommended: boolean;
  selected: boolean;
  orientation: "horizontal" | "vertical";
  showInfoIcon: boolean;
  id: string | undefined;
  className: string;
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}
