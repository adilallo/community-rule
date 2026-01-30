"use client";

import { memo } from "react";
import Script from "next/script";
import Logo from "../Logo";
import NavigationItem from "../NavigationItem";
import AvatarContainer from "../AvatarContainer";
import Button from "../Button";
import type { HomeHeaderViewProps } from "./HomeHeader.types";

function HomeHeaderView({
  pathname,
  schemaData,
  navigationItems,
  avatarImages,
  logoConfig,
}: HomeHeaderViewProps) {
  return (
    <>
      <Script
        id="home-header-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <header className="sticky top-0 z-50 bg-[var(--color-surface-default-primary)] border-b border-[var(--color-border-default-tertiary)]">
        <div className="max-w-[1440px] mx-auto px-[var(--spacing-scale-016)] md:px-[var(--spacing-scale-032)] lg:px-[var(--spacing-scale-064)]">
          <div className="flex items-center justify-between h-[var(--measures-sizing-064)] md:h-[var(--measures-sizing-080)]">
            <div className="flex items-center gap-[var(--spacing-scale-040)]">
              <Logo
                src={logoConfig.src}
                alt={logoConfig.alt}
                width={logoConfig.width}
                height={logoConfig.height}
              />
              <nav className="hidden md:flex items-center gap-[var(--spacing-scale-016)]">
                {navigationItems.map((item) => (
                  <NavigationItem
                    key={item.href}
                    href={item.href}
                    isActive={item.isActive}
                  >
                    {item.label}
                  </NavigationItem>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-[var(--spacing-scale-016)]">
              <AvatarContainer avatars={avatarImages} />
              <Button
                href="/learn"
                variant="primary"
                size="medium"
                className="hidden md:inline-flex"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

HomeHeaderView.displayName = "HomeHeaderView";

export default memo(HomeHeaderView);
