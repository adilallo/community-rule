"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "../../contexts/MessagesContext";
import MenuBarItem from "../MenuBarItem";
import Button from "../Button";
import AvatarContainer from "../AvatarContainer";
import Avatar from "../Avatar";
import Logo from "../Logo";
import { getAssetPath, ASSETS } from "../../../lib/assetUtils";
import { HeaderView } from "./Header.view";
import type { HeaderProps, NavSize } from "./Header.types";

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
  const t = useTranslation("header");

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

  // Navigation items with translations
  const navigationItems = [
    { href: "#", text: t("navigation.useCases"), extraPadding: true },
    { href: "/learn", text: t("navigation.learn") },
    { href: "#", text: t("navigation.about") },
  ];

  const renderNavigationItems = (size: NavSize) => {
    return navigationItems.map((item, index) => (
      <MenuBarItem
        key={index}
        href={item.href}
        size={item.extraPadding && size === "xsmall" ? "xsmallUseCases" : size}
        isActive={pathname === item.href}
        ariaLabel={t("ariaLabels.navigateToPage").replace("{text}", item.text)}
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
      <MenuBarItem
        href="#"
        size={size}
        ariaLabel={t("ariaLabels.logInToAccount")}
      >
        {t("buttons.logIn")}
      </MenuBarItem>
    );
  };

  const renderCreateRuleButton = (
    buttonSize: "xsmall" | "small" | "medium" | "large" | "xlarge",
    containerSize: "small" | "medium" | "large" | "xlarge",
    avatarSize: "small" | "medium" | "large" | "xlarge",
  ) => {
    return (
      <Button size={buttonSize} ariaLabel={t("ariaLabels.createNewRule")}>
        {renderAvatarGroup(containerSize, avatarSize)}
        <span>{t("buttons.createRule")}</span>
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
      logoConfig={logoConfig}
      renderNavigationItems={renderNavigationItems}
      renderLoginButton={renderLoginButton}
      renderCreateRuleButton={renderCreateRuleButton}
      renderLogo={renderLogo}
    />
  );
});

HeaderContainer.displayName = "Header";

export default HeaderContainer;
