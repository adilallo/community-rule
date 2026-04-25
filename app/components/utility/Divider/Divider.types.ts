export const DIVIDER_ORIENTATION_OPTIONS = ["horizontal", "vertical"] as const;
export type DividerOrientation = (typeof DIVIDER_ORIENTATION_OPTIONS)[number];

export const DIVIDER_TYPE_OPTIONS = ["content", "menu"] as const;
export type DividerType = (typeof DIVIDER_TYPE_OPTIONS)[number];

export type DividerProps = {
  /** @default "horizontal" */
  orientation?: DividerOrientation;
  /**
   * Content: `--color-border-default-secondary` (subtle, lists / panels).
   * Menu: `--color-border-default-tertiary` (navigation chrome).
   * @default "content"
   */
  type?: DividerType;
  className?: string;
};

export type DividerViewProps = DividerProps;
