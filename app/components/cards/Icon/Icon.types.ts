export interface IconProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
}

export interface IconViewProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className: string;
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}
