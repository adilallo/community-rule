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
   * Optional explicit list of card ids to render in the compact slot, in
   * order. When provided, this overrides the default
   * `cards.filter(c => c.recommended)` selection — the `recommended` flag
   * then only controls the visual "Recommended" badge. Used by the
   * create-flow card-deck steps so facet scores can pick the compact set
   * (and badge only the truly matched subset). Cards whose ids are not in
   * `cards` are silently dropped.
   */
  compactCardIds?: string[];
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
  compactCardIds: string[] | undefined;
  compactDesktopLayout: "grid" | "flexWrap" | "pyramidFive";
  headerLockupSize: HeaderLockupSizeValue | undefined;
  toggleAlignment: "center" | "end";
  className: string;
}
