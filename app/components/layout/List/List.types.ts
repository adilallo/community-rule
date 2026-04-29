import type { IconName } from "../../asset/Icon";
import type {
  ListEntryVariant,
  ListSize,
} from "../ListEntry/ListEntry.types";

export type ListItem = {
  id: string;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
  /** Per-row icon; falls back to list-level {@link ListProps.leadingIcon}. */
  leadingIcon?: IconName;
  variant?: ListEntryVariant;
  showDescription?: boolean;
};

export type ListProps = {
  items: ListItem[];
  size?: ListSize;
  topDivider?: boolean;
  leadingIcon?: IconName;
  className?: string;
};

export type { ListEntryVariant, ListSize };

export type ListViewProps = ListProps;
