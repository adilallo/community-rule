/**
 * Asset path utilities for handling different environments
 * - Web app: uses absolute paths starting with /
 * - Storybook: uses relative paths for proper asset resolution
 *
 * Folder map: `docs/guides/static-assets.md`
 */

/**
 * Get the correct asset path based on environment
 * @param assetPath - The asset path (e.g., "assets/logos/community-rule.svg")
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
 * Statement / Section-Quote flanking ornaments (`public/assets/shapes/shape-quote.svg`).
 */
export function quoteStatementShapePath(): string {
  return "assets/shapes/shape-quote.svg";
}

/** ContentLockup decorative shape (Figma **22078:791901**). */
export function contentLockupShapePath(): string {
  return "assets/shapes/shapes-1.svg";
}

/** TripleStep section ornament. */
export function tripleStepShapePath(): string {
  return "assets/shapes/triple-step.svg";
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

/** Partner logo wall SVGs in `public/assets/logos/partners/`. */
export function partnerLogoPath(slug: string): string {
  return `assets/logos/partners/${slug}.svg`;
}

/** Share modal glyphs in `public/assets/share/`. */
export type ShareIconName = "discord" | "link" | "mail" | "signal" | "slack";

export function shareIconPath(name: ShareIconName): string {
  return `assets/share/${name}.svg`;
}

/** Section number badges in `public/assets/marketing/`. */
export function sectionNumberPath(n: 1 | 2 | 3): string {
  return `assets/marketing/section-number-${n}.svg`;
}

/** Downloadable governance booklet PDF (About / Sections / Book). */
export function governanceBookletPath(): string {
  return "assets/marketing/governance-booklet.pdf";
}

/** Home feature grid panel art in `public/assets/marketing/`. */
export type FeaturePanelKey = "support" | "exercises" | "guidance" | "tools";

export function featurePanelPath(key: FeaturePanelKey): string {
  return `assets/marketing/feature-${key}.png`;
}

/** Case study card artwork in `public/assets/case-study/`. */
export type CaseStudyVisualKey = "lavender" | "neutral" | "rose";

const CASE_STUDY_VISUAL_PATHS: Record<CaseStudyVisualKey, string> = {
  lavender: "assets/case-study/case-study-mutual-aid.svg",
  neutral: "assets/case-study/case-study-food-not-bombs.svg",
  rose: "assets/case-study/case-study-boulder-county-street-medics.svg",
};

export function caseStudyVisualPath(key: CaseStudyVisualKey): string {
  return CASE_STUDY_VISUAL_PATHS[key];
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
  // Brand logo
  LOGO: "assets/logos/community-rule.svg",

  // Avatars
  AVATAR_1: "assets/marketing/avatar-1.svg",
  AVATAR_2: "assets/marketing/avatar-2.svg",
  AVATAR_3: "assets/marketing/avatar-3.svg",

  // Social media
  BLUESKY_LOGO: "assets/logos/bluesky.svg",
  GITLAB_ICON: "assets/logos/gitlab.svg",

  // Content page decorative shapes
  CONTENT_SHAPE_1: "assets/shapes/content-shape-1.svg",
  CONTENT_SHAPE_2: "assets/shapes/content-shape-2.svg",

  /** Default ContentBanner background when no article-specific art. */
  CONTENT_BANNER: "assets/marketing/content-banner.svg",

  /** Quote block default avatar. */
  QUOTE_AVATAR: "assets/marketing/quote-avatar.svg",

  /** Sections / Book cover (Figma **22137:891197**). */
  COMMUNITYRULES_COVER: "assets/marketing/communityrules-cover.svg",

  // Marketing
  HERO_IMAGE: "assets/marketing/hero-image.png",

  // Top nav union ornaments
  UNION_XSM: "assets/shapes/union-xsm.svg",
  UNION_SM_MD_LG: "assets/shapes/union-sm-md-lg.svg",
  UNION_XLG: "assets/shapes/union-xlg.svg",

  // Alert / UI icons
  ICON_ALERT: "assets/icons/icon-alert.svg",
  ICON_CLOSE: "assets/icons/icon-close.svg",
  ICON_POINTER: "assets/icons/icon-pointer.svg",
  ICON_HELP: "assets/icons/icon-help.svg",
} as const;
