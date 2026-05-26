import type { BlogPost } from "../../../../lib/content";

export type ContentThumbnailTemplateVariantValue =
  | "vertical"
  | "horizontal"
  | "responsive";

export type ContentThumbnailTemplateSizingValue = "fluid" | "fixed";

export interface ContentThumbnailTemplateProps {
  post: BlogPost;
  className?: string;
  /**
   * vertical | horizontal — single layout. responsive — horizontal at <smd,
   * vertical at ≥smd (Learn grid); single card, viewport-swapped via <picture>.
   */
  variant?: ContentThumbnailTemplateVariantValue;
  /**
   * fluid — fill parent (Learn grid). fixed — Figma px dimensions (Related Articles).
   */
  sizing?: ContentThumbnailTemplateSizingValue;
  slugOrder?: string[];
}

export interface ContentThumbnailTemplateViewProps {
  post: BlogPost;
  className: string;
  variant: ContentThumbnailTemplateVariantValue;
  sizing: ContentThumbnailTemplateSizingValue;
  backgroundImage: string;
  /** Wide-viewport image source for variant="responsive" (≥smd). */
  backgroundImageSmd?: string;
}
