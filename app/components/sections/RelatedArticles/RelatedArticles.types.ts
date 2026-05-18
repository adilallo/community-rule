import type { BlogPost } from "../../../../lib/content";

export type RelatedArticlesVariant = "default" | "useCases";

export interface RelatedArticlesProps {
  relatedPosts: BlogPost[];
  currentPostSlug: string;
  slugOrder?: string[];
  /**
   * **`useCases`**: Figma related section — baseline [**22112-872308**](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22112-872308&m=dev),
   * **`md`** [**22085-863216**](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22085-863216&m=dev),
   * **`lg`** [**20711-14231**](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=20711-14231&m=dev) (shell + card row gutter / padding).
   */
  variant?: RelatedArticlesVariant;
}

export interface RelatedArticlesViewProps {
  filteredPosts: BlogPost[];
  slugOrder: string[];
  isMobile: boolean;
  transformStyle: React.CSSProperties;
  getProgressStyle: (_index: number) => React.CSSProperties;
  onMouseDown?: (_e: React.MouseEvent<HTMLDivElement>) => void;
  variant?: RelatedArticlesVariant;
  /** Stacked title lines (`pages.useCases.relatedArticles.title`) when `variant="useCases"`. */
  useCasesHeadingLines?: readonly string[];
}
