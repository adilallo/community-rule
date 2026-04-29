"use client";

import { memo } from "react";
import Script from "next/script";
import { useTranslation } from "../../../contexts/MessagesContext";
import { getAssetPath } from "../../../../lib/assetUtils";
import Menu from "../Menu";
import type { TopViewProps } from "./Top.types";

import Logo from "../../asset/Logo";

function TopView({
  folderTop,
  loggedIn: _loggedIn,
  profile: _profile,
  logIn,
  schemaData,
  logoSize,
  renderNavigationItems,
  renderLoginButton,
  renderCreateRuleButton,
}: TopViewProps) {
  const t = useTranslation(folderTop ? "homeHeader" : "header");

  // Render folderTop variant (HomeHeader style)
  if (folderTop) {
    return (
      <>
        <Script
          id="top-navigation-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
        <header
          className="w-full bg-transparent overflow-hidden"
          role="banner"
          aria-label={t("ariaLabels.homePageNavigationHeader")}
        >
          <nav
            className="relative flex items-center justify-between mx-auto h-[50px] sm:h-[62px] md:h-[68px] lg:h-[68px] xl:h-[88px] pl-[var(--spacing-scale-008)] pr-[var(--spacing-scale-016)] pt-[var(--spacing-scale-010)] sm:px-[var(--spacing-scale-010)] sm:pr-[var(--spacing-scale-020)] sm:pt-[var(--spacing-scale-010)] md:px-[var(--spacing-scale-016)] md:pr-[var(--spacing-scale-032)] md:pt-[var(--spacing-scale-016)] lg:pl-[var(--spacing-scale-024)] lg:pt-[var(--spacing-scale-016)] lg:pr-[var(--spacing-scale-056)] xl:pl-[var(--spacing-scale-048)] xl:pt-[var(--spacing-scale-024)] xl:pr-[var(--spacing-scale-056)]"
            role="navigation"
            aria-label={t("ariaLabels.mainNavigation")}
          >
            {/* Header Tab - Yellow tab container with decorative Union images */}
            <div className="HeaderTab header-breakpoint-transition relative bg-[var(--color-surface-inverse-brand-primary)] rounded-tl-[var(--radius-measures-radius-medium)] rounded-tr-[var(--radius-measures-radius-medium)] sm:rounded-t-[var(--radius-measures-radius-xlarge)] md:rounded-t-[var(--radius-measures-radius-xlarge)] lg:rounded-t-[var(--radius-measures-radius-xlarge)] xl:rounded-t-[var(--radius-measures-radius-xlarge)] pl-[var(--spacing-scale-012)] pr-[var(--spacing-scale-048)] h-[var(--spacing-scale-040)] sm:pl-[var(--spacing-scale-012)] sm:h-[52px] sm:pr-[var(--spacing-scale-006)] md:h-[52px] md:pl-[var(--spacing-scale-024)] md:pr-[var(--spacing-scale-012)] lg:h-[52px] lg:pl-[var(--spacing-scale-024)] lg:pr-[var(--spacing-scale-048)] xl:h-[64px] xl:pl-[var(--spacing-scale-032)] xl:pr-[var(--spacing-scale-120)] md:gap-[var(--spacing-scale-032)] flex-1 min-w-0 min-w-[197px] sm:min-w-0 sm:mr-[var(--spacing-scale-008)] md:mr-[185px] lg:mr-[var(--spacing-scale-024)] xl:mr-[var(--spacing-scale-032)] flex items-center self-end">
              {/* Logo - Consistent left positioning within HeaderTab */}
              <Logo
                size={logoSize}
                wordmark
                palette={folderTop ? "inverse" : "default"}
              />

              {/* XSmall menu — positioned next to logo */}
              <div className="block sm:hidden -me-[2px]">
                <Menu size="X Small">
                  {renderNavigationItems("xsmall")}
                  {logIn && renderLoginButton("xsmall")}
                </Menu>
              </div>

              {/* Decorative Union images for tab appearance */}
              {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG, not content */}
              <img
                src={getAssetPath("assets/Union_xsm.svg")}
                alt=""
                role="presentation"
                className="absolute -bottom-[3px] -right-[52px] w-[61px] h-[24px] sm:w-[61px] sm:h-[31.5px] sm:hidden -z-10"
              />
              {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG */}
              <img
                src={getAssetPath("assets/Union_sm_md_lg.svg")}
                alt=""
                role="presentation"
                className="absolute -bottom-[3.7px] -right-[53px] w-[61px] h-[24px] sm:w-[61px] sm:h-[31.5px] hidden sm:block xl:hidden -z-10"
              />
              {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG */}
              <img
                src={getAssetPath("assets/Union_xlg.svg")}
                alt=""
                role="presentation"
                className="absolute -bottom-[6px] -right-[94px] w-[105px] h-[53px] hidden xl:block -z-10"
              />
            </div>

            {/* Navigation Links - Centered in header for SM and up */}
            <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
              {/* 430-639px (sm: breakpoint): Menu X Small */}
              <div className="hidden sm:block md:hidden">
                <Menu size="X Small">
                  {renderNavigationItems("xsmall")}
                  {logIn && renderLoginButton("xsmall")}
                </Menu>
              </div>

              {/* 640-1023px (md: breakpoint): Menu Small */}
              <div className="hidden md:block lg:hidden">
                <Menu size="Small">
                  {renderNavigationItems("homeMd")}
                </Menu>
              </div>

              {/* 1024-1440px (lg: breakpoint): Menu Large */}
              <div className="hidden lg:block xl:hidden">
                <Menu size="Large">{renderNavigationItems("large")}</Menu>
              </div>

              {/* 1440px+ (xl: breakpoint): Menu X Large */}
              <div className="hidden xl:block">
                <Menu size="X Large">
                  {renderNavigationItems("homeXlarge")}
                </Menu>
              </div>
            </div>

            {/* Authentication Elements - Consistent right alignment outside HeaderTab */}
            <div className="flex items-center">
              {/* XSmall and Small breakpoints - create rule button outside HeaderTab */}
              <div className="block md:hidden">
                {renderCreateRuleButton("xsmall", "small", "small")}
              </div>

              {/* Medium breakpoint - login outside HeaderTab, create rule outside */}
              <div className="hidden md:block lg:hidden absolute right-[var(--spacing-measures-spacing-016)]">
                <div className="flex items-center gap-[var(--spacing-scale-010)]">
                  {logIn && renderLoginButton("homeMd")}
                  {renderCreateRuleButton("small", "medium", "medium")}
                </div>
              </div>

              {/* Large breakpoint */}
              <div className="hidden lg:flex xl:hidden items-center">
                <div className="flex items-center gap-[var(--spacing-scale-004)]">
                  {logIn && renderLoginButton("large")}
                  {renderCreateRuleButton("large", "large", "large")}
                </div>
              </div>

              {/* XLarge breakpoint */}
              <div className="hidden xl:flex items-center">
                <div className="flex items-center gap-[var(--spacing-scale-004)]">
                  {logIn && renderLoginButton("homeXlarge")}
                  {renderCreateRuleButton("xlarge", "xlarge", "xlarge")}
                </div>
              </div>
            </div>
          </nav>
        </header>
      </>
    );
  }

  /**
   * Standard marketing / app top nav.
   * Figma: "Navigation / Top" (Community-Rule-System, node 22078-808559) — horizontal
   * padding, logo ~200px left, menu cluster centered in the bar (`left-1/2` + translate),
   * log in + create rule on the right. Breakpoints and Menu sizes unchanged from prior map.
   */
  // Render standard variant (Header style)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <header
        className="relative z-50 w-full border-b border-[var(--border-color-default-tertiary)] bg-[var(--color-surface-default-primary)]"
        role="banner"
        aria-label={t("ariaLabels.mainNavigationHeader")}
      >
        <nav
            className="relative flex w-full items-center
            px-[var(--spacing-scale-016)]
            py-[var(--spacing-scale-016)]
            sm:px-[var(--spacing-measures-spacing-016)]
            sm:py-[var(--spacing-scale-016)]
            lg:px-[var(--spacing-measures-spacing-64,64px)]
            lg:py-[var(--spacing-scale-016)]
            xl:py-[var(--spacing-scale-016)]
            min-h-[var(--spacing-scale-040)]"
            role="navigation"
            aria-label={t("ariaLabels.mainNavigation")}
        >
          <div
            className="relative z-20 min-w-0 shrink-0 sm:w-[200px] sm:max-w-[200px] sm:shrink-0"
            data-top="logo"
          >
            <Logo
              size={logoSize}
              wordmark
              palette={folderTop ? "inverse" : "default"}
            />
          </div>

          {/* XSmall: nav + login in flow (flex-1) — same as before */}
          <div
            className="flex min-w-0 flex-1 items-center justify-end sm:hidden"
            data-top="nav-xs-flow"
          >
            <div className="block" data-testid="nav-xs">
              <Menu size="X Small">
                {renderNavigationItems("xsmall")}
                {logIn && renderLoginButton("xsmall")}
              </Menu>
            </div>
          </div>

          {/* sm+ — Figma: nav cluster centered in bar (not between logo and actions) */}
          <div
            className="pointer-events-none hidden sm:absolute sm:left-1/2 sm:top-1/2 sm:z-10 sm:flex sm:-translate-x-1/2 sm:-translate-y-1/2 sm:items-center sm:justify-center"
            data-top="nav-center"
          >
            <div
              className="pointer-events-auto hidden sm:flex md:hidden"
              data-testid="nav-sm"
            >
              <Menu size="X Small">
                {renderNavigationItems("xsmall")}
                {logIn && renderLoginButton("xsmall")}
              </Menu>
            </div>
            <div
              className="pointer-events-auto hidden md:flex lg:hidden"
              data-testid="nav-md"
            >
              <Menu size="X Small">
                {renderNavigationItems("xsmall")}
              </Menu>
            </div>
            <div
              className="pointer-events-auto hidden lg:flex xl:hidden"
              data-testid="nav-lg"
            >
              <Menu size="Large">{renderNavigationItems("large")}</Menu>
            </div>
            <div
              className="pointer-events-auto hidden xl:flex"
              data-testid="nav-xl"
            >
              <Menu size="X Large">
                {renderNavigationItems("xlarge")}
              </Menu>
            </div>
          </div>

          {/* Authentication Elements - Consistent right alignment across all breakpoints */}
          <div className="relative z-20 ml-auto flex shrink-0 items-center">
            {/* XSmall breakpoint - Only Create Rule button */}
            <div className="block sm:hidden shrink-0" data-testid="auth-xs">
              {renderCreateRuleButton("xsmall", "small", "small")}
            </div>

            {/* Small breakpoint - Only Create Rule button */}
            <div className="hidden sm:block md:hidden" data-testid="auth-sm">
              <div className="flex items-center gap-[var(--spacing-scale-004)]">
                {renderCreateRuleButton("xsmall", "small", "small")}
              </div>
            </div>

            {/* Medium breakpoint */}
            <div className="hidden md:block lg:hidden" data-testid="auth-md">
              <div className="flex items-center gap-[var(--spacing-measures-spacing-010)]">
                <Menu size="Small">
                  {logIn && renderLoginButton("xsmall")}
                </Menu>
                {renderCreateRuleButton("xsmall", "medium", "medium")}
              </div>
            </div>

            {/* Large breakpoint */}
            <div className="hidden lg:block xl:hidden" data-testid="auth-lg">
              <div className="flex items-center gap-[var(--spacing-measures-spacing-004)]">
                <Menu size="Large">
                  {logIn && renderLoginButton("large")}
                </Menu>
                {renderCreateRuleButton("large", "xlarge", "xlarge")}
              </div>
            </div>

            {/* XLarge breakpoint */}
            <div className="hidden xl:block" data-testid="auth-xl">
              <div className="flex items-center gap-[var(--spacing-measures-spacing-004)]">
                <Menu size="X Large">
                  {logIn && renderLoginButton("xlarge")}
                </Menu>
                {renderCreateRuleButton("xlarge", "xlarge", "xlarge")}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

TopView.displayName = "TopView";

export default memo(TopView);
export { TopView };
