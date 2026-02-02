export interface IconCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
}

export interface IconCardViewProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className: string;
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}
