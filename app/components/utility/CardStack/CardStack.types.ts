import type { HeaderLockupSizeValue } from "../../type/HeaderLockup/HeaderLockup.types";

export interface CardStackItem {
  id: string;
  label: string;
  supportText?: string;
  recommended?: boolean;
}

export interface CardStackProps {
  cards: CardStackItem[];
  selectedId?: string | null;
  selectedIds?: string[];
  onCardSelect?: (id: string) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
  hasMore?: boolean;
  toggleLabel?: string;
  showLessLabel?: string;
  title?: string;
  description?: string;
  /** "default" = compact grid/column + expanded grid; "singleStack" = always one column, expand shows more in same stack */
  layout?: "default" | "singleStack";
  /** Optional title/description lockup size (create-flow passes `md`-matched `L`/`M`). Defaults to `L`. */
  headerLockupSize?: HeaderLockupSizeValue;
  className?: string;
}

export interface CardStackViewProps {
  cards: CardStackItem[];
  selectedIds: string[];
  onCardSelect: (id: string) => void;
  expanded: boolean;
  onToggleExpand: () => void;
  hasMore: boolean;
  toggleLabel: string;
  showLessLabel: string;
  title: string;
  description: string;
  layout: "default" | "singleStack";
  headerLockupSize: HeaderLockupSizeValue | undefined;
  className: string;
}
