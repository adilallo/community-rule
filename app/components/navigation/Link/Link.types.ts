import type { AriaAttributes, ReactNode } from "react";

export const LINK_TYPE_OPTIONS = ["primary", "secondary"] as const;
export type LinkTypeValue = (typeof LINK_TYPE_OPTIONS)[number];

export const LINK_VARIANT_OPTIONS = ["default", "paragraph"] as const;
export type LinkVariantValue = (typeof LINK_VARIANT_OPTIONS)[number];

export const LINK_THEME_OPTIONS = ["light", "dark"] as const;
export type LinkThemeValue = (typeof LINK_THEME_OPTIONS)[number];

/**
 * Figma: "Link" in Navigation — `21861:21428`. Interaction states are
 * implemented with CSS; there is no `state` prop.
 */
export type LinkProps = {
  children: ReactNode;
  className?: string;
  /** Figma: Type (primary or secondary). */
  type?: LinkTypeValue;
  /** Figma: default (with icons) or paragraph (underlined). */
  variant?: LinkVariantValue;
  /** Figma: light or dark surface. */
  theme?: LinkThemeValue;
  /** Figma "default" variant: 16px plus before text. Ignored for `paragraph`. */
  leadingIcon?: boolean;
  /** Figma "default" variant: 16px plus after text. Ignored for `paragraph`. */
  trailingIcon?: boolean;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  /** Passed to `next/link` when `href` is set. */
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  rel?: string;
  target?: string;
  id?: string;
  "aria-label"?: string;
  "aria-current"?: AriaAttributes["aria-current"];
};

export type LinkViewProps = {
  children: ReactNode;
  className?: string;
  type: LinkTypeValue;
  variant: LinkVariantValue;
  theme: LinkThemeValue;
  leadingIcon: boolean;
  trailingIcon: boolean;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  dataFigmaNode?: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  rel?: string;
  target?: string;
  id?: string;
  "aria-label"?: string;
  "aria-current"?: AriaAttributes["aria-current"];
};
