import type { IconName } from "../../asset/icon";

export type AddCustomFieldType = "text" | "badges" | "upload" | "proportion";

/** Icons for each addable field type (wizard + summaries). */
export const ADD_CUSTOM_FIELD_TYPE_ICONS = {
  text: "text_block",
  badges: "tags",
  upload: "image",
  proportion: "number",
} as const satisfies Record<AddCustomFieldType, IconName>;

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
