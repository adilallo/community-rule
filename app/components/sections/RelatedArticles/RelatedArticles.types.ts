import type { BlogPost } from "../../../../lib/content";

export interface RelatedArticlesProps {
  relatedPosts: BlogPost[];
  currentPostSlug: string;
  slugOrder?: string[];
}

export interface RelatedArticlesViewProps {
  filteredPosts: BlogPost[];
  slugOrder: string[];
  isMobile: boolean;
  transformStyle: React.CSSProperties;
  getProgressStyle: (_index: number) => React.CSSProperties;
  onMouseDown?: (_e: React.MouseEvent<HTMLDivElement>) => void;
}
