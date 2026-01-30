"use client";

import { memo } from "react";
import Script from "next/script";
import Logo from "../Logo";
import HeaderTab from "../HeaderTab";
import MenuBar from "../MenuBar";
import MenuBarItem from "../MenuBarItem";
import Button from "../Button";
import AvatarContainer from "../AvatarContainer";
import Avatar from "../Avatar";
import type { HomeHeaderViewProps } from "./HomeHeader.types";

function HomeHeaderView({
  pathname,
  schemaData,
  navigationItems,
  avatarImages,
  logoConfig,
  renderNavigationItems,
  renderAvatarGroup,
  renderLoginButton,
  renderCreateRuleButton,
  renderLogo,
}: HomeHeaderViewProps) {
  return (
    <>
      <Script
        id="home-header-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <header
        className="w-full bg-transparent overflow-hidden"
        role="banner"
        aria-label="Home page navigation header"
      >
        <nav
          className="relative flex items-center justify-between mx-auto h-[50px] sm:h-[62px] md:h-[68px] lg:h-[68px] xl:h-[88px] px-[var(--spacing-scale-008)] pr-[var(--spacing-scale-016)] pt-[var(--spacing-scale-010)] sm:px-[var(--spacing-scale-010)] sm:pr-[var(--spacing-scale-020)] sm:pt-[var(--spacing-scale-010)] md:px-[var(--spacing-scale-016)] md:pr-[var(--spacing-scale-032)] md:pt-[var(--spacing-scale-016)] lg:pl-[var(--spacing-scale-024)] lg:pt-[var(--spacing-scale-016)] lg:pr-[var(--spacing-scale-056)] xl:pl-[var(--spacing-scale-048)] xl:pt-[var(--spacing-scale-024)] xl:pr-[var(--spacing-scale-056)]"
          role="navigation"
          aria-label="Main navigation"
        >
          <HeaderTab className="flex items-center self-end" stretch={true}>
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
              <MenuBar size="default">
                {renderNavigationItems("xsmall")}
                {renderLoginButton("xsmall")}
              </MenuBar>
            </div>
          </HeaderTab>

          {/* Navigation Links - Centered in header for SM and up */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
            <div className="hidden sm:block md:hidden">
              <MenuBar size="default">
                {renderNavigationItems("xsmall")}
                {renderLoginButton("xsmall")}
              </MenuBar>
            </div>

            <div className="hidden md:block lg:hidden">
              <MenuBar size="medium">{renderNavigationItems("homeMd")}</MenuBar>
            </div>

            <div className="hidden lg:block xl:hidden">
              <MenuBar size="large">{renderNavigationItems("large")}</MenuBar>
            </div>

            <div className="hidden xl:block">
              <MenuBar size="large">
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
                {renderLoginButton("homeMd")}
                {renderCreateRuleButton("small", "medium", "medium")}
              </div>
            </div>

            {/* Large breakpoint */}
            <div className="hidden lg:flex xl:hidden items-center">
              <div className="flex items-center gap-[var(--spacing-scale-004)]">
                {renderLoginButton("large")}
                {renderCreateRuleButton("large", "large", "large")}
              </div>
            </div>

            {/* XLarge breakpoint */}
            <div className="hidden xl:flex items-center">
              <div className="flex items-center gap-[var(--spacing-scale-004)]">
                {renderLoginButton("homeXlarge")}
                {renderCreateRuleButton("xlarge", "xlarge", "xlarge")}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

HomeHeaderView.displayName = "HomeHeaderView";

export default memo(HomeHeaderView);
