"use client";

import { memo } from "react";
import ContentContainer from "../../content/ContentContainer";
import {
  getAssetPath,
  guideBannerLogoArrowPath,
} from "../../../../lib/assetUtils";
import type { ContentBannerViewProps } from "./ContentBanner.types";

/**
 * Figma: ContentBanner on content page template (22078:791901) — left column
 * title + description; logo mark (22078:806960) in right column.
 */
function ContentBannerGuideView({
  post,
}: Pick<ContentBannerViewProps, "post">) {
  const { title, description } = post.frontmatter;

  return (
    <section
      className="relative w-full overflow-clip px-[var(--spacing-scale-020)] py-[var(--spacing-scale-024)] sm:px-[var(--spacing-scale-032)] sm:py-[var(--spacing-scale-032)] lg:px-[var(--spacing-scale-048)] lg:py-[var(--spacing-scale-040)]"
      aria-labelledby="content-banner-title"
    >
      <div
        className="mx-auto flex w-full max-w-[1024px] flex-col items-start gap-[var(--spacing-scale-024)] md:flex-row md:items-center md:gap-[var(--spacing-scale-032)]"
        data-node-id="19189:9358"
      >
        <div
          className="flex w-full max-w-[365px] shrink-0 flex-col items-start justify-center gap-[var(--spacing-scale-024)]"
          data-node-id="19189:9171"
        >
          <div className="flex w-full flex-col items-start gap-[var(--measures-spacing-016)]">
            <div className="flex w-full flex-col items-start gap-[var(--measures-spacing-004)] text-left text-[var(--color-content-default-primary)]">
              <h1
                id="content-banner-title"
                className="w-full font-bricolage font-medium text-[32px] leading-[110%] sm:text-[40px] lg:text-[44px]"
              >
                {title}
              </h1>
              {description ? (
                <p className="w-full font-inter font-normal text-[16px] leading-[130%] sm:text-[18px]">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div
          className="flex w-full shrink-0 items-center justify-center md:flex-1"
          data-node-id="22078:806960"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getAssetPath(guideBannerLogoArrowPath())}
            alt=""
            aria-hidden
            className="h-[clamp(120px,20vw,171px)] w-[clamp(120px,20vw,172px)] max-w-none shrink-0 object-contain"
          />
        </div>
      </div>
    </section>
  );
}

function ContentBannerArticleView({
  post,
  leadingImageSrc,
  leadingImageAlt,
  backgroundImageSm,
  backgroundImageMd,
}: ContentBannerViewProps) {
  if (!backgroundImageSm || !backgroundImageMd) {
    return null;
  }

  return (
    <div className="relative h-[275px] w-full pt-[var(--measures-spacing-016)] sm:h-[326px] sm:overflow-hidden md:h-[224px] md:pt-[var(--measures-spacing-008)] lg:h-[358.4px] lg:pt-[50px] xl:h-[504px] xl:pt-[112px]">
      <div
        className="absolute inset-0 aspect-[320/225.5] h-full w-full bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImageSm})`,
          backgroundPosition: "center bottom",
        }}
      />

      <div
        className="absolute inset-0 hidden aspect-[640/224] h-full w-full bg-cover bg-no-repeat md:block"
        style={{
          backgroundImage: `url(${backgroundImageMd})`,
          backgroundPosition: "center bottom",
        }}
      />

      <div
        className="
          relative z-10 flex h-full flex-col
          pl-[var(--measures-spacing-016)] pr-[96px]
          justify-start
          md:absolute md:inset-x-0 md:top-1/2 md:h-auto md:w-full md:-translate-y-1/2
          md:pl-[var(--measures-spacing-024)] md:pr-[350px]
          lg:static lg:top-auto lg:h-full lg:translate-y-0 lg:justify-start
          lg:pl-[var(--measures-spacing-064)]
        "
      >
        <ContentContainer
          post={post}
          size="responsive"
          leadingImageSrc={leadingImageSrc}
          leadingImageAlt={leadingImageAlt}
        />
      </div>
    </div>
  );
}

function ContentBannerView(props: ContentBannerViewProps) {
  if (props.variant === "guide") {
    return <ContentBannerGuideView post={props.post} />;
  }

  return <ContentBannerArticleView {...props} />;
}

ContentBannerView.displayName = "ContentBannerView";

export default memo(ContentBannerView);
