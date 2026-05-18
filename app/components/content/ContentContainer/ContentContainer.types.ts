import type { BlogPost } from "../../../../lib/content";

export type ContentContainerSizeValue = "xs" | "responsive";

export interface ContentContainerProps {
  post: BlogPost;
  width?: string;
  /**
   * Content container size.
   */
  size?: ContentContainerSizeValue;
  /** When set, replaces the default slug-based thumbnail icon. */
  leadingImageSrc?: string;
  /** Alt text for `leadingImageSrc`; defaults to post title. */
  leadingImageAlt?: string;
}

export interface ContentContainerViewProps {
  post: BlogPost;
  width: string;
  size: "xs" | "responsive";
  iconImage: string;
  iconAlt: string;
  containerClasses: string;
  contentGapClasses: string;
  textGapClasses: string;
  titleClasses: string;
  descriptionClasses: string;
  authorClasses: string;
  dateClasses: string;
  formattedDate: string;
}
