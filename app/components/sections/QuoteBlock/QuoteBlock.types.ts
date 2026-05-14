export type QuoteBlockVariantValue =
  | "compact"
  | "standard"
  | "extended"
  | "statement";

export interface QuoteBlockProps {
  /** Default `standard` (home portrait quote). `statement` is About-only dual-paragraph layout; isolated branch in QuoteBlock.view. */
  variant?: QuoteBlockVariantValue;
  className?: string;
  quote?: string;
  /**
   * Second paragraph for **`statement`** variant (Figma Section/Quote 22137:890679).
   */
  quoteSecondary?: string;
  author?: string;
  source?: string;
  avatarSrc?: string;
  id?: string;
  fallbackAvatarSrc?: string;
  onError?: (_error: {
    type: string;
    message: string;
    author?: string;
    avatarSrc?: string;
    error?: unknown;
    quote?: boolean;
  }) => void;
}

export interface VariantConfig {
  container: string;
  card: string;
  gap: string;
  avatarGap: string;
  avatar: string;
  quote: string;
  author: string;
  source: string;
  showDecor: boolean;
  /**
   * When true, render Figma **Section/Quote** layout (yellow surface, dual paragraphs, no attribution).
   */
  statementLayout?: boolean;
}

export interface QuoteBlockViewProps {
  className: string;
  quote: string;
  quoteSecondary?: string;
  author: string;
  source?: string;
  quoteId: string;
  authorId: string;
  config: VariantConfig;
  imageError: boolean;
  imageLoading: boolean;
  currentAvatarSrc: string;
  onImageLoad: () => void;
  onImageError: (_error: unknown) => void;
}
