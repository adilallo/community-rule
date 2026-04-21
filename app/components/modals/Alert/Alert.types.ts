export type AlertStatusValue = "default" | "positive" | "warning" | "danger";

export type AlertTypeValue = "toast" | "banner";

export interface AlertProps {
  title: string;
  description?: string;
  /**
   * Alert status.
   */
  status?: AlertStatusValue;
  /**
   * Alert type.
   */
  type?: AlertTypeValue;
  /**
   * Whether to show the leading icon (Figma prop).
   * @default true
   */
  hasLeadingIcon?: boolean;
  /**
   * Whether to show body text/description (Figma prop).
   * @default true
   */
  hasBodyText?: boolean;
  onClose?: () => void;
  className?: string;
}

export interface AlertViewProps {
  title: string;
  description?: string;
  status: "default" | "positive" | "warning" | "danger";
  type: "toast" | "banner";
  hasLeadingIcon: boolean;
  hasBodyText: boolean;
  className: string;
  containerClasses: string;
  containerStyle?: React.CSSProperties;
  titleClasses: string;
  descriptionClasses: string;
  iconColor: string;
  closeButtonIconColor: string;
  onClose?: () => void;
}
