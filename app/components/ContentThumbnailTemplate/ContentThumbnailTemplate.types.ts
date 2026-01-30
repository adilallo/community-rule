import type { BlogPost } from "../../../lib/content";

export interface ContentThumbnailTemplateProps {
  post: BlogPost;
  className?: string;
  variant?: "vertical" | "horizontal";
  slugOrder?: string[];
}

export interface ContentThumbnailTemplateViewProps {
  post: BlogPost;
  className: string;
  variant: "vertical" | "horizontal";
  backgroundImage: string;
}
