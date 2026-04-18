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
  /**
   * Max recommended cards in compact (non-expanded) mode. Default 5; Figma compact stack uses 3.
   */
  compactRecommendedLimit?: number;
  /**
   * At `md+`, how compact recommended cards are laid out. `flexWrap` matches Figma Flow — Compact Card Stack (three cards in a row).
   * `pyramidFive` = two rows (3 + 2) centered for five recommended cards (membership step).
   */
  compactDesktopLayout?: "grid" | "flexWrap" | "pyramidFive";
  /** Optional title/description lockup size (create-flow passes `md`-matched `L`/`M`). Defaults to `L`. */
  headerLockupSize?: HeaderLockupSizeValue;
  /** Alignment of the expand/collapse control in `singleStack` layout (Figma right-rail: end). */
  toggleAlignment?: "center" | "end";
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
  compactRecommendedLimit: number;
  compactDesktopLayout: "grid" | "flexWrap" | "pyramidFive";
  headerLockupSize: HeaderLockupSizeValue | undefined;
  toggleAlignment: "center" | "end";
  className: string;
}
