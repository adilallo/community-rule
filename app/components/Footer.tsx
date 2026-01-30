"use client";

import { memo } from "react";
import { useTranslation } from "../contexts/MessagesContext";
import Link from "next/link";
import Logo from "./Logo";
import Separator from "./Separator";
import { getAssetPath, ASSETS } from "../../lib/assetUtils";

const Footer = memo(() => {
  const t = useTranslation("footer");

  // Schema markup for organization information
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t("organization.name"),
    email: t("organization.email"),
    url: t("organization.url"),
    sameAs: [
      t("social.bluesky.url"),
      t("social.gitlab.url"),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <footer className="bg-[var(--color-surface-default-primary)] w-full">
        <div
          className="flex flex-col items-start mx-auto
          px-[var(--spacing-measures-spacing-016)]
          py-[var(--spacing-measures-spacing-040)]
          gap-[var(--spacing-measures-spacing-040)]
          sm:px-[var(--spacing-measures-spacing-032)]
          sm:py-[var(--spacing-measures-spacing-024)]
          sm:gap-[var(--spacing-measures-spacing-024)]
          lg:px-[var(--spacing-measures-spacing-120,120px)]
          lg:py-[var(--spacing-measures-spacing-096,96px)]
          lg:gap-[var(--spacing-measures-spacing-060,60px)]"
        >
          {/* Logo*/}
          <div className="block sm:hidden">
            <Logo />
          </div>
          <div className="hidden sm:block lg:hidden">
            <Logo size="footer" />
          </div>
          <div className="hidden lg:block">
            <Logo size="footerLg" />
          </div>

          {/* Content section */}
          <div className="flex flex-col items-start w-full gap-[var(--spacing-measures-spacing-048,48px)] sm:flex-row sm:justify-between sm:gap-0">
            {/* Branding Section */}
            <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-064,64px)] order-2 sm:order-1">
              {/* Contact info */}
              <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-016,16px)]">
                <div className="text-[var(--color-content-default-primary)] font-inter text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal">
                  {t("organization.name")}
                </div>
                <a
                  href={`mailto:${t("organization.email")}`}
                  className="text-[var(--color-content-default-primary)] font-inter text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal hover:opacity-80 active:opacity-60 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-default-primary)] transition-opacity p-2 -m-2 cursor-pointer"
                >
                  {t("organization.email")}
                </a>
              </div>

              {/* Social media links */}
              <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-016,16px)]">
                <a
                  href={t("social.bluesky.url")}
                  className="flex items-center gap-[var(--spacing-measures-spacing-06,6px)] hover:opacity-80 active:opacity-60 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-default-primary)] transition-opacity p-2 -m-2 cursor-pointer group"
                  aria-label={t("social.bluesky.ariaLabel")}
                >
                  <img
                    src={getAssetPath(ASSETS.BLUESKY_LOGO)}
                    alt="Bluesky"
                    width={24}
                    height={22}
                    className="flex-shrink-0 group-hover:scale-110 transition-transform"
                  />
                  <div className="text-[var(--color-content-default-primary)] font-inter text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal">
                    {t("social.bluesky.handle")}
                  </div>
                </a>
                <a
                  href={t("social.gitlab.url")}
                  className="flex items-center gap-[var(--spacing-measures-spacing-06,6px)] hover:opacity-80 active:opacity-60 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-default-primary)] transition-opacity p-2 -m-2 cursor-pointer group"
                  aria-label={t("social.gitlab.ariaLabel")}
                >
                  <img
                    src={getAssetPath(ASSETS.GITLAB_ICON)}
                    alt="GitLab"
                    width={22}
                    height={22}
                    className="flex-shrink-0 grayscale group-hover:scale-110 transition-transform"
                  />
                  <div className="text-[var(--color-content-default-primary)] font-inter text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal">
                    {t("social.gitlab.handle")}
                  </div>
                </a>
              </div>
            </div>

            {/* Links Section */}
            <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-016,16px)] order-1 sm:order-2">
              <Link
                href="#"
                className="text-[var(--color-content-default-primary)] font-inter text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal hover:opacity-80 active:opacity-60 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-default-primary)] transition-opacity p-2 -m-2 cursor-pointer"
              >
                {t("navigation.useCases")}
              </Link>
              <Link
                href="/learn"
                className="text-[var(--color-content-default-primary)] font-inter text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal hover:opacity-80 active:opacity-60 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-default-primary)] transition-opacity p-2 -m-2 cursor-pointer"
              >
                {t("navigation.learn")}
              </Link>
              <Link
                href="#"
                className="text-[var(--color-content-default-primary)] font-inter text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal hover:opacity-80 active:opacity-60 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-default-primary)] transition-opacity p-2 -m-2 cursor-pointer"
              >
                {t("navigation.about")}
              </Link>
            </div>
          </div>

          <Separator />

          {/* Legal Links */}
          <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-016,16px)] sm:flex-row sm:gap-[var(--spacing-measures-spacing-024,24px)]">
            <Link
              href="#"
              className="text-[var(--color-content-default-secondary)] font-inter text-sm leading-5 font-normal tracking-[0%] lg:text-base lg:leading-6 hover:opacity-80 active:opacity-60 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-default-primary)] transition-opacity p-2 -m-2 cursor-pointer"
            >
              {t("legal.privacyPolicy")}
            </Link>
            <Link
              href="#"
              className="text-[var(--color-content-default-secondary)] font-inter text-sm leading-5 font-normal tracking-[0%] lg:text-base lg:leading-6 hover:opacity-80 active:opacity-60 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-default-primary)] transition-opacity p-2 -m-2 cursor-pointer"
            >
              {t("legal.termsOfService")}
            </Link>
            <Link
              href="#"
              className="text-[var(--color-content-default-secondary)] font-inter text-sm leading-5 font-normal tracking-[0%] lg:text-base lg:leading-6 hover:opacity-80 active:opacity-60 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-default-primary)] transition-opacity p-2 -m-2 cursor-pointer"
            >
              {t("legal.cookiesSettings")}
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-[var(--color-content-default-secondary)] font-inter text-sm leading-5 font-normal tracking-[0%] lg:text-base lg:leading-6">
            {t("copyright")}
          </div>
        </div>
      </footer>
    </>
  );
});

Footer.displayName = "Footer";

export default Footer;
