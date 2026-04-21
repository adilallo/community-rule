"use client";

import { memo, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthModal } from "../../../contexts/AuthModalContext";
import { useTranslation } from "../../../contexts/MessagesContext";
import MenuBarItem from "../MenuBarItem";
import Button from "../../buttons/Button";
import AvatarContainer from "../../utility/AvatarContainer";
import Avatar from "../../icons/Avatar";
import { getAssetPath, ASSETS } from "../../../../lib/assetUtils";
import { clearAnonymousCreateFlowStorage } from "../../../(app)/create/utils/anonymousDraftStorage";
import { clearCoreValueDetailsLocalStorage } from "../../../(app)/create/utils/coreValueDetailsLocalStorage";
import { TopNavView } from "./TopNav.view";
import type { TopNavProps, NavSize } from "./TopNav.types";

export const avatarImages = [
  { src: getAssetPath(ASSETS.AVATAR_1), alt: "Avatar 1" },
  { src: getAssetPath(ASSETS.AVATAR_2), alt: "Avatar 2" },
  { src: getAssetPath(ASSETS.AVATAR_3), alt: "Avatar 3" },
];

const TopNavContainer = memo<TopNavProps>(
  ({ folderTop = false, loggedIn = false, profile = false, logIn = true }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { openLogin } = useAuthModal();
    const t = useTranslation("header");

    /**
     * TopNav is hidden on `/create` routes by ConditionalNavigationClient, so
     * this button is always clicked from outside the wizard — there is no
     * mounted CreateFlowProvider to reset. Wiping the anonymous draft keys
     * here guarantees a fresh start; the provider that mounts on `/create`
     * will read empty storage. Server drafts (signed-in Save & Exit) are
     * left alone — they're intentional persistence the user opted into.
     */
    const handleCreateRuleClick = useCallback(() => {
      clearAnonymousCreateFlowStorage();
      clearCoreValueDetailsLocalStorage();
      router.push("/create");
    }, [router]);

    // Schema markup for site navigation
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "CommunityRule",
      url: "https://communityrule.com",
      ...(folderTop && {
        description: "Build operating manuals for successful communities",
      }),
      potentialAction: {
        "@type": "SearchAction",
        target: "https://communityrule.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    };

    // Logo size based on folderTop prop
    const logoSize = folderTop ? "topNavFolderTop" : "topNavHeader";

    // Navigation items with translations
    const navigationItems = [
      { href: "#", text: t("navigation.useCases"), extraPadding: true },
      { href: "/learn", text: t("navigation.learn") },
      { href: "#", text: t("navigation.about") },
    ];

    const renderNavigationItems = (size: NavSize) => {
      // Map NavSize to Figma MenuBarItem sizes
      const sizeMap: Record<
        NavSize,
        "X Small" | "Small" | "Medium" | "Large" | "X Large"
      > = {
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
            ariaLabel={t("ariaLabels.navigateToPage").replace(
              "{text}",
              item.text,
            )}
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
      const sizeMap: Record<
        NavSize,
        "X Small" | "Small" | "Medium" | "Large" | "X Large"
      > = {
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

      const label = loggedIn ? t("buttons.profile") : t("buttons.logIn");
      const ariaLabel = loggedIn
        ? t("ariaLabels.goToProfile")
        : t("ariaLabels.logInToAccount");
      const navSelected =
        (loggedIn && pathname === "/profile") ||
        (!loggedIn && pathname === "/login");

      if (loggedIn) {
        return (
          <MenuBarItem
            href="/profile"
            size={sizeMap[size] || "Small"}
            mode={mode}
            state={navSelected ? "selected" : "default"}
            ariaLabel={ariaLabel}
          >
            {label}
          </MenuBarItem>
        );
      }

      return (
        <MenuBarItem
          buttonOnClick={() =>
            openLogin({
              variant: "default",
              backdropVariant: "blurredYellow",
              nextPath: pathname || "/",
            })
          }
          href="/login"
          size={sizeMap[size] || "Small"}
          mode={mode}
          state={navSelected ? "selected" : "default"}
          ariaLabel={ariaLabel}
        >
          {label}
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
          onClick={handleCreateRuleClick}
          ariaLabel={t("ariaLabels.createNewRule")}
        >
          {renderAvatarGroup(containerSize, avatarSize)}
          <span>{t("buttons.createRule")}</span>
        </Button>
      );
    };

    return (
      <TopNavView
        folderTop={folderTop}
        loggedIn={loggedIn}
        profile={profile}
        logIn={logIn}
        schemaData={schemaData}
        logoSize={logoSize}
        renderNavigationItems={renderNavigationItems}
        renderLoginButton={renderLoginButton}
        renderCreateRuleButton={renderCreateRuleButton}
      />
    );
  },
);

TopNavContainer.displayName = "TopNav";

export default TopNavContainer;
