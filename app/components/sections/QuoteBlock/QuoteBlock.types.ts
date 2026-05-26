export type QuoteBlockVariantValue =
  | "compact"
  | "standard"
  | "extended"
  | "statement";

export interface QuoteBlockProps {
  /** Default `standard` (home portrait quote). **`statement`** = yellow Section / Quote (**About** + **`/use-cases`** — two paragraphs below **`lg`**, one paragraph from **`lg`**; [21967-24638](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=21967-24638&m=dev)). */
  variant?: QuoteBlockVariantValue;
  className?: string;
  quote?: string;
  /** Second paragraph for **`statement`** (Section/Quote); merged into one `<p>` from **`lg`**. */
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
   * When true, render Figma **Section/Quote** layout (yellow surface; stacked copy below **`lg`**, single paragraph from **`lg`**; no attribution).
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
  currentAvatarSrc: string;
  onImageError: (_error: unknown) => void;
}
