export type NumberedListSizeValue = "M" | "S";

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
   * Size variant.
   */
  size?: NumberedListSizeValue;
}

export interface NumberedListViewProps {
  items: NumberedListItem[];
  size: "M" | "S";
}
