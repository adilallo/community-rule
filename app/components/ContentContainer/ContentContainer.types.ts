import type { BlogPost } from "../../../lib/content";

export interface ContentContainerProps {
  post: BlogPost;
  width?: string;
  size?: "xs" | "responsive";
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
