export type AddCustomFieldType = "text" | "badges" | "upload" | "proportion";

export interface AddCustomFieldProps {
  /** When true, show the 2×2 field-type grid; when false, show the primary CTA. */
  active: boolean;
  onPressAdd?: () => void;
  onSelectFieldType?: (type: AddCustomFieldType) => void;
  className?: string;
}

export interface AddCustomFieldViewProps {
  active: boolean;
  onPressAdd?: () => void;
  onSelectFieldType?: (type: AddCustomFieldType) => void;
  ctaLabel: string;
  fieldTypeLabels: Record<AddCustomFieldType, string>;
  className: string;
}
