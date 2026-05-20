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
