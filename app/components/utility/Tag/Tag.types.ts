export type TagVariant = "recommended" | "selected";

export interface TagProps {
  /** Visual variant: recommended (yellow) or selected (dark) */
  variant: TagVariant;
  /** Tag text. Defaults to "RECOMMENDED" or "SELECTED" when not provided. */
  children?: React.ReactNode;
  className?: string;
}

export interface TagViewProps {
  variant: TagVariant;
  children: React.ReactNode;
  className: string;
}
