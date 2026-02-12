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
  className: string;
}
