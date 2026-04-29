"use client";

import { memo } from "react";
import LinkView from "./Link.view";
import type { LinkProps } from "./Link.types";

/**
 * Figma: "Link" in Navigation — "Link, CTA" (21861:21428). Paragraph uses the
 * same border-b + pb-0.5 spacing as default, with the rule visible at rest.
 */
const Link = memo<LinkProps>(
  ({
    children,
    className = "",
    type: linkType = "primary",
    variant = "default",
    theme = "light",
    leadingIcon = true,
    trailingIcon = true,
    href,
    onClick,
    prefetch,
    replace,
    scroll,
    rel,
    target,
    id,
    "aria-label": ariaLabel,
    "aria-current": ariaCurrent,
  }) => {
    return (
      <LinkView
        className={className}
        type={linkType}
        variant={variant}
        theme={theme}
        leadingIcon={variant === "default" ? leadingIcon : false}
        trailingIcon={variant === "default" ? trailingIcon : false}
        href={href}
        onClick={onClick}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        rel={rel}
        target={target}
        id={id}
        aria-label={ariaLabel}
        aria-current={ariaCurrent}
      >
        {children}
      </LinkView>
    );
  },
);

Link.displayName = "Link";

export default Link;
