import { memo } from "react";
import Image from "next/image";
import QuoteDecor from "../QuoteDecor";
import type { QuoteBlockViewProps } from "./QuoteBlock.types";

function QuoteBlockView({
  quoteId,
  quote,
  author,
  authorRole,
  authorImage,
  variant,
  className,
  imageError,
  imageLoading,
  containerClasses,
  quoteClasses,
  authorClasses,
  authorRoleClasses,
  imageContainerClasses,
  onImageLoad,
  onImageError,
}: QuoteBlockViewProps) {
  return (
    <blockquote
      id={quoteId}
      className={`${containerClasses} ${className}`}
      aria-label={author ? `Quote by ${author}` : "Quote"}
    >
      <QuoteDecor variant={variant} />
      <div className="flex flex-col gap-[var(--spacing-scale-016)] md:gap-[var(--spacing-scale-024)]">
        <p className={quoteClasses}>{quote}</p>
        {(author || authorRole) && (
          <div className="flex items-center gap-[var(--spacing-scale-016)]">
            {authorImage && !imageError && (
              <div className={imageContainerClasses}>
                {imageLoading ? (
                  <div className="w-full h-full bg-[var(--color-surface-default-secondary)] animate-pulse rounded-full" />
                ) : (
                  <Image
                    src={authorImage}
                    alt={author ? `${author}'s profile picture` : "Author"}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                    onLoad={onImageLoad}
                    onError={onImageError}
                  />
                )}
              </div>
            )}
            <div className="flex flex-col">
              {author && <cite className={authorClasses}>{author}</cite>}
              {authorRole && (
                <span className={authorRoleClasses}>{authorRole}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </blockquote>
  );
}

QuoteBlockView.displayName = "QuoteBlockView";

export default memo(QuoteBlockView);
