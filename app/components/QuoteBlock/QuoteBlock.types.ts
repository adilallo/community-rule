export interface QuoteBlockProps {
  quote: string;
  author?: string;
  authorRole?: string;
  authorImage?: string;
  variant?: "default" | "inverse" | "compact";
  className?: string;
}

export interface QuoteBlockViewProps {
  quoteId: string;
  quote: string;
  author?: string;
  authorRole?: string;
  authorImage?: string;
  variant: "default" | "inverse" | "compact";
  className: string;
  imageError: boolean;
  imageLoading: boolean;
  containerClasses: string;
  quoteClasses: string;
  authorClasses: string;
  authorRoleClasses: string;
  imageContainerClasses: string;
  onImageLoad: () => void;
  onImageError: () => void;
}
