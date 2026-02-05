import type { BlogPost } from "../../../lib/content";

export type ContentThumbnailTemplateVariantValue = "vertical" | "horizontal" | "Vertical" | "Horizontal";

export interface ContentThumbnailTemplateProps {
  post: BlogPost;
  className?: string;
  /**
   * Content thumbnail variant. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
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
