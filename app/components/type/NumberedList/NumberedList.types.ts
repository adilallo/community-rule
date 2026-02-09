export type NumberedListSizeValue = "M" | "S" | "m" | "s";

export interface NumberedListItem {
  title: string;
  description: string;
}

export interface NumberedListProps {
  /**
   * Array of list items, each with title and description
   */
  items: NumberedListItem[];
  /**
   * Size variant. Accepts both PascalCase (Figma) and lowercase (codebase).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  size?: NumberedListSizeValue;
}

export interface NumberedListViewProps {
  items: NumberedListItem[];
  size: "M" | "S";
}
