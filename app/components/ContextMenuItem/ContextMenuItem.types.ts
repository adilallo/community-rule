export type ContextMenuItemSizeValue = "small" | "medium" | "large" | "Small" | "Medium" | "Large";

export interface ContextMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  selected?: boolean;
  hasSubmenu?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: (
    _e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => void;
  /**
   * Context menu item size. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  size?: ContextMenuItemSizeValue;
}

export interface ContextMenuItemViewProps {
  children?: React.ReactNode;
  selected: boolean;
  hasSubmenu: boolean;
  disabled: boolean;
  className: string;
  itemClasses: string;
  handleClick: (_e: React.MouseEvent<HTMLDivElement>) => void;
  handleKeyDown: (_e: React.KeyboardEvent<HTMLDivElement>) => void;
}
