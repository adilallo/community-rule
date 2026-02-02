import ContentThumbnailTemplate from "../ContentThumbnailTemplate";
import type { RelatedArticlesViewProps } from "./RelatedArticles.types";

export function RelatedArticlesView({
  filteredPosts,
  slugOrder,
  isMobile,
  transformStyle,
  getProgressStyle,
  onMouseDown,
}: RelatedArticlesViewProps) {
  if (filteredPosts.length === 0) {
    return null;
  }

  return (
    <section
      className="py-[var(--spacing-scale-032)] lg:py-[var(--spacing-scale-064)]"
      data-testid="related-articles"
    >
      <div className="flex flex-col gap-[var(--spacing-scale-032)] lg:gap-[51px]">
        <h2 className="text-[32px] lg:text-[44px] leading-[110%] font-medium text-[var(--color-content-inverse-primary)] text-center">
          Related Articles
        </h2>

        {/* Horizontal Articles Row - Carousel on mobile, Scrollable slider on desktop */}
        <div className="flex justify-center overflow-hidden">
          <div
            className={`flex gap-0 transition-transform duration-500 ease-in-out ${
              !isMobile
                ? "overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
                : ""
            }`}
            style={transformStyle}
            onMouseDown={!isMobile ? onMouseDown : undefined}
          >
            {filteredPosts.map((relatedPost) => (
              <div
                key={relatedPost.slug}
                className="flex flex-col items-center flex-shrink-0"
                data-testid={`related-${relatedPost.slug}`}
              >
                <ContentThumbnailTemplate
                  post={relatedPost}
                  variant="vertical"
                  slugOrder={slugOrder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Progress bars - only show on mobile */}
        {isMobile && (
          <div className="flex justify-center gap-[var(--measures-spacing-008)] px-[var(--measures-spacing-064)]">
            {filteredPosts.map((relatedPost, index) => (
              <div
                key={relatedPost.slug}
                className="max-w-[var(--measures-spacing-056)] w-full h-[var(--measures-spacing-004)] bg-gray-200 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-gray-600 rounded-full transition-all duration-75 ease-linear"
                  style={getProgressStyle(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
