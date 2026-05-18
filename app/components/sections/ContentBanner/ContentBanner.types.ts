import type { BlogPost } from "../../../../lib/content";

export type ContentBannerVariant = "article" | "guide";

export interface ContentBannerProps {
  post: BlogPost;
  /**
   * `article` — blog post hero with thumbnail/banner imagery and metadata.
   * `guide` — static guide pages (Figma ContentBanner on content page template).
   */
  variant?: ContentBannerVariant;
  /** Article variant only: replaces slug-based thumbnail icon in ContentContainer. */
  leadingImageSrc?: string;
  leadingImageAlt?: string;
}

export interface ContentBannerViewProps {
  variant: ContentBannerVariant;
  post: BlogPost;
  leadingImageSrc?: string;
  leadingImageAlt?: string;
  backgroundImageSm?: string;
  backgroundImageMd?: string;
}
