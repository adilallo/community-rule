export type QuoteBlockVariantValue =
  | "compact"
  | "standard"
  | "extended"
  | "Compact"
  | "Standard"
  | "Extended";

export interface QuoteBlockProps {
  /**
   * Quote block variant. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  variant?: QuoteBlockVariantValue;
  className?: string;
  quote?: string;
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
}

export interface QuoteBlockViewProps {
  className: string;
  quote: string;
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
