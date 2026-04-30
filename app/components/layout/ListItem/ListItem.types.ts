import type { IconName } from "../../asset/icon";

export type ListItemProps = {
  label: string;
  leadingIcon: IconName;
  onClick: () => void;
  /** Bottom divider between rows — false on the final row per Figma. */
  showDivider: boolean;
  className?: string;
};
