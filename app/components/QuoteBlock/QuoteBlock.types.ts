export interface QuoteBlockProps {
  variant?: "compact" | "standard" | "extended";
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
  onImageError: (error: unknown) => void;
}
