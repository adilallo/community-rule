/**
 * Asset path utilities for handling different environments
 * - Web app: uses absolute paths starting with /
 * - Storybook: uses relative paths for proper asset resolution
 */

/**
 * Get the correct asset path based on environment
 * @param assetPath - The asset path (e.g., "assets/Logo.svg")
 * @returns The correct path for the current environment
 */
export function getAssetPath(assetPath: string): string {
  // Check if we're in Storybook environment
  const isStorybook =
    typeof window !== "undefined" &&
    (window.location?.pathname?.includes("iframe.html") ||
      window.navigator?.userAgent?.includes("Storybook"));

  // In Storybook, use relative paths
  if (isStorybook) {
    return assetPath;
  }

  // In web app, use absolute paths
  return assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
}

/**
 * Asset paths for common components
 */
export const ASSETS = {
  // Logo
  LOGO: "assets/Logo.svg",

  // Avatars
  AVATAR_1: "assets/Avatar_1.png",
  AVATAR_2: "assets/Avatar_2.png",
  AVATAR_3: "assets/Avatar_3.png",

  // Social media
  BLUESKY_LOGO: "assets/Bluesky_Logo.svg",
  GITLAB_ICON: "assets/GitLab_Icon.png",

  // Content thumbnails
  VERTICAL_1: "assets/Content_Thumbnail/Vertical_1.svg",
  VERTICAL_2: "assets/Content_Thumbnail/Vertical_2.svg",
  VERTICAL_3: "assets/Content_Thumbnail/Vertical_3.svg",
  HORIZONTAL_1: "assets/Content_Thumbnail/Horizontal_1.svg",
  HORIZONTAL_2: "assets/Content_Thumbnail/Horizontal_2.svg",
  HORIZONTAL_3: "assets/Content_Thumbnail/Horizontal_3.svg",
  ICON_1: "assets/Content_Thumbnail/Icon_1.svg",
  ICON_2: "assets/Content_Thumbnail/Icon_2.svg",
  ICON_3: "assets/Content_Thumbnail/Icon_3.svg",

  // Content page decorative shapes
  CONTENT_SHAPE_1: "assets/Content_Shape_1.svg",
  CONTENT_SHAPE_2: "assets/Content_Shape_2.svg",

  // Alert icons
  ICON_ALERT: "assets/Icon_Alert.svg",
  ICON_CLOSE: "assets/Icon_Close.svg",

  // Tooltip icons
  ICON_POINTER: "assets/Icon_Pointer.svg",

  // Help icon
  ICON_HELP: "assets/Icon_Help.svg",
} as const;
