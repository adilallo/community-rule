import type { BlogPost } from "../../../../lib/content";

export type ContentThumbnailTemplateVariantValue = "vertical" | "horizontal";

export interface ContentThumbnailTemplateProps {
  post: BlogPost;
  className?: string;
  /**
   * Content thumbnail variant.
   */
  variant?: ContentThumbnailTemplateVariantValue;
  slugOrder?: string[];
}

export interface ContentThumbnailTemplateViewProps {
  post: BlogPost;
  className: string;
  variant: "vertical" | "horizontal";
  backgroundImage: string;
}
