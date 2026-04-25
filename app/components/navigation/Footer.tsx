"use client";

import { memo } from "react";
import { useTranslation } from "../../contexts/MessagesContext";
import Link from "next/link";
import Logo from "../asset/logo";
import Separator from "../utility/Separator";
import { getAssetPath, ASSETS } from "../../../lib/assetUtils";

/**
 * Figma: "Navigation / Footer" (18411-62917).
 * Tiers: smallest viewports (below `md`), `md` through `lg`, `lg` and up.
 * Matches `--breakpoint-md: 640px`, `--breakpoint-lg: 1024px` in `app/tailwind.css`.
 */
const Footer = memo(() => {
  const t = useTranslation("footer");

  const linkFocusClass =
    "hover:opacity-80 active:opacity-60 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-default-primary)] transition-opacity";

  const bodyTextClass =
    "text-[var(--color-content-default-primary)] font-inter text-base font-medium leading-5 tracking-[0%] lg:text-2xl lg:font-normal lg:leading-7";

  /** Figma 18411:62925 (1024+): org name is one line, `w-full whitespace-nowrap`. */
  const orgNameClass = `${bodyTextClass} lg:whitespace-nowrap`;

  const primaryLinkClass = `text-[var(--color-content-default-primary)] font-inter text-base font-medium leading-5 tracking-[0%] ${linkFocusClass} p-2 -m-2 cursor-pointer lg:text-2xl lg:font-normal lg:leading-7`;

  /** Figma 18411:62944: 40px gaps, w-[396px] link block; `p-2` on links overruns 396px—tighten x at `md+` row. */
  const legalLinkClass = `text-[var(--color-content-default-secondary)] font-inter text-sm font-normal leading-5 tracking-[0%] ${linkFocusClass} p-2 -m-2 cursor-pointer underline decoration-solid [text-decoration-skip-ink:none] md:px-0 md:py-1 md:mx-0 md:text-xs md:leading-4 md:whitespace-nowrap md:no-underline md:text-[var(--color-content-default-primary)] lg:text-sm lg:leading-5 lg:text-[var(--color-content-default-primary)]`;

  // Schema markup for organization information
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t("organization.name"),
    email: t("organization.email"),
    url: t("organization.url"),
    sameAs: [t("social.bluesky.url"), t("social.gitlab.url")],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <footer className="bg-[var(--color-surface-default-primary)] w-full">
        <div
          className="mx-auto flex max-w-[1920px] flex-col
          gap-[var(--spacing-measures-spacing-040)]
          px-[var(--spacing-measures-spacing-016)]
          py-[var(--spacing-measures-spacing-040)]
          md:gap-[var(--spacing-measures-spacing-024)]
          md:px-[var(--spacing-measures-spacing-032)]
          md:py-[var(--spacing-measures-spacing-024)]
          lg:gap-[var(--spacing-measures-spacing-060,60px)]
          lg:px-[var(--spacing-scale-064)]
          lg:py-[var(--spacing-scale-096)]"
        >
          <div
            className="flex w-full flex-col
            gap-[var(--spacing-scale-032)]
            md:gap-[var(--spacing-scale-048)]
            lg:gap-[var(--spacing-measures-spacing-060,60px)]"
          >
            <Logo size="footer" wordmark />

            <div
              className="flex w-full flex-col
              gap-[var(--spacing-scale-048)]
              md:flex-row md:items-start md:justify-between md:gap-0"
            >
              <div
                className="order-2 flex flex-col
                gap-[var(--spacing-scale-048)]
                md:order-1 md:max-w-[min(100%,334px)]
                lg:max-w-[min(100%,334px)]
                lg:gap-[var(--spacing-scale-064)]"
              >
                <div
                  className="flex flex-col
                  gap-[var(--spacing-measures-spacing-016,16px)]"
                >
                  <div className={orgNameClass}>{t("organization.name")}</div>
                  <a
                    href={`mailto:${t("organization.email")}`}
                    className={`${bodyTextClass} ${linkFocusClass} p-2 -m-2 cursor-pointer`}
                  >
                    {t("organization.email")}
                  </a>
                </div>

                <div
                  className="flex flex-col
                  gap-[var(--spacing-measures-spacing-016,16px)]"
                >
                  <a
                    href={t("social.bluesky.url")}
                    className={`group flex items-center gap-[var(--spacing-measures-spacing-06,6px)] ${linkFocusClass} p-2 -m-2 cursor-pointer`}
                    aria-label={t("social.bluesky.ariaLabel")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- social logo */}
                    <img
                      src={getAssetPath(ASSETS.BLUESKY_LOGO)}
                      alt="Bluesky"
                      width={24}
                      height={22}
                      className="h-[21px] w-[24px] flex-shrink-0 transition-transform group-hover:scale-110"
                    />
                    <div className={bodyTextClass}>{t("social.bluesky.handle")}</div>
                  </a>
                  <a
                    href={t("social.gitlab.url")}
                    className={`group flex items-center gap-[var(--spacing-measures-spacing-06,6px)] ${linkFocusClass} p-2 -m-2 cursor-pointer`}
                    aria-label={t("social.gitlab.ariaLabel")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- social icon */}
                    <img
                      src={getAssetPath(ASSETS.GITLAB_ICON)}
                      alt="GitLab"
                      width={22}
                      height={22}
                      className="h-5 w-[22px] flex-shrink-0 grayscale transition-transform group-hover:scale-110"
                    />
                    <div className={bodyTextClass}>{t("social.gitlab.handle")}</div>
                  </a>
                </div>
              </div>

              <nav
                aria-label="Footer"
                className="order-1 flex w-full max-w-full flex-col
                items-start
                gap-[var(--spacing-scale-032)]
                md:order-2 md:w-auto md:items-end md:text-right
                md:gap-[var(--spacing-scale-032)]"
              >
                <Link
                  href="#"
                  className={`w-full text-left ${primaryLinkClass} md:w-auto md:text-right`}
                >
                  {t("navigation.useCases")}
                </Link>
                <Link
                  href="/learn"
                  className={`w-full text-left ${primaryLinkClass} md:w-auto md:text-right`}
                >
                  {t("navigation.learn")}
                </Link>
                <Link
                  href="#"
                  className={`w-full text-left ${primaryLinkClass} md:w-auto md:text-right`}
                >
                  {t("navigation.about")}
                </Link>
              </nav>
            </div>
          </div>

          <Separator />

          <div
            className="flex w-full flex-col
            gap-[var(--spacing-scale-032)]
            text-[var(--color-content-default-primary)]
            md:flex-row md:items-start md:justify-between md:gap-[var(--spacing-scale-040)]
            md:whitespace-nowrap
            md:text-xs md:leading-4
            lg:text-sm lg:leading-5"
          >
            <p
              className="w-full font-inter text-sm font-normal leading-5 tracking-[0%]
              text-[var(--color-content-default-secondary)]
              md:w-auto
              md:text-xs md:leading-4
              lg:text-sm lg:leading-5"
            >
              {t("copyright")}
            </p>
            <div
              className="flex w-full min-w-0 flex-col flex-wrap
              gap-[var(--spacing-scale-032)]
              font-inter text-sm
              text-[var(--color-content-default-primary)]
              md:max-w-[min(100%,396px)]
              md:flex-row md:flex-nowrap md:content-center md:items-center md:justify-end
              md:gap-[var(--spacing-scale-040)]
              md:text-xs md:leading-4
              lg:max-w-none
              lg:gap-10
              lg:text-sm lg:leading-5"
            >
              <Link href="#" className={legalLinkClass}>
                {t("legal.privacyPolicy")}
              </Link>
              <Link href="#" className={legalLinkClass}>
                {t("legal.termsOfService")}
              </Link>
              <Link href="#" className={legalLinkClass}>
                {t("legal.cookiesSettings")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
});

Footer.displayName = "Footer";

export default Footer;
