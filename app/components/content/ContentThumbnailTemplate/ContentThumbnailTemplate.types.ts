import type { BlogPost } from "../../../../lib/content";

export type ContentThumbnailTemplateVariantValue = "vertical" | "horizontal";

export type ContentThumbnailTemplateSizingValue = "fluid" | "fixed";

export interface ContentThumbnailTemplateProps {
  post: BlogPost;
  className?: string;
  /**
   * Content thumbnail variant.
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
  variant: "vertical" | "horizontal";
  sizing: ContentThumbnailTemplateSizingValue;
  backgroundImage: string;
}
