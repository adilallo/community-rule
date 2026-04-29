"use client";

import Image from "next/image";
import { useTranslation } from "../../../contexts/MessagesContext";
import MultiSelect from "../../controls/MultiSelect";
import NavigationLink from "../../navigation/Link";
import type { RuleBottomLink, RuleViewProps } from "./Rule.types";

export function RuleView({
  title,
  description,
  icon,
  backgroundColor,
  className,
  onClick,
  onKeyDown,
  expanded,
  size,
  categories,
  logoUrl,
  logoAlt,
  communityInitials,
  hideCategoryAddButton = false,
  hasBottomLinks = false,
  bottomStatusLabel,
  bottomLinks,
}: RuleViewProps) {
  const t = useTranslation("ruleCard");
  const ariaLabel = t("ariaLabel")?.replace("{title}", title) || title;
  const interactiveCard = !hasBottomLinks;

  // Size-based styling
  const isLarge = size === "L";
  const isMedium = size === "M";
  const isSmall = size === "S";
  const isExtraSmall = size === "XS";

  // Card dimensions - use CSS classes from className if provided, otherwise use size-based logic
  // Check if className already has padding/gap classes
  const hasResponsivePadding =
    className?.includes("p-[") ||
    className?.includes("px-[") ||
    className?.includes("py-[") ||
    className?.includes("pt-[") ||
    className?.includes("pb-[");
  const hasResponsiveGap = className?.includes("gap-[");

  // Expanded + size: uniform padding on all sides (overrides conflicting utilities from `className`).
  const cardPadding =
    expanded && isLarge
      ? "!p-[24px]"
      : expanded && isMedium
        ? "!p-[16px]"
        : hasResponsivePadding
          ? ""
          : isLarge || isSmall
            ? "p-[24px]"
            : isMedium
              ? "p-[16px]"
              : "pb-[24px] pt-[12px] px-[12px]"; // XS: asymmetric padding
  const cardGap = expanded
    ? "gap-[16px]"
    : hasResponsiveGap
      ? "" // If className has responsive gap, don't add size-based gap
      : isLarge
        ? "gap-[10px]"
        : isMedium
          ? "gap-[12px]"
          : "gap-[18px]"; // XS and S: 18px gap
  const cardWidth = expanded
    ? isLarge
      ? "w-[568px]"
      : isMedium
        ? "w-[398px]"
        : "" // XS and S: no fixed width
    : "";

  // Logo/Icon dimensions (inner circle) after Figma header `pl-1 pr-2 py-2` in icon cell
  // (Card / Rule — e.g. `22143:900771` / `19706:12110`); outer column width holds padding + this.
  const logoSize = 103; // `next/image` prop; actual box comes from `logoContainerClass`
  const logoContainerClass = `
    max-[639px]:size-[56px]
    min-[640px]:max-[1023px]:size-[64px]
    min-[1024px]:max-[1439px]:size-[56px]
    min-[1440px]:size-[88px]
  `;

  // Title typography - use CSS responsive classes
  const titleClass = `
    max-[639px]:font-inter max-[639px]:font-bold max-[639px]:text-[20px] max-[639px]:leading-[28px]
    min-[640px]:max-[1023px]:font-bricolage-grotesque min-[640px]:max-[1023px]:font-bold min-[640px]:max-[1023px]:text-[28px] min-[640px]:max-[1023px]:leading-[36px]
    min-[1024px]:max-[1439px]:font-bricolage-grotesque min-[1024px]:max-[1439px]:font-bold min-[1024px]:max-[1439px]:text-[24px] min-[1024px]:max-[1439px]:leading-[32px]
    min-[1440px]:font-bricolage-grotesque min-[1440px]:font-extrabold min-[1440px]:text-[36px] min-[1440px]:leading-[44px]
  `;

  // Description typography
  const descriptionClass = isLarge
    ? "font-inter font-medium text-[18px] leading-[24px]"
    : isMedium
      ? "font-inter font-medium text-[14px] leading-[16px]"
      : isSmall
        ? "font-inter font-medium text-[14px] leading-[16px]" // S: 14px, medium, Inter
        : "font-inter font-medium text-[12px] leading-[14px]"; // XS: 12px, medium, Inter

  // Render logo/icon
  const renderLogo = () => {
    if (logoUrl) {
      // Check if it's a localhost URL or external URL that needs regular img tag
      const isLocalhost =
        logoUrl.startsWith("http://localhost") ||
        logoUrl.startsWith("https://localhost");

      const containerClass = `${logoContainerClass} relative rounded-full overflow-hidden mix-blend-luminosity`;

      if (isLocalhost) {
        return (
          <div className={containerClass}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={logoAlt || title}
              width={logoSize}
              height={logoSize}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        );
      }

      return (
        <div className={containerClass}>
          <Image
            src={logoUrl}
            alt={logoAlt || title}
            width={logoSize}
            height={logoSize}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      );
    }

    if (icon) {
      return (
        <div
          className={`${logoContainerClass} flex items-center justify-center`}
        >
          {icon}
        </div>
      );
    }

    if (communityInitials) {
      const initialsSize = `
        max-[639px]:text-[16px]
        min-[640px]:max-[1023px]:text-[20px]
        min-[1024px]:text-[36px]
      `;
      return (
        <div
          className={`${logoContainerClass} rounded-full bg-[var(--color-surface-default-primary)] flex items-center justify-center`}
        >
          <span
            className={`${initialsSize} font-bricolage-grotesque font-bold text-[var(--color-content-default-primary,white)]`}
          >
            {communityInitials}
          </span>
        </div>
      );
    }

    return null;
  };

  // Border radius - use CSS classes if provided via className, otherwise use size-based logic
  const borderRadiusClass = className?.includes("rounded-")
    ? "" // If className already has border radius, don't add size-based one
    : isExtraSmall
      ? "rounded-[var(--measures-radius-200,8px)]"
      : isSmall
        ? "rounded-[var(--measures-radius-300,12px)]"
        : "rounded-[var(--radius-measures-radius-small)]";

  function renderBottomLink(link: RuleBottomLink) {
    const shared = {
      variant: "paragraph" as const,
      type: "primary" as const,
      theme: "light" as const,
      className: "shrink-0",
      children: link.label,
    };
    if (link.href) {
      return (
        <NavigationLink
          key={link.id}
          {...shared}
          href={link.href}
          onClick={(e) => e.stopPropagation()}
        />
      );
    }
    return (
      <NavigationLink
        key={link.id}
        {...shared}
        onClick={(e) => {
          e.stopPropagation();
          link.onClick?.();
        }}
      />
    );
  }

  return (
    <div
      className={`${backgroundColor} ${cardPadding} ${cardGap} ${borderRadiusClass} shadow-[0px_0px_48px_0px_rgba(0,0,0,0.1)] ${interactiveCard ? "hover:shadow-[0px_0px_64px_0px_rgba(0,0,0,0.15)] transition-shadow duration-200" : ""} flex flex-col items-start justify-center relative ${cardWidth || "w-full"} ${className || ""}`}
      tabIndex={interactiveCard ? 0 : undefined}
      role={interactiveCard ? "button" : "article"}
      aria-label={ariaLabel}
      aria-expanded={interactiveCard ? expanded : undefined}
      onClick={interactiveCard ? onClick : undefined}
      onKeyDown={interactiveCard ? onKeyDown : undefined}
    >
      {/* Figma: Header = `border-b` row, `gap-px`, icon `pl-1 pr-2 py-2` + `border-l` on title. */}
      <div
        className="
        border-b border-solid border-[var(--color-content-invert-primary)] flex
        w-full shrink-0 items-center gap-px
      "
      >
        {renderLogo() && (
          <div
            className="
            flex shrink-0 items-center justify-center
            pl-[4px] pr-[8px] py-[8px]
            max-[639px]:w-[72px]
            min-[640px]:max-[1023px]:w-[80px]
            min-[1024px]:w-[119px]
          "
          >
            {renderLogo()}
          </div>
        )}
        {title && (
          <div
            className={`
            flex min-w-0 flex-1 flex-col justify-center
            min-h-[72px] min-[640px]:min-h-[80px] min-[1024px]:min-h-[88px] min-[1440px]:min-h-[136px]
            border-l border-solid border-[var(--color-content-invert-primary)]
          `}
          >
            {/* Inner container for header text with padding */}
            <div
              className={`
              flex items-center justify-center w-full
              max-[639px]:pl-[8px] max-[639px]:py-[8px]
              min-[640px]:max-[1023px]:pl-[12px] min-[640px]:max-[1023px]:py-[12px]
              min-[1024px]:px-[16px] min-[1024px]:py-[24px]
            `}
            >
              <h3
                className={`${titleClass} cursor-inherit text-[var(--color-content-invert-primary)] overflow-hidden text-ellipsis w-full`}
              >
                {title}
              </h3>
            </div>
          </div>
        )}
      </div>

      {hasBottomLinks ? (
        <div
          className={`flex w-full shrink-0 flex-col ${isLarge ? "gap-6" : "gap-4"}`}
        >
          {description ? (
            <p
              className={`w-full ${descriptionClass} text-[var(--color-content-invert-primary)]`}
            >
              {description}
            </p>
          ) : null}
          {bottomLinks && bottomLinks.length > 0 ? (
            <div
              className={[
                "flex w-full min-w-0 flex-nowrap items-center",
                bottomStatusLabel ? "justify-between gap-2" : "justify-end",
              ].join(" ")}
              data-figma-node="21867:47400"
            >
              {bottomStatusLabel ? (
                <span className="shrink-0 rounded-[2px] bg-[var(--color-surface-default-tertiary)] px-1 py-0.5 font-inter text-[10px] font-medium uppercase leading-3 text-[var(--color-surface-invert-brand-teal)]">
                  {bottomStatusLabel}
                </span>
              ) : null}
              {/**
               * Figma `22143:900539` / `21867:46099`: one row — status (optional) + all links in
               * a single `flex-nowrap` group (`space/800` = 32px between links on large).
               * If the row is too narrow, scroll horizontally; links never wrap.
               */}
              <div
                className={[
                  "flex min-w-0 flex-nowrap items-center justify-end overflow-x-auto [scrollbar-width:thin]",
                  bottomStatusLabel ? "min-w-0 flex-1" : "w-auto",
                  isLarge
                    ? "gap-3 sm:gap-6 lg:gap-8"
                    : "gap-2 min-[400px]:gap-3 sm:gap-4 lg:gap-8",
                ].join(" ")}
                data-figma-node="21867:46099"
              >
                {bottomLinks.map((link) => renderBottomLink(link))}
              </div>
            </div>
          ) : null}
        </div>
      ) : expanded ? (
        <>
          {/* Categories Section - Using MultiSelect */}
          {categories && categories.length > 0 && (
            <div
              className={`flex flex-col gap-[16px] items-start relative shrink-0 w-full ${
                expanded && (isLarge || isMedium) ? "px-0" : "px-[12px]"
              }`}
            >
              {categories.map((category, categoryIndex) => (
                <MultiSelect
                  key={categoryIndex}
                  label={category.name}
                  showHelpIcon={false}
                  size="s"
                  palette="inverse"
                  options={category.chipOptions}
                  onChipClick={(chipId) => {
                    category.onChipClick?.(category.name, chipId);
                  }}
                  onAddClick={() => {
                    category.onAddClick?.(category.name);
                  }}
                  onCustomChipConfirm={(chipId, value) => {
                    category.onCustomChipConfirm?.(
                      category.name,
                      chipId,
                      value,
                    );
                  }}
                  onCustomChipClose={(chipId) => {
                    category.onCustomChipClose?.(category.name, chipId);
                  }}
                  addButton={!hideCategoryAddButton}
                  addButtonText="" // Empty text for icon-only circular button
                  className="w-full"
                />
              ))}
            </div>
          )}
          {/* Footer: Description */}
          {description && (
            <div className="border-t border-solid border-[var(--color-content-invert-primary)] pt-[16px] relative shrink-0 w-full">
              <p
                className={`${descriptionClass} cursor-inherit text-[var(--color-content-invert-primary)]`}
              >
                {description}
              </p>
            </div>
          )}
        </>
      ) : (
        /* Collapsed State: Description */
        description && (
          <div className="flex items-center justify-center relative shrink-0 w-full">
            <p
              className={`${descriptionClass} cursor-inherit text-[var(--color-content-invert-primary)] flex-1`}
            >
              {description}
            </p>
          </div>
        )
      )}
    </div>
  );
}

