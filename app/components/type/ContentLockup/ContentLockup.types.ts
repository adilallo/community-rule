import type { ReactNode } from "react";

export type ContentLockupVariantValue =
  | "hero"
  | "feature"
  | "learn"
  | "about"
  | "book"
  | "ask"
  | "ask-inverse"
  | "modal"
  | "login";

export type ContentLockupAlignmentValue = "center" | "left";

export interface ContentLockupProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  buttonClassName?: string;
  /**
   * Content lockup variant.
   */
  variant?: ContentLockupVariantValue;
  linkText?: string;
  linkHref?: string;
  /**
   * Text alignment.
   */
  alignment?: ContentLockupAlignmentValue;
  /**
   * Optional id to attach to the primary title heading.
   * Useful when a parent section uses aria-labelledby.
   */
  titleId?: string;
  /** Replaces the default title string when inline title markup is required. */
  titleContent?: ReactNode;
}

export interface VariantStyle {
  container: string;
  textContainer: string;
  titleGroup: string;
  titleContainer: string;
  title: string;
  subtitle: string;
  description?: string;
  shape: string;
}

export interface ContentLockupViewProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  buttonClassName: string;
  variant:
    | "hero"
    | "feature"
    | "learn"
    | "about"
    | "book"
    | "ask"
    | "ask-inverse"
    | "modal"
    | "login";
  linkText?: string;
  linkHref?: string;
  alignment: "center" | "left";
  titleId?: string;
  titleContent?: ReactNode;
  styles: VariantStyle;
}
