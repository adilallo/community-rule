"use client";

import { memo } from "react";
import Script from "next/script";
import { useTranslation } from "../../../contexts/MessagesContext";
import { getAssetPath } from "../../../../lib/assetUtils";
import MenuBar from "../MenuBar";
import type { TopNavViewProps } from "./TopNav.types";

function TopNavView({
  folderTop,
  loggedIn: _loggedIn,
  profile: _profile,
  logIn,
  schemaData,
  logoConfig,
  renderNavigationItems,
  renderLoginButton,
  renderCreateRuleButton,
  renderLogo,
}: TopNavViewProps) {
  const t = useTranslation(folderTop ? "homeHeader" : "header");

  // Render folderTop variant (HomeHeader style)
  if (folderTop) {
    return (
      <>
        <Script
          id="top-nav-schema"
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
              <div>
                {logoConfig.map((config, index) => (
                  <div key={index} className={config.breakpoint}>
                    {renderLogo(config.size, config.showText)}
                  </div>
                ))}
              </div>

              {/* XSmall menu bar - positioned next to logo */}
              <div className="block sm:hidden -me-[2px]">
                <MenuBar size="X Small">
                  {renderNavigationItems("xsmall")}
                  {logIn && renderLoginButton("xsmall")}
                </MenuBar>
              </div>

              {/* Decorative Union images for tab appearance */}
              <img
                src={getAssetPath("assets/Union_xsm.svg")}
                alt=""
                role="presentation"
                className="absolute -bottom-[3px] -right-[52px] w-[61px] h-[24px] sm:w-[61px] sm:h-[31.5px] sm:hidden -z-10"
              />
              <img
                src={getAssetPath("assets/Union_sm_md_lg.svg")}
                alt=""
                role="presentation"
                className="absolute -bottom-[3.7px] -right-[53px] w-[61px] h-[24px] sm:w-[61px] sm:h-[31.5px] hidden sm:block xl:hidden -z-10"
              />
              <img
                src={getAssetPath("assets/Union_xlg.svg")}
                alt=""
                role="presentation"
                className="absolute -bottom-[6px] -right-[94px] w-[105px] h-[53px] hidden xl:block -z-10"
              />
            </div>

            {/* Navigation Links - Centered in header for SM and up */}
            <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
              {/* 430-639px (sm: breakpoint): MenuBar X Small */}
              <div className="hidden sm:block md:hidden">
                <MenuBar size="X Small">
                  {renderNavigationItems("xsmall")}
                  {logIn && renderLoginButton("xsmall")}
                </MenuBar>
              </div>

              {/* 640-1023px (md: breakpoint): MenuBar Small */}
              <div className="hidden md:block lg:hidden">
                <MenuBar size="Small">{renderNavigationItems("homeMd")}</MenuBar>
              </div>

              {/* 1024-1440px (lg: breakpoint): MenuBar Large */}
              <div className="hidden lg:block xl:hidden">
                <MenuBar size="Large">{renderNavigationItems("large")}</MenuBar>
              </div>

              {/* 1440px+ (xl: breakpoint): MenuBar X Large */}
              <div className="hidden xl:block">
                <MenuBar size="X Large">
                  {renderNavigationItems("homeXlarge")}
                </MenuBar>
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

  // Render standard variant (Header style)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <header
        className="sticky top-0 z-50 bg-[var(--color-surface-default-primary)] w-full border-b border-[var(--border-color-default-tertiary)]"
        role="banner"
        aria-label={t("ariaLabels.mainNavigationHeader")}
      >
        <nav
          className="flex items-center gap-[var(--spacing-scale-002)] sm:justify-between mx-auto h-[var(--spacing-scale-040)] lg:h-[84px] xl:h-[88px] px-[var(--spacing-scale-016)] py-[var(--spacing-scale-008)] sm:px-[var(--spacing-measures-spacing-016)] sm:py-[var(--spacing-measures-spacing-008)] lg:px-[var(--spacing-measures-spacing-64,64px)] lg:py-[var(--spacing-measures-spacing-016,16px)] sm:gap-0"
          role="navigation"
          aria-label={t("ariaLabels.mainNavigation")}
        >
          {/* Logo - Consistent left positioning across all breakpoints */}
          <div className="flex items-center">
            {logoConfig.map((config, index) => (
              <div
                key={index}
                className={config.breakpoint}
                data-testid="logo-wrapper"
              >
                {renderLogo(config.size, config.showText)}
              </div>
            ))}
          </div>

          {/* Navigation Links - Consistent center positioning */}
          <div className="flex items-center flex-1 justify-end sm:flex-none sm:justify-center">
            {/* XSmall breakpoint - Navigation items in Actions section (flex-1, justify-end) */}
            <div className="block sm:hidden" data-testid="nav-xs">
              <MenuBar size="X Small">
                {renderNavigationItems("xsmall")}
                {logIn && renderLoginButton("xsmall")}
              </MenuBar>
            </div>

            {/* 430-639px (sm: breakpoint): MenuBar X Small */}
            <div className="hidden sm:block md:hidden" data-testid="nav-sm">
              <MenuBar size="X Small">
                {renderNavigationItems("xsmall")}
                {logIn && renderLoginButton("xsmall")}
              </MenuBar>
            </div>

            {/* 640-1023px (md: breakpoint): MenuBar X Small (different from folderTop=true) */}
            <div className="hidden md:block lg:hidden" data-testid="nav-md">
              <MenuBar size="X Small">
                {renderNavigationItems("xsmall")}
              </MenuBar>
            </div>

            <div className="hidden lg:block xl:hidden" data-testid="nav-lg">
              <MenuBar size="Large">{renderNavigationItems("large")}</MenuBar>
            </div>

            <div className="hidden xl:block" data-testid="nav-xl">
              <MenuBar size="X Large">{renderNavigationItems("xlarge")}</MenuBar>
            </div>
          </div>

          {/* Authentication Elements - Consistent right alignment across all breakpoints */}
          <div className="flex items-center shrink-0">
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
                <MenuBar size="Small">
                  {logIn && renderLoginButton("xsmall")}
                </MenuBar>
                {renderCreateRuleButton("xsmall", "medium", "medium")}
              </div>
            </div>

            {/* Large breakpoint */}
            <div className="hidden lg:block xl:hidden" data-testid="auth-lg">
              <div className="flex items-center gap-[var(--spacing-measures-spacing-004)]">
                <MenuBar size="Large">
                  {logIn && renderLoginButton("large")}
                </MenuBar>
                {renderCreateRuleButton("large", "xlarge", "xlarge")}
              </div>
            </div>

            {/* XLarge breakpoint */}
            <div className="hidden xl:block" data-testid="auth-xl">
              <div className="flex items-center gap-[var(--spacing-measures-spacing-004)]">
                <MenuBar size="X Large">
                  {logIn && renderLoginButton("xlarge")}
                </MenuBar>
                {renderCreateRuleButton("xlarge", "xlarge", "xlarge")}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

TopNavView.displayName = "TopNavView";

export default memo(TopNavView);
export { TopNavView };
