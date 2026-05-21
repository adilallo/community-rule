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
 * Decorative vector marks in `public/assets/vector/<kebab-case>.svg`
 * (Figma Asset / Vector). Same folder pattern as governance template marks
 * under `assets/template-mark/`.
 */
export function vectorMarkPath(slug: string): string {
  return `assets/vector/${slug}.svg`;
}

/**
 * Stat card decorative shapes in `public/assets/shapes/`
 * (`stat-shape-1.svg` … `stat-shape-4.svg`, kebab-case — Figma **Card / Stat**).
 */
export function statShapeAssetPath(index: 1 | 2 | 3 | 4): string {
  return `assets/shapes/stat-shape-${index}.svg`;
}

/**
 * Statement / Section-Quote flanking ornaments (`public/assets/shapes/shape-qoute.svg`).
 */
export function quoteStatementShapePath(): string {
  return "assets/shapes/shape-qoute.svg";
}

/**
 * How-it-works body ornaments (`public/assets/shapes/how-shape-*.svg`,
 * Figma **22078:791901**).
 */
export function howItWorksOrnamentRightPath(): string {
  return "assets/shapes/how-shape-2.svg";
}

export function howItWorksOrnamentLeftPath(): string {
  return "assets/shapes/how-shape-1.svg";
}

/**
 * Guide ContentBanner logo mark (Figma **22078:806960**).
 */
export function guideBannerLogoArrowPath(): string {
  return "assets/shapes/guide-banner-logo-arrow.svg";
}

/** Per-article thumbnail backgrounds in `public/content/blog/` (Figma Thumbnail 19428:22574). */
export function contentBlogVerticalPath(slug: string): string {
  return `/content/blog/${slug}-vertical.svg`;
}

export function contentBlogHorizontalPath(slug: string): string {
  return `/content/blog/${slug}-horizontal.svg`;
}

/** Wide banner background for ContentBanner at md+ (Figma Section, 1920×672). */
export function contentBlogSectionPath(slug: string): string {
  return `/content/blog/${slug}-section.svg`;
}

export function contentBlogBannerPath(slug: string): string {
  return contentBlogSectionPath(slug);
}

/** Per-article Tag mark for ContentContainer (Figma Tag frame 19600:15534). */
export function contentBlogTagPath(slug: string): string {
  return `/content/blog/${slug}-tag.svg`;
}

/** Stable catalog slug order for blog asset fallbacks when an article has no custom SVGs. */
export const CONTENT_CATALOG_SLUG_ORDER = [
  "resolving-active-conflicts",
  "operational-security-mutual-aid",
  "making-decisions-without-hierarchy",
  "integrating-new-members-without-dilution",
  "avoiding-burnout-sustainability-in-the-ruins",
  "how-chaos-concentrates-control",
  "digital-mediation-and-the-death-of-nuance",
  "knowledge-management-and-institutional-amnesia",
] as const;

/** Pick a catalog article whose `public/content/blog/` SVGs can stand in as fallbacks. */
export function contentCatalogSlugForFallback(
  slug: string,
): (typeof CONTENT_CATALOG_SLUG_ORDER)[number] {
  if (!slug) return CONTENT_CATALOG_SLUG_ORDER[0];

  const index =
    Math.abs(
      slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0),
    ) % CONTENT_CATALOG_SLUG_ORDER.length;
  return CONTENT_CATALOG_SLUG_ORDER[index];
}

/**
 * Asset paths for common components
 */
export const ASSETS = {
  // Logo
  LOGO: "assets/logo/Logo.svg",

  // Avatars
  AVATAR_1: "assets/Avatar_1.png",
  AVATAR_2: "assets/Avatar_2.png",
  AVATAR_3: "assets/Avatar_3.png",

  // Social media
  BLUESKY_LOGO: "assets/Bluesky_Logo.svg",
  GITLAB_ICON: "assets/GitLab_Icon.png",

  // Content page decorative shapes
  CONTENT_SHAPE_1: "assets/Content_Shape_1.svg",
  CONTENT_SHAPE_2: "assets/Content_Shape_2.svg",

  /** Sections / Book cover (Figma **22137:891197**). */
  COMMUNITYRULES_COVER: "assets/communityrules-cover.svg",

  // Alert icons
  ICON_ALERT: "assets/Icon_Alert.svg",
  ICON_CLOSE: "assets/Icon_Close.svg",

  // Tooltip icons
  ICON_POINTER: "assets/Icon_Pointer.svg",

  // Help icon
  ICON_HELP: "assets/Icon_Help.svg",
} as const;
