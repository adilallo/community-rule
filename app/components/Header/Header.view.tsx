"use client";

import { useTranslation } from "../../contexts/MessagesContext";
import MenuBar from "../MenuBar";
import type { HeaderViewProps } from "./Header.types";

export function HeaderView({
  schemaData,
  logoConfig,
  renderNavigationItems,
  renderLoginButton,
  renderCreateRuleButton,
  renderLogo,
}: HeaderViewProps) {
  const t = useTranslation("header");

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
          className="flex items-center justify-between mx-auto h-[40px] lg:h-[84px] xl:h-[88px] px-[var(--spacing-measures-spacing-016)] py-[var(--spacing-measures-spacing-008)] lg:px-[var(--spacing-measures-spacing-64,64px)] lg:py-[var(--spacing-measures-spacing-016,16px)]"
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
          <div className="flex items-center">
            {/* XSmall breakpoint - Navigation items moved to right section */}
            <div className="block sm:hidden" data-testid="nav-xs">
              {/* Empty for XSmall - navigation moved to right */}
            </div>

            {/* Small breakpoint - All items grouped together, centered */}
            <div className="hidden sm:block md:hidden" data-testid="nav-sm">
              <MenuBar size="default">
                {renderNavigationItems("xsmall")}
                {renderLoginButton("xsmall")}
              </MenuBar>
            </div>

            <div className="hidden md:block lg:hidden" data-testid="nav-md">
              <MenuBar size="default">
                {renderNavigationItems("xsmall")}
              </MenuBar>
            </div>

            <div className="hidden lg:block xl:hidden" data-testid="nav-lg">
              <MenuBar size="large">{renderNavigationItems("large")}</MenuBar>
            </div>

            <div className="hidden xl:block" data-testid="nav-xl">
              <MenuBar size="large">{renderNavigationItems("xlarge")}</MenuBar>
            </div>
          </div>

          {/* Authentication Elements - Consistent right alignment across all breakpoints */}
          <div className="flex items-center">
            {/* XSmall breakpoint - All navigation items + Create Rule button */}
            <div className="block sm:hidden" data-testid="auth-xs">
              <div className="flex items-center gap-[var(--spacing-scale-001)]">
                <MenuBar size="default">
                  {renderNavigationItems("xsmall")}
                  {renderLoginButton("xsmall")}
                </MenuBar>
                {renderCreateRuleButton("xsmall", "small", "small")}
              </div>
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
                <MenuBar size="default">{renderLoginButton("xsmall")}</MenuBar>
                {renderCreateRuleButton("xsmall", "medium", "medium")}
              </div>
            </div>

            {/* Large breakpoint */}
            <div className="hidden lg:block xl:hidden" data-testid="auth-lg">
              <div className="flex items-center gap-[var(--spacing-measures-spacing-004)]">
                <MenuBar size="large">{renderLoginButton("large")}</MenuBar>
                {renderCreateRuleButton("large", "xlarge", "xlarge")}
              </div>
            </div>

            {/* XLarge breakpoint */}
            <div className="hidden xl:block" data-testid="auth-xl">
              <div className="flex items-center gap-[var(--spacing-measures-spacing-004)]">
                <MenuBar size="large">{renderLoginButton("xlarge")}</MenuBar>
                {renderCreateRuleButton("xlarge", "xlarge", "xlarge")}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
