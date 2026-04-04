import type { ReactNode } from "react";

export interface InfoMessageBoxItem {
  id: string;
  label: string;
}

export interface InfoMessageBoxProps {
  /** Heading text for the message box */
  title: string;
  /** Checkbox items (id used as value for CheckboxGroup) */
  items: InfoMessageBoxItem[];
  /** Optional icon (e.g. exclamation); default exclamation icon used if not provided */
  icon?: ReactNode;
  /** Controlled checked ids; if undefined, uncontrolled */
  checkedIds?: string[];
  /** Callback when a checkbox is toggled */
  onCheckboxChange?: (id: string, checked: boolean) => void;
  className?: string;
}

export interface InfoMessageBoxViewProps {
  title: string;
  items: InfoMessageBoxItem[];
  icon?: ReactNode;
  checkedIds: string[];
  onGroupChange: (value: string[]) => void;
  className: string;
}
