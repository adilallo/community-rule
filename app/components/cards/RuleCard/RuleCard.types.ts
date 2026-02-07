import type { ChipOption } from "../../controls/MultiSelect/MultiSelect.types";

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
  size?: "XS" | "S" | "M" | "L" | "xs" | "s" | "m" | "l";
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
  size: "XS" | "S" | "M" | "L";
  categories?: Category[];
  logoUrl?: string;
  logoAlt?: string;
  communityInitials?: string;
}
