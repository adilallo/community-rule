"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "../../../contexts/MessagesContext";
import MenuBarItem from "../MenuBarItem";
import Button from "../../buttons/Button";
import AvatarContainer from "../../utility/AvatarContainer";
import Avatar from "../../icons/Avatar";
import Logo from "../../icons/Logo";
import { getAssetPath, ASSETS } from "../../../../lib/assetUtils";
import { TopNavView } from "./TopNav.view";
import type { TopNavProps, NavSize } from "./TopNav.types";

export const avatarImages = [
  { src: getAssetPath(ASSETS.AVATAR_1), alt: "Avatar 1" },
  { src: getAssetPath(ASSETS.AVATAR_2), alt: "Avatar 2" },
  { src: getAssetPath(ASSETS.AVATAR_3), alt: "Avatar 3" },
];

const TopNavContainer = memo<TopNavProps>(
  ({
    folderTop = false,
    loggedIn = false,
    profile = false,
    logIn = true,
  }) => {
    const pathname = usePathname();
    const t = useTranslation("header");

    // Schema markup for site navigation
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "CommunityRule",
      url: "https://communityrule.com",
      ...(folderTop && { description: "Build operating manuals for successful communities" }),
      potentialAction: {
        "@type": "SearchAction",
        target: "https://communityrule.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    };

    // Logo configuration based on folderTop prop
    const logoConfig = folderTop
      ? [
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
        ]
      : [
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

    // Navigation items with translations
    const navigationItems = [
      { href: "#", text: t("navigation.useCases"), extraPadding: true },
      { href: "/learn", text: t("navigation.learn") },
      { href: "#", text: t("navigation.about") },
    ];

    const renderNavigationItems = (size: NavSize) => {
      return navigationItems.map((item, index) => {
        // Determine size based on folderTop and item properties
        let itemSize: NavSize = size;
        if (item.extraPadding) {
          if (folderTop) {
            if (
              size === "xsmall" ||
              size === "default" ||
              size === "home" ||
              size === "homeMd" ||
              size === "large" ||
              size === "homeXlarge"
            ) {
              itemSize =
                size === "home" || size === "homeMd"
                  ? "homeMd"
                  : size === "large"
                    ? "large"
                    : size === "homeXlarge"
                      ? "homeXlarge"
                      : "xsmallUseCases";
            }
          } else {
            if (size === "xsmall") {
              itemSize = "xsmallUseCases";
            }
          }
        }

        // Determine variant based on folderTop
        const variant = folderTop
          ? size === "xsmall" ||
              size === "default" ||
              size === "home" ||
              size === "homeMd" ||
              size === "large" ||
              size === "homeXlarge"
            ? "home"
            : "default"
          : "default";

        return (
          <MenuBarItem
            key={index}
            href={item.href}
            size={itemSize}
            variant={variant}
            isActive={pathname === item.href}
            ariaLabel={t("ariaLabels.navigateToPage").replace("{text}", item.text)}
          >
            {item.text}
          </MenuBarItem>
        );
      });
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
      // Determine variant based on folderTop
      const variant = folderTop
        ? size === "xsmall" || size === "default"
          ? "home"
          : "default"
        : "default";

      return (
        <MenuBarItem
          href="#"
          size={size}
          variant={variant}
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
      // Use ghost variant when folderTop is true, standard otherwise
      const variant = folderTop ? "ghost" : undefined;

      return (
        <Button
          size={buttonSize}
          variant={variant}
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
      <TopNavView
        folderTop={folderTop}
        loggedIn={loggedIn}
        profile={profile}
        logIn={logIn}
        schemaData={schemaData}
        logoConfig={logoConfig}
        renderNavigationItems={renderNavigationItems}
        renderLoginButton={renderLoginButton}
        renderCreateRuleButton={renderCreateRuleButton}
        renderLogo={renderLogo}
      />
    );
  },
);

TopNavContainer.displayName = "TopNav";

export default TopNavContainer;
