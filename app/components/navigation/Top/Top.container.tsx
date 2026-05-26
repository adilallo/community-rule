"use client";

/**
 * Figma: "Navigation / Top" (22078-808559)
 */

import { memo, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthModal } from "../../../contexts/AuthModalContext";
import { useTranslation } from "../../../contexts/MessagesContext";
import MenuItem from "../MenuItem";
import Button from "../../buttons/Button";
import AvatarContainer from "../../asset/AvatarContainer";
import Avatar from "../../asset/Avatar";
import { getAssetPath, ASSETS } from "../../../../lib/assetUtils";
import { prepareFreshCreateFlowEntrySync } from "../../../(app)/create/utils/prepareFreshCreateFlowEntry";
import { TopView } from "./Top.view";
import type { TopProps, NavSize } from "./Top.types";

type MenuClusterSize = "X Small" | "Small" | "Medium" | "Large" | "X Large";

/** Map responsive `NavSize` breakpoints to Figma menu item sizes (shared by nav links + login). */
const NAV_SIZE_TO_MENU_ITEM_SIZE: Record<NavSize, MenuClusterSize> = {
  xsmall: "X Small",
  homeMd: "Medium",
  large: "Large",
  homeXlarge: "X Large",
  xlarge: "X Large",
};

export const avatarImageSources = [
  getAssetPath(ASSETS.AVATAR_3),
  getAssetPath(ASSETS.AVATAR_2),
  getAssetPath(ASSETS.AVATAR_1),
] as const;

/** @deprecated Use `avatarImageSources` — alts are resolved in `TopContainer` via `topNav` messages. */
export const avatarImages = avatarImageSources.map((src, index) => ({
  src,
  alt: `Avatar ${3 - index}`,
}));

const TopContainer = memo<TopProps>(
  ({ folderTop = false, loggedIn = false, profile = false, logIn = true }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { openLogin } = useAuthModal();
    const t = useTranslation("header");
    const tTopNav = useTranslation("topNav");

    /**
     * `Top` is hidden on `/create` routes by ConditionalNavigationClient, so
     * this button is always clicked from outside the wizard. Clears anonymous
     * `localStorage` synchronously and, when backend sync is on, fires the
     * server `DELETE /api/drafts/me` in the background. `SignedInDraftHydration`
     * reads the `create:fresh-entry-pending` sentinel and waits before fetching
     * (see {@link prepareFreshCreateFlowEntrySync}).
     */
    const handleCreateRuleClick = useCallback(() => {
      prepareFreshCreateFlowEntrySync();
      router.push("/create/informational");
    }, [router]);

    // Schema markup for site navigation
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "CommunityRule",
      url: "https://communityrule.com",
      ...(folderTop && {
        description: tTopNav("schemaDescription"),
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
      { href: "/use-cases", text: t("navigation.useCases"), extraPadding: true },
      { href: "/learn", text: t("navigation.learn") },
      { href: "/about", text: t("navigation.about") },
    ];

    const renderNavigationItems = (size: NavSize) => {
      const mode = folderTop ? "inverse" : "default";

      return navigationItems.map((item, index) => {
        const itemSize = NAV_SIZE_TO_MENU_ITEM_SIZE[size];

        const isUseCases = item.extraPadding === true;

        return (
          <MenuItem
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
          </MenuItem>
        );
      });
    };

    const renderAvatarGroup = (
      containerSize: "small" | "medium" | "large" | "xlarge",
      avatarSize: "small" | "medium" | "large" | "xlarge",
    ) => {
      return (
        <AvatarContainer size={containerSize}>
          {avatarImageSources.map((src, index) => (
            <Avatar
              key={index}
              src={src}
              alt={tTopNav(`avatarAlts.${3 - index}`)}
              size={avatarSize}
            />
          ))}
        </AvatarContainer>
      );
    };

    const renderLoginButton = (size: NavSize) => {
      const itemSize = NAV_SIZE_TO_MENU_ITEM_SIZE[size];

      // Determine mode based on folderTop and breakpoint size
      // folderTop: inverse mode (black text) for smallest breakpoints (xsmall/home)
      // folderTop: default mode (yellow text) for 640px+ breakpoints (homeMd/large/homeXlarge/xlarge)
      // false folderTop: always default mode (yellow text on dark background)
      const isSmallBreakpoint = size === "xsmall";
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
          <MenuItem
            href="/profile"
            size={itemSize}
            mode={mode}
            state={navSelected ? "selected" : "default"}
            ariaLabel={ariaLabel}
          >
            {label}
          </MenuItem>
        );
      }

      return (
        <MenuItem
          buttonOnClick={() =>
            openLogin({
              variant: "default",
              backdropVariant: "blurredYellow",
              nextPath: pathname || "/",
            })
          }
          href="/login"
          size={itemSize}
          mode={mode}
          state={navSelected ? "selected" : "default"}
          ariaLabel={ariaLabel}
        >
          {label}
        </MenuItem>
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
      <TopView
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

TopContainer.displayName = "Top";

export default TopContainer;
