import type { ReactNode } from "react";
import type {
  HeaderLockupJustificationValue,
  HeaderLockupSizeValue,
} from "../../type/HeaderLockup/HeaderLockup.types";
import type { InfoMessageBoxItem } from "../InfoMessageBox/InfoMessageBox.types";

export interface DecisionMakingSidebarProps {
  title: string;
  /** Description text or ReactNode (e.g. with underlined "add") */
  description?: string | ReactNode;
  messageBoxTitle: string;
  messageBoxItems: InfoMessageBoxItem[];
  messageBoxCheckedIds?: string[];
  onMessageBoxCheckboxChange?: (id: string, checked: boolean) => void;
  size?: HeaderLockupSizeValue;
  justification?: HeaderLockupJustificationValue;
  className?: string;
}

export interface DecisionMakingSidebarViewProps {
  title: string;
  description: string | ReactNode | undefined;
  messageBoxTitle: string;
  messageBoxItems: InfoMessageBoxItem[];
  messageBoxCheckedIds: string[] | undefined;
  onMessageBoxCheckboxChange:
    | ((id: string, checked: boolean) => void)
    | undefined;
  size: "L" | "M";
  justification: "left" | "center";
  className: string;
}
