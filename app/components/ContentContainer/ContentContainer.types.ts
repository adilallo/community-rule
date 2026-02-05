import type { BlogPost } from "../../../lib/content";

export type ContentContainerSizeValue = "xs" | "responsive" | "Xs" | "Responsive";

export interface ContentContainerProps {
  post: BlogPost;
  width?: string;
  /**
   * Content container size. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  size?: ContentContainerSizeValue;
}

export interface ContentContainerViewProps {
  post: BlogPost;
  width: string;
  size: "xs" | "responsive";
  iconImage: string;
  containerClasses: string;
  contentGapClasses: string;
  textGapClasses: string;
  titleClasses: string;
  descriptionClasses: string;
  authorClasses: string;
  dateClasses: string;
  formattedDate: string;
}
