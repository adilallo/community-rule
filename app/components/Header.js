"use client";

import { usePathname } from "next/navigation";
import Logo from "./Logo";
import MenuBar from "./MenuBar";
import MenuBarItem from "./MenuBarItem";
import Button from "./Button";
import AvatarContainer from "./AvatarContainer";
import Avatar from "./Avatar";
import { getAssetPath, ASSETS } from "../../lib/assetUtils";

// Configuration data for testing
export const navigationItems = [
  { href: "#", text: "Use cases", extraPadding: true },
  { href: "/learn", text: "Learn" },
  { href: "#", text: "About" },
];

export const avatarImages = [
  { src: getAssetPath(ASSETS.AVATAR_1), alt: "Avatar 1" },
  { src: getAssetPath(ASSETS.AVATAR_2), alt: "Avatar 2" },
  { src: getAssetPath(ASSETS.AVATAR_3), alt: "Avatar 3" },
];

export const logoConfig = [
  { breakpoint: "block sm:hidden", size: "header", showText: false },
  { breakpoint: "hidden sm:block md:hidden", size: "header", showText: true },
  {
    breakpoint: "hidden md:block lg:hidden",
    size: "headerMd",
    showText: true,
  },
  {
    breakpoint: "hidden lg:block xl:hidden",
    size: "headerLg",
    showText: true,
  },
  { breakpoint: "hidden xl:block", size: "headerXl", showText: true },
];

export default function Header() {
  const pathname = usePathname();

  // Schema markup for site navigation
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CommunityRule",
    url: "https://communityrule.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://communityrule.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const renderNavigationItems = (size) => {
    return navigationItems.map((item, index) => (
      <MenuBarItem
        key={index}
        href={item.href}
        size={item.extraPadding && size === "xsmall" ? "xsmallUseCases" : size}
        isActive={pathname === item.href}
        ariaLabel={`Navigate to ${item.text} page`}
      >
        {item.text}
      </MenuBarItem>
    ));
  };

  const renderAvatarGroup = (containerSize, avatarSize) => {
    return (
      <AvatarContainer size={containerSize}>
        {avatarImages.map((avatar, index) => (
          <Avatar
            key={index}
            src={avatar.src}
            alt={avatar.alt}
            size={avatarSize}
          />
        ))}
      </AvatarContainer>
    );
  };

  const renderLoginButton = (size) => {
    return (
      <MenuBarItem href="#" size={size} ariaLabel="Log in to your account">
        Log in
      </MenuBarItem>
    );
  };

  const renderCreateRuleButton = (buttonSize, containerSize, avatarSize) => {
    return (
      <Button
        size={buttonSize}
        ariaLabel="Create a new rule with avatar decoration"
      >
        {renderAvatarGroup(containerSize, avatarSize)}
        <span>Create rule</span>
      </Button>
    );
  };

  const renderLogo = (size, showText) => {
    return <Logo size={size} showText={showText} />;
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <header
        className="sticky top-0 z-50 bg-[var(--color-surface-default-primary)] w-full border-b border-[var(--border-color-default-tertiary)]"
        role="banner"
        aria-label="Main navigation header"
      >
        <nav
          className="flex items-center justify-between mx-auto h-[40px] lg:h-[84px] xl:h-[88px] px-[var(--spacing-measures-spacing-016)] py-[var(--spacing-measures-spacing-008)] lg:px-[var(--spacing-measures-spacing-64,64px)] lg:py-[var(--spacing-measures-spacing-016,16px)]"
          role="navigation"
          aria-label="Main navigation"
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
