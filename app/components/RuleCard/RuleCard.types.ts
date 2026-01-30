export interface RuleCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  backgroundColor?: string;
  className?: string;
  onClick?: () => void;
}

export interface RuleCardViewProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  backgroundColor: string;
  className: string;
  onClick: () => void;
  onKeyDown: (_event: React.KeyboardEvent<HTMLDivElement>) => void;
}
