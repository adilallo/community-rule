"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";
import MenuBarItem from "../MenuBarItem";
import Button from "../Button";
import AvatarContainer from "../AvatarContainer";
import Avatar from "../Avatar";
import Logo from "../Logo";
import { getAssetPath, ASSETS } from "../../../lib/assetUtils";
import { HeaderView } from "./Header.view";
import type { HeaderProps, NavSize } from "./Header.types";

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
  { breakpoint: "block sm:hidden", size: "header" as const, showText: false },
  {
    breakpoint: "hidden sm:block md:hidden",
    size: "header" as const,
    showText: true,
  },
  {
    breakpoint: "hidden md:block lg:hidden",
    size: "headerMd" as const,
    showText: true,
  },
  {
    breakpoint: "hidden lg:block xl:hidden",
    size: "headerLg" as const,
    showText: true,
  },
  { breakpoint: "hidden xl:block", size: "headerXl" as const, showText: true },
];

const HeaderContainer = memo<HeaderProps>(() => {
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

  const renderNavigationItems = (size: NavSize) => {
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

  const renderAvatarGroup = (
    containerSize: "small" | "medium" | "large" | "xlarge",
    avatarSize: "small" | "medium" | "large" | "xlarge",
  ) => {
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

  const renderLoginButton = (size: NavSize) => {
    return (
      <MenuBarItem href="#" size={size} ariaLabel="Log in to your account">
        Log in
      </MenuBarItem>
    );
  };

  const renderCreateRuleButton = (
    buttonSize: "xsmall" | "small" | "medium" | "large" | "xlarge",
    containerSize: "small" | "medium" | "large" | "xlarge",
    avatarSize: "small" | "medium" | "large" | "xlarge",
  ) => {
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

  const renderLogo = (
    size:
      | "default"
      | "homeHeaderXsmall"
      | "homeHeaderSm"
      | "homeHeaderMd"
      | "homeHeaderLg"
      | "homeHeaderXl"
      | "header"
      | "headerMd"
      | "headerLg"
      | "headerXl"
      | "footer"
      | "footerLg",
    showText: boolean,
  ) => {
    return <Logo size={size} showText={showText} />;
  };

  return (
    <HeaderView
      schemaData={schemaData}
      navigationItems={navigationItems}
      avatarImages={avatarImages}
      logoConfig={logoConfig}
      pathname={pathname}
      renderNavigationItems={renderNavigationItems}
      renderAvatarGroup={renderAvatarGroup}
      renderLoginButton={renderLoginButton}
      renderCreateRuleButton={renderCreateRuleButton}
      renderLogo={renderLogo}
    />
  );
});

HeaderContainer.displayName = "Header";

export default HeaderContainer;
