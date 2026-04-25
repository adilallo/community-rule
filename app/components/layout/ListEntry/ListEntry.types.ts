import type { IconName } from "../../asset/Icon";

export const LIST_SIZE_OPTIONS = ["s", "m", "l"] as const;
export type ListSize = (typeof LIST_SIZE_OPTIONS)[number];

export const LIST_ENTRY_VARIANT_OPTIONS = ["default", "danger", "muted"] as const;
export type ListEntryVariant = (typeof LIST_ENTRY_VARIANT_OPTIONS)[number];

export type ListEntryProps = {
  title: string;
  description?: string;
  /** @default true */
  showDescription?: boolean;
  href?: string;
  onClick?: () => void;
  size?: ListSize;
  leadingIcon?: IconName;
  /** Row tone (e.g. profile destructive / disabled rows). @default "default" */
  variant?: ListEntryVariant;
  /** Renders a line above the row (Base / Interactive). @default false */
  topDivider?: boolean;
  /** Renders a line under the row. @default true */
  bottomDivider?: boolean;
  className?: string;
};

export type ListEntryViewProps = ListEntryProps;
