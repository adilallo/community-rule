import type { AlertSizeValue } from "../../../../lib/propNormalization";

export type AlertStatusValue = "default" | "positive" | "warning" | "danger";

export type AlertTypeValue = "toast" | "banner";

export type { AlertSizeValue };

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
   * Density / typography scale (Figma Modal Alert S | M).
   * @default "m"
   */
  size?: AlertSizeValue;
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
  /**
   * Trailing dismiss control (Figma `hasTrailingIcon`).
   * When omitted, defaults to `true` when `onClose` is provided, else `false`.
   */
  hasTrailingIcon?: boolean;
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
  hasTrailingIcon: boolean;
  className: string;
  containerClasses: string;
  containerStyle?: React.CSSProperties;
  titleClasses: string;
  descriptionClasses: string;
  iconColor: string;
  closeButtonIconColor: string;
  onClose?: () => void;
}
