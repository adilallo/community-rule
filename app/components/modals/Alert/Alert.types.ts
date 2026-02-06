export type AlertStatusValue =
  | "default"
  | "positive"
  | "warning"
  | "danger"
  | "Default"
  | "Positive"
  | "Warning"
  | "Danger";

export type AlertTypeValue = "toast" | "banner" | "Toast" | "Banner";

export interface AlertProps {
  title: string;
  description?: string;
  /**
   * Alert status. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  status?: AlertStatusValue;
  /**
   * Alert type. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  type?: AlertTypeValue;
  onClose?: () => void;
  className?: string;
}

export interface AlertViewProps {
  title: string;
  description?: string;
  status: "default" | "positive" | "warning" | "danger";
  type: "toast" | "banner";
  className: string;
  containerClasses: string;
  containerStyle?: React.CSSProperties;
  titleClasses: string;
  descriptionClasses: string;
  iconColor: string;
  closeButtonIconColor: string;
  onClose?: () => void;
}
