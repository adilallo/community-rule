import type { BlogPost } from "../../../../lib/content";
import type { ContentContainerToneValue } from "../../content/ContentContainer/ContentContainer.types";

export type ContentBannerVariant = "article" | "guide" | "useCase";

/** Rule column for `useCase` variant (Figma 22015:42621). */
export interface ContentBannerRulePreview {
  title: string;
  description: string;
  backgroundColor: string;
  iconPath: string;
  /** When set, the rule preview links to the completed community rule screen. */
  href?: string;
}

export interface ContentBannerProps {
  post: BlogPost;
  /**
   * `article` — blog post hero with thumbnail/banner imagery and metadata.
   * `guide` — static guide pages (Figma ContentBanner on content page template).
   * `useCase` — use case detail: ContentContainer + Rule preview.
   */
  variant?: ContentBannerVariant;
  /** Article / useCase: replaces slug-based thumbnail icon in ContentContainer. */
  leadingImageSrc?: string;
  leadingImageAlt?: string;
  /** `useCase` only: expanded Rule preview in the right column. */
  rulePreview?: ContentBannerRulePreview;
  /** `useCase` only: ContentContainer text tokens (default `onLight`). */
  contentTone?: ContentContainerToneValue;
}

export interface ContentBannerViewProps {
  variant: ContentBannerVariant;
  post: BlogPost;
  leadingImageSrc?: string;
  leadingImageAlt?: string;
  /** Article variant: horizontal thumbnail below lg (`320×225.5`). */
  backgroundImageHorizontal?: string;
  /** Article variant: section banner at md+ (`1920×672`, Figma Section orientation). */
  backgroundImageSection?: string;
  rulePreview?: ContentBannerRulePreview;
  contentTone?: ContentContainerToneValue;
}
