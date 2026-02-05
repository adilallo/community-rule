export interface Category {
  name: string;
  items: string[];
  createUrl?: string;
}

export interface RuleCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  backgroundColor?: string;
  className?: string;
  onClick?: () => void;
  expanded?: boolean;
  size?: "L" | "M" | "l" | "m";
  categories?: Category[];
  onPillClick?: (category: string, item: string) => void;
  onCreateClick?: (category: string) => void;
  logoUrl?: string;
  logoAlt?: string;
  communityInitials?: string;
}

export interface RuleCardViewProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  backgroundColor: string;
  className: string;
  onClick: () => void;
  onKeyDown: (_event: React.KeyboardEvent<HTMLDivElement>) => void;
  expanded: boolean;
  size: "L" | "M";
  categories?: Category[];
  onPillClick?: (category: string, item: string) => void;
  onCreateClick?: (category: string) => void;
  logoUrl?: string;
  logoAlt?: string;
  communityInitials?: string;
}
