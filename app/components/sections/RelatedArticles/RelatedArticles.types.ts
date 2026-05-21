import type { BlogPost } from "../../../../lib/content";

export type RelatedArticlesVariant = "default" | "useCases";

/** Heading contrast when the section sits on a dark vs light page background. */
export type RelatedArticlesHeadingSurface = "onDark" | "onLight";

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
  /** Default `onDark` (blog). Use `onLight` on transparent / light marketing pages. */
  headingSurface?: RelatedArticlesHeadingSurface;
  /** Overrides the default “Related Articles” heading. */
  heading?: string;
}

export interface RelatedArticlesViewProps {
  filteredPosts: BlogPost[];
  slugOrder: string[];
  isMobile: boolean;
  transformStyle: React.CSSProperties;
  getProgressStyle: (_index: number) => React.CSSProperties;
  onMouseDown?: (_e: React.MouseEvent<HTMLDivElement>) => void;
  variant?: RelatedArticlesVariant;
  headingSurface?: RelatedArticlesHeadingSurface;
  heading?: string;
  /** Stacked title lines (`pages.useCases.relatedArticles.title`) when `variant="useCases"`. */
  useCasesHeadingLines?: readonly string[];
}
