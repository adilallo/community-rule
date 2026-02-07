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
      // Map NavSize to Figma MenuBarItem sizes
      const sizeMap: Record<NavSize, "X Small" | "Small" | "Medium" | "Large" | "X Large"> = {
        default: "Small",
        xsmall: "X Small",
        xsmallUseCases: "X Small",
        home: "X Small",
        homeMd: "Medium",
        homeUseCases: "Small",
        large: "Large",
        largeUseCases: "Large",
        homeXlarge: "X Large",
        xlarge: "X Large",
      };

      // Determine mode based on folderTop
      const mode = folderTop ? "inverse" : "default";

      return navigationItems.map((item, index) => {
        // Map size to Figma size
        let itemSize = sizeMap[size] || "Small";

        // Pass reducedPadding for "use cases" button (item with extraPadding: true)
        const isUseCases = item.extraPadding === true;

        return (
          <MenuBarItem
            key={index}
            href={item.href}
            size={itemSize}
            mode={mode}
            state={pathname === item.href ? "selected" : "default"}
            reducedPadding={isUseCases}
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
      // Map NavSize to Figma MenuBarItem sizes
      const sizeMap: Record<NavSize, "X Small" | "Small" | "Medium" | "Large" | "X Large"> = {
        default: "Small",
        xsmall: "X Small",
        xsmallUseCases: "X Small",
        home: "X Small",
        homeMd: "Medium",
        homeUseCases: "Small",
        large: "Large",
        largeUseCases: "Large",
        homeXlarge: "X Large",
        xlarge: "X Large",
      };

      // Determine mode based on folderTop and breakpoint size
      // folderTop: inverse mode (black text) for smallest breakpoints (xsmall/home)
      // folderTop: default mode (yellow text) for 640px+ breakpoints (homeMd/large/homeXlarge/xlarge)
      // false folderTop: always default mode (yellow text on dark background)
      const isSmallBreakpoint = size === "xsmall" || size === "home";
      const mode = folderTop && isSmallBreakpoint ? "inverse" : "default";

      return (
        <MenuBarItem
          href="#"
          size={sizeMap[size] || "Small"}
          mode={mode}
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
      // Use ghost type when folderTop is true, filled (default) otherwise
      const buttonType = folderTop ? "ghost" : "filled";
      const palette = "default";

      return (
        <Button
          size={buttonSize}
          buttonType={buttonType}
          palette={palette}
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
