export type TagVariant = "recommended" | "selected" | "templateRecommended";

export interface TagProps {
  /**
   * Visual variant: recommended (yellow), selected (dark on light),
   * or templateRecommended (dark pill on pastel `Card / Rule` — Figma
   * `22142:898446`).
   */
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
