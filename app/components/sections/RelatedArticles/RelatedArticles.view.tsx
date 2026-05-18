import ContentThumbnailTemplate from "../../content/ContentThumbnailTemplate";
import type { RelatedArticlesViewProps } from "./RelatedArticles.types";

export function RelatedArticlesView({
  filteredPosts,
  slugOrder,
  isMobile,
  transformStyle,
  getProgressStyle,
  onMouseDown,
  variant = "default",
  headingSurface = "onDark",
  heading = "Related Articles",
  useCasesHeadingLines,
}: RelatedArticlesViewProps) {
  if (filteredPosts.length === 0) {
    return null;
  }

  const isUseCases = variant === "useCases";

  return (
    <section
      className={
        isUseCases
          ? "px-[var(--spacing-scale-020)] py-[var(--spacing-scale-032)] md:px-[var(--spacing-scale-024)] md:py-[var(--spacing-scale-048)] lg:px-[var(--spacing-scale-120)] lg:py-[var(--spacing-scale-064)]"
          : "py-[var(--spacing-scale-032)] lg:py-[var(--spacing-scale-064)]"
      }
      data-testid="related-articles"
      {...(isUseCases ? { "data-figma-node": "20711-14231" } : {})}
    >
      <div
        className={
          isUseCases
            ? "mx-auto flex w-full max-w-[1440px] flex-col items-center gap-[var(--spacing-scale-024)] md:gap-[var(--spacing-scale-032)]"
            : "flex flex-col gap-[var(--spacing-scale-032)] lg:gap-[51px]"
        }
      >
        {isUseCases && useCasesHeadingLines?.length ? (
          <h2 className="mx-auto w-full min-w-0 max-w-[693px] text-center font-bricolage-grotesque text-[28px] font-bold leading-9 text-[var(--color-content-default-primary)] md:text-[32px] md:leading-[40px] lg:text-[40px] lg:leading-[52px]">
            {/* Baseline 22112-872308: stacked lines; md+ single line; lg 20711-14231: 40/52, max 693px */}
            <span className="flex flex-col md:hidden">
              {useCasesHeadingLines.map((line, index) => (
                <span key={`${index}-${line}`} className="block">
                  {line}
                </span>
              ))}
            </span>
            <span className="hidden md:block">
              {useCasesHeadingLines.join(" ")}
            </span>
          </h2>
        ) : (
          <h2
            className={`text-center text-[32px] font-medium leading-[110%] lg:text-[44px] ${
              headingSurface === "onLight"
                ? "text-[var(--color-content-default-primary)]"
                : "text-[var(--color-content-inverse-primary)]"
            }`}
          >
            {heading}
          </h2>
        )}

        {/* Horizontal Articles Row - Carousel on mobile, Scrollable slider on desktop */}
        <div
          className={
            isUseCases
              ? "flex w-full max-w-[1440px] justify-center overflow-hidden"
              : "flex justify-center overflow-hidden"
          }
        >
          <div
            className={`flex gap-0 transition-transform duration-500 ease-in-out ${
              isUseCases
                ? "lg:gap-[var(--spacing-scale-012)] lg:pl-[var(--spacing-scale-024)]"
                : ""
            } ${
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
