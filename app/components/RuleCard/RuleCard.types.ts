import type { ChipOption } from "../MultiSelect/MultiSelect.types";

export interface Category {
  name: string;
  chipOptions: ChipOption[];
  onChipClick?: (categoryName: string, chipId: string) => void;
  onAddClick?: (categoryName: string) => void;
  onCustomChipConfirm?: (categoryName: string, chipId: string, value: string) => void;
  onCustomChipClose?: (categoryName: string, chipId: string) => void;
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
  logoUrl?: string;
  logoAlt?: string;
  communityInitials?: string;
}
