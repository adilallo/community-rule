import type { ChipOption } from "../../controls/MultiSelect/MultiSelect.types";

export interface Category {
  name: string;
  chipOptions: ChipOption[];
  onChipClick?: (categoryName: string, chipId: string) => void;
  onAddClick?: (categoryName: string) => void;
  onCustomChipConfirm?: (
    categoryName: string,
    chipId: string,
    value: string,
  ) => void;
  onCustomChipClose?: (categoryName: string, chipId: string) => void;
}

/** Bottom row for `Card / Rule` when Figma **Has bottom link** is on (profile, etc.). */
export interface RuleCardBottomLink {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface RuleCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  backgroundColor?: string;
  className?: string;
  onClick?: () => void;
  expanded?: boolean;
  size?: "XS" | "S" | "M" | "L";
  categories?: Category[];
  logoUrl?: string;
  logoAlt?: string;
  communityInitials?: string;
  /** Hide the per-category "+" add chip affordance (e.g. read-only template review). */
  hideCategoryAddButton?: boolean;
  /**
   * Figma `Card / Rule` variant: description + optional status chip + text links
   * (e.g. Duplicate / Delete, or Continue / Start new rule). When set, the card
   * is not a single interactive button — links handle their own actions.
   */
  hasBottomLinks?: boolean;
  /** Uppercase chip (e.g. IN PROGRESS); omit when no left badge. */
  bottomStatusLabel?: string;
  bottomLinks?: RuleCardBottomLink[];
}

export interface RuleCardViewProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  backgroundColor: string;
  className: string;
  onClick?: () => void;
  onKeyDown?: (_event: React.KeyboardEvent<HTMLDivElement>) => void;
  expanded: boolean;
  size: "XS" | "S" | "M" | "L";
  categories?: Category[];
  logoUrl?: string;
  logoAlt?: string;
  communityInitials?: string;
  hideCategoryAddButton?: boolean;
  hasBottomLinks?: boolean;
  bottomStatusLabel?: string;
  bottomLinks?: RuleCardBottomLink[];
}
