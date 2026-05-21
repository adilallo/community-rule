"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { useTranslation } from "../../../contexts/MessagesContext";
import ContentContainer from "../../content/ContentContainer";
import Rule from "../../cards/Rule";
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

/**
 * Figma: Content page Template (19003:23305) — ContentBanner article instances.
 * Horizontal thumbnail below md; Section SVG (1920×672) at md+.
 */
function ContentBannerArticleView({
  post,
  leadingImageSrc,
  leadingImageAlt,
  backgroundImageHorizontal,
  backgroundImageSection,
}: ContentBannerViewProps) {
  if (!backgroundImageHorizontal || !backgroundImageSection) {
    return null;
  }

  return (
    <div
      data-node-id="19189:9053"
      className="
        relative z-[1] w-full overflow-visible
        min-h-[275px]
        pt-[var(--spacing-scale-016)] px-[var(--spacing-scale-016)]
        pb-[var(--spacing-scale-064)]
        sm:min-h-[326px] sm:pb-[var(--spacing-scale-048)]
        md:min-h-[224px] md:px-[var(--spacing-scale-024)] md:pb-0
        md:pt-[var(--spacing-scale-008)]
        lg:min-h-[358.4px] lg:px-[var(--spacing-scale-048)] lg:py-[var(--spacing-scale-040)]
        xl:min-h-[504px] xl:px-[var(--spacing-scale-064)] xl:py-[var(--spacing-scale-076)]
      "
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -bottom-[var(--spacing-scale-024)] sm:-bottom-[var(--spacing-scale-032)] md:hidden"
        data-name="ContentBannerBackgroundHorizontal"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={backgroundImageHorizontal}
          alt=""
          className="absolute inset-0 size-full max-w-none object-cover object-bottom"
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -bottom-[var(--spacing-scale-032)] hidden md:block"
        data-name="ContentBannerBackgroundSection"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={backgroundImageSection}
          alt=""
          className="absolute inset-0 size-full max-w-none object-cover object-center"
        />
      </div>

      <div
        data-node-id="19189:9010"
        className="
          relative z-10
          max-w-[calc(100%-96px)]
          sm:max-w-[calc(100%-151px)]
          md:max-w-[280px]
          lg:max-w-[365px]
          xl:max-w-[623px]
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

/**
 * Figma: use case detail ContentBanner (22015:42621) — copy left, Rule preview right.
 */
function ContentBannerUseCaseView({
  post,
  rulePreview,
  contentTone = "inverse",
  leadingImageSrc,
  leadingImageAlt,
}: Pick<
  ContentBannerViewProps,
  | "post"
  | "rulePreview"
  | "contentTone"
  | "leadingImageSrc"
  | "leadingImageAlt"
>) {
  const t = useTranslation("pages.useCasesCompletedRule");
  if (!rulePreview) {
    return null;
  }

  const { title } = post.frontmatter;

  return (
    <section
      className="relative w-full overflow-clip"
      aria-label={title}
    >
      <div
        data-figma-node="22015:42621"
        className="mx-auto grid w-full max-w-[1024px] grid-cols-1 items-center gap-[var(--space-800)] px-[var(--space-1200)] py-[var(--space-1000)] lg:grid-cols-2 lg:items-center"
      >
        <div
          data-node-id="19189:9171"
          className="flex w-full min-w-0 shrink-0 flex-col lg:max-w-[365px]"
        >
          <ContentContainer
            post={post}
            size="responsive"
            tone={contentTone}
            showLeadingImage={false}
            leadingImageSrc={leadingImageSrc}
            leadingImageAlt={leadingImageAlt}
          />
        </div>

        <div className="flex min-w-0 w-full">
          {rulePreview.href ? (
            <Link
              href={rulePreview.href}
              className="block w-full rounded-[24px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-default-brand-primary)] focus-visible:ring-offset-2"
              aria-label={t("ruleCardLinkAriaLabel").replace(
                "{title}",
                rulePreview.title,
              )}
            >
              <Rule
                title={rulePreview.title}
                description={rulePreview.description}
                expanded
                fluidWidth
                size="L"
                templateGridFigmaShell
                backgroundColor={rulePreview.backgroundColor}
                className="w-full cursor-pointer rounded-[24px] transition-opacity hover:opacity-95"
                icon={
                  <Image
                    src={getAssetPath(rulePreview.iconPath)}
                    alt=""
                    width={103}
                    height={103}
                    draggable={false}
                    unoptimized={rulePreview.iconPath.endsWith(".svg")}
                    className="aspect-square size-full max-h-[103px] max-w-[103px] object-contain mix-blend-luminosity"
                  />
                }
              />
            </Link>
          ) : (
            <Rule
              title={rulePreview.title}
              description={rulePreview.description}
              expanded
              fluidWidth
              size="L"
              templateGridFigmaShell
              backgroundColor={rulePreview.backgroundColor}
              className="pointer-events-none w-full select-none rounded-[24px]"
              icon={
                <Image
                  src={getAssetPath(rulePreview.iconPath)}
                  alt=""
                  width={103}
                  height={103}
                  draggable={false}
                  unoptimized={rulePreview.iconPath.endsWith(".svg")}
                  className="aspect-square size-full max-h-[103px] max-w-[103px] object-contain mix-blend-luminosity"
                />
              }
            />
          )}
        </div>
      </div>
    </section>
  );
}

function ContentBannerView(props: ContentBannerViewProps) {
  if (props.variant === "guide") {
    return <ContentBannerGuideView post={props.post} />;
  }

  if (props.variant === "useCase") {
    return <ContentBannerUseCaseView {...props} />;
  }

  return <ContentBannerArticleView {...props} />;
}

ContentBannerView.displayName = "ContentBannerView";

export default memo(ContentBannerView);
