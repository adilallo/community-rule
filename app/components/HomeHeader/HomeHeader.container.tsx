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
import HomeHeaderView from "./HomeHeader.view";
import type { HomeHeaderProps, NavSize } from "./HomeHeader.types";

export const avatarImages = [
  { src: getAssetPath(ASSETS.AVATAR_1), alt: "Avatar 1" },
  { src: getAssetPath(ASSETS.AVATAR_2), alt: "Avatar 2" },
  { src: getAssetPath(ASSETS.AVATAR_3), alt: "Avatar 3" },
];

export const logoConfig = [
  {
    breakpoint: "block sm:hidden",
    size: "homeHeaderXsmall" as const,
    showText: false,
  },
  {
    breakpoint: "hidden sm:block md:hidden",
    size: "homeHeaderSm" as const,
    showText: true,
  },
  {
    breakpoint: "hidden md:block lg:hidden",
    size: "homeHeaderMd" as const,
    showText: true,
  },
  {
    breakpoint: "hidden lg:block xl:hidden",
    size: "homeHeaderLg" as const,
    showText: true,
  },
  {
    breakpoint: "hidden xl:block",
    size: "homeHeaderXl" as const,
    showText: true,
  },
];

const HomeHeaderContainer = memo<HomeHeaderProps>(() => {
  const pathname = usePathname();
  const t = useTranslation("header");

  // Schema markup for site navigation (home page specific)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CommunityRule",
    url: "https://communityrule.com",
    description: "Build operating manuals for successful communities",
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
        size={
          item.extraPadding &&
          (size === "xsmall" ||
            size === "default" ||
            size === "home" ||
            size === "homeMd" ||
            size === "large" ||
            size === "homeXlarge")
            ? size === "home" || size === "homeMd"
              ? "homeMd"
              : size === "large"
                ? "large"
                : size === "homeXlarge"
                  ? "homeXlarge"
                  : "xsmallUseCases"
            : size
        }
        variant={
          size === "xsmall" ||
          size === "default" ||
          size === "home" ||
          size === "homeMd" ||
          size === "large" ||
          size === "homeXlarge"
            ? "home"
            : "default"
        }
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
        variant={size === "xsmall" || size === "default" ? "home" : "default"}
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
      <Button
        size={buttonSize}
        variant="ghost"
        ariaLabel={t("ariaLabels.createNewRule")}
      >
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
    <HomeHeaderView
      schemaData={schemaData}
      logoConfig={logoConfig}
      renderNavigationItems={renderNavigationItems}
      renderLoginButton={renderLoginButton}
      renderCreateRuleButton={renderCreateRuleButton}
      renderLogo={renderLogo}
    />
  );
});

HomeHeaderContainer.displayName = "HomeHeader";

export default HomeHeaderContainer;
