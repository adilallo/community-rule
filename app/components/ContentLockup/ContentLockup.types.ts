export interface ContentLockupProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  buttonClassName?: string;
  variant?: "hero" | "feature" | "learn" | "ask" | "ask-inverse" | "modal";
  linkText?: string;
  linkHref?: string;
  alignment?: "center" | "left";
  /**
   * Optional id to attach to the primary title heading.
   * Useful when a parent section uses aria-labelledby.
   */
  titleId?: string;
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
  variant: "hero" | "feature" | "learn" | "ask" | "ask-inverse" | "modal";
  linkText?: string;
  linkHref?: string;
  alignment: "center" | "left";
  titleId?: string;
  styles: VariantStyle;
}
