"use client";

import NextLink from "next/link";
import { memo } from "react";
import type { MouseEventHandler, ReactNode } from "react";
import type { LinkTypeValue, LinkViewProps, LinkThemeValue, LinkVariantValue } from "./Link.types";

const FIGMA_ROOT = "21861:21428";

/** Profile & card small viewports: Figma Sizing/300 + label line (350). ≥640px: 18px / 1.3. */
const LINK_TYPOGRAPHY =
  "font-inter font-normal text-[length:var(--sizing-300)] leading-[var(--sizing-350)] min-[640px]:text-[18px] min-[640px]:leading-[1.3]";

function linkFocusRing(theme: LinkThemeValue) {
  return theme === "light"
    ? "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-border-link-focus)] focus-visible:rounded-lg"
    : "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-border-link-invert-focus)] focus-visible:rounded-lg";
}

function defaultRootClass(theme: LinkThemeValue, linkType: LinkTypeValue) {
  const focusRing = linkFocusRing(theme);
  if (theme === "light" && linkType === "primary") {
    return `group inline-flex min-h-8 max-h-16 w-fit max-w-full shrink-0 items-center gap-2 rounded-lg ${LINK_TYPOGRAPHY} text-[var(--color-link-primary)] hover:text-[var(--color-link-primary-hover)] focus-visible:text-[var(--color-link-primary-focus)] active:text-[var(--color-link-primary-active)] ${focusRing}`;
  }
  if (theme === "light" && linkType === "secondary") {
    return `group inline-flex min-h-8 max-h-16 w-fit max-w-full shrink-0 items-center gap-2 rounded-lg ${LINK_TYPOGRAPHY} text-[var(--color-link-secondary)] hover:text-[var(--color-link-secondary-hover)] focus-visible:text-[var(--color-link-secondary-focus)] active:text-[var(--color-link-secondary-active)] ${focusRing}`;
  }
  if (theme === "dark" && linkType === "primary") {
    return `group inline-flex min-h-8 max-h-16 w-fit max-w-full shrink-0 items-center gap-2 rounded-lg ${LINK_TYPOGRAPHY} text-[var(--color-link-invert-primary)] hover:text-[var(--color-link-invert-primary-hover)] focus-visible:text-[var(--color-link-invert-primary-focus)] active:text-[var(--color-link-invert-primary-active)] ${focusRing}`;
  }
  return `group inline-flex min-h-8 max-h-16 w-fit max-w-full shrink-0 items-center gap-2 rounded-lg ${LINK_TYPOGRAPHY} text-[var(--color-link-invert-secondary)] hover:text-[var(--color-link-invert-secondary-hover)] focus-visible:text-[var(--color-link-invert-secondary-focus)] active:text-[var(--color-link-invert-secondary-active)] ${focusRing}`;
}

function defaultUnderlineClass(theme: LinkThemeValue, linkType: LinkTypeValue) {
  if (theme === "light" && linkType === "primary") {
    return "inline-block min-w-0 max-w-full border-b border-transparent bg-transparent px-0 pb-0.5 text-left text-inherit transition-[border-color] group-hover:border-[var(--color-link-primary-hover)] group-focus-visible:border-[var(--color-link-primary-focus)] group-active:border-[var(--color-link-primary-active)]";
  }
  if (theme === "light" && linkType === "secondary") {
    return "inline-block min-w-0 max-w-full border-b border-transparent bg-transparent px-0 pb-0.5 text-left text-inherit transition-[border-color] group-hover:border-[var(--color-link-secondary-hover)] group-focus-visible:border-[var(--color-link-secondary-focus)] group-active:border-[var(--color-link-secondary-active)]";
  }
  if (theme === "dark" && linkType === "primary") {
    return "inline-block min-w-0 max-w-full border-b border-transparent bg-transparent px-0 pb-0.5 text-left text-inherit transition-[border-color] group-hover:border-[var(--color-link-invert-primary-hover)] group-focus-visible:border-[var(--color-link-invert-primary-focus)] group-active:border-[var(--color-link-invert-primary-active)]";
  }
  return "inline-block min-w-0 max-w-full border-b border-transparent bg-transparent px-0 pb-0.5 text-left text-inherit transition-[border-color] group-hover:border-[var(--color-link-invert-secondary-hover)] group-focus-visible:border-[var(--color-link-invert-secondary-focus)] group-active:border-[var(--color-link-invert-secondary-active)]";
}

/** Same `pb-0.5` + `border-b` as default, but the rule is visible at rest. */
function paragraphUnderlineClass(theme: LinkThemeValue, linkType: LinkTypeValue) {
  if (theme === "light" && linkType === "primary") {
    return "inline-block min-w-0 max-w-full border-b border-[var(--color-link-primary)] bg-transparent px-0 pb-0.5 text-left text-inherit transition-[border-color] group-hover:border-[var(--color-link-primary-hover)] group-focus-visible:border-[var(--color-link-primary-focus)] group-active:border-[var(--color-link-primary-active)]";
  }
  if (theme === "light" && linkType === "secondary") {
    return "inline-block min-w-0 max-w-full border-b border-[var(--color-link-secondary)] bg-transparent px-0 pb-0.5 text-left text-inherit transition-[border-color] group-hover:border-[var(--color-link-secondary-hover)] group-focus-visible:border-[var(--color-link-secondary-focus)] group-active:border-[var(--color-link-secondary-active)]";
  }
  if (theme === "dark" && linkType === "primary") {
    return "inline-block min-w-0 max-w-full border-b border-[var(--color-link-invert-primary)] bg-transparent px-0 pb-0.5 text-left text-inherit transition-[border-color] group-hover:border-[var(--color-link-invert-primary-hover)] group-focus-visible:border-[var(--color-link-invert-primary-focus)] group-active:border-[var(--color-link-invert-primary-active)]";
  }
  return "inline-block min-w-0 max-w-full border-b border-[var(--color-link-invert-secondary)] bg-transparent px-0 pb-0.5 text-left text-inherit transition-[border-color] group-hover:border-[var(--color-link-invert-secondary-hover)] group-focus-visible:border-[var(--color-link-invert-secondary-focus)] group-active:border-[var(--color-link-invert-secondary-active)]";
}

function LinkPlus12() {
  return (
    <span className="inline-flex size-4 shrink-0 items-center justify-center text-inherit" aria-hidden>
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden
      >
        <path
          d="M5.25 0h1.5v4.5H12v1.5H6.75V12h-1.5V6.75H0V5.25h5.25V0Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

function LinkViewInner({
  variant,
  theme,
  type,
  leadingIcon,
  trailingIcon,
  children,
}: {
  variant: LinkVariantValue;
  theme: LinkThemeValue;
  type: LinkTypeValue;
  leadingIcon: boolean;
  trailingIcon: boolean;
  children: ReactNode;
}) {
  if (variant === "paragraph") {
    return (
      <span className={`min-h-0 min-w-0 max-w-full shrink ${paragraphUnderlineClass(theme, type)}`}>
        <span className="block min-w-0 whitespace-normal [overflow-wrap:anywhere] text-inherit">
          {children}
        </span>
      </span>
    );
  }
  return (
    <>
      {leadingIcon ? <LinkPlus12 /> : null}
      <span className={`min-h-0 min-w-0 max-w-full shrink ${defaultUnderlineClass(theme, type)}`}>
        <span className="block min-w-0 whitespace-normal [overflow-wrap:anywhere] text-inherit">
          {children}
        </span>
      </span>
      {trailingIcon ? <LinkPlus12 /> : null}
    </>
  );
}

function LinkView({
  children,
  className,
  type,
  variant,
  theme,
  leadingIcon,
  trailingIcon,
  href,
  onClick,
  dataFigmaNode = FIGMA_ROOT,
  prefetch,
  replace,
  scroll,
  rel,
  target,
  id,
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent,
}: LinkViewProps) {
  const root = [defaultRootClass(theme, type), className]
    .filter(Boolean)
    .join(" ");
  const content = (
    <LinkViewInner
      variant={variant}
      theme={theme}
      type={type}
      leadingIcon={leadingIcon}
      trailingIcon={trailingIcon}
    >
      {children}
    </LinkViewInner>
  );

  if (href) {
    return (
      <NextLink
        href={href}
        className={root}
        data-figma-node={dataFigmaNode}
        id={id}
        aria-label={ariaLabel}
        aria-current={ariaCurrent}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        rel={rel}
        target={target}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement> | undefined}
      >
        {content}
      </NextLink>
    );
  }

  return (
    <button
      type="button"
      className={`${root} m-0 cursor-pointer border-0 bg-transparent p-0 text-left font-inherit [font-family:inherit]`}
      data-figma-node={dataFigmaNode}
      id={id}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}
    >
      {content}
    </button>
  );
}

LinkView.displayName = "LinkView";

export default memo(LinkView);
