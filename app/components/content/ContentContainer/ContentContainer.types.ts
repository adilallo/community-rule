import type { BlogPost } from "../../../../lib/content";

export type ContentContainerSizeValue = "xs" | "responsive";

/** `inverse` — blog hero on imagery; `onLight` — marketing pages on default surface. */
export type ContentContainerToneValue = "inverse" | "onLight";

export interface ContentContainerProps {
  post: BlogPost;
  width?: string;
  /**
   * Content container size.
   */
  size?: ContentContainerSizeValue;
  /**
   * Text color tokens. Default `inverse` (royal on dark/imagery).
   */
  tone?: ContentContainerToneValue;
  /** When set, replaces the default slug-based thumbnail icon. */
  leadingImageSrc?: string;
  /** Alt text for `leadingImageSrc`; defaults to post title. */
  leadingImageAlt?: string;
  /** When false, omits the icon row above the title. Default true. */
  showLeadingImage?: boolean;
}

export interface ContentContainerViewProps {
  post: BlogPost;
  width: string;
  size: "xs" | "responsive";
  tone: ContentContainerToneValue;
  iconImage: string;
  iconAlt: string;
  showLeadingImage: boolean;
  containerClasses: string;
  contentGapClasses: string;
  textGapClasses: string;
  titleClasses: string;
  descriptionClasses: string;
  authorClasses: string;
  dateClasses: string;
  formattedDate: string;
}
