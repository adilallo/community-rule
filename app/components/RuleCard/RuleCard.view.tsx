"use client";

import Image from "next/image";
import { useTranslation } from "../../contexts/MessagesContext";
import MultiSelect from "../MultiSelect";
import type { RuleCardViewProps } from "./RuleCard.types";

export function RuleCardView({
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
}: RuleCardViewProps) {
  const t = useTranslation("ruleCard");
  const ariaLabel = t("ariaLabel")?.replace("{title}", title) || title;

  // Size-based styling
  const isLarge = size === "L";
  const isMedium = size === "M";
  const isSmall = size === "S";
  const isExtraSmall = size === "XS";
  
  // Card dimensions - fixed width for expanded states (568px for L, 398px for M per Figma)
  // XS and S don't have fixed widths when expanded
  const cardPadding = isLarge || isSmall
    ? "p-[24px]"
    : isMedium
    ? "p-[16px]"
    : "pb-[24px] pt-[12px] px-[12px]"; // XS: asymmetric padding
  const cardGap = expanded
    ? "gap-[16px]"
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

  // Logo/Icon dimensions
  // For S: 80px container with 12px padding = 56px icon area
  // For XS: 40px container with 16px padding = 8px icon area (very small, but matches Figma)
  const logoSize = isLarge
    ? 103
    : isMedium
    ? 56
    : isSmall
    ? 56 // S: 80px container - 12px padding * 2 = 56px icon
    : 8; // XS: 40px container - 16px padding * 2 = 8px icon
  const logoContainerClass = isLarge
    ? "size-[103px]"
    : isMedium
    ? "size-[56px]"
    : isSmall
    ? "size-[80px]" // S: 80px container
    : "size-[40px]"; // XS: 40px container

  // Title typography
  const titleClass = isLarge
    ? "font-bricolage-grotesque font-extrabold text-[36px] leading-[44px]"
    : isMedium
    ? "font-bricolage-grotesque font-bold text-[24px] leading-[32px]"
    : isSmall
    ? "font-bricolage-grotesque font-bold text-[28px] leading-[36px]" // S: 28px, bold, Bricolage
    : "font-inter font-bold text-[20px] leading-[28px]"; // XS: 20px, bold, Inter

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
      const isLocalhost = logoUrl.startsWith("http://localhost") || logoUrl.startsWith("https://localhost");
      
      const containerClass = `${logoContainerClass} relative rounded-full overflow-hidden mix-blend-luminosity ${isSmall ? "p-[12px]" : isExtraSmall ? "p-[16px]" : ""}`;
      
      if (isLocalhost) {
        return (
          <div className={containerClass}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={logoAlt || title}
              width={logoSize}
              height={logoSize}
              className={`${isSmall || isExtraSmall ? "w-full h-full" : "absolute inset-0 w-full h-full"} object-cover rounded-full`}
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
            className={`${isSmall || isExtraSmall ? "w-full h-full" : "absolute inset-0 w-full h-full"} object-cover rounded-full`}
          />
        </div>
      );
    }
    
    if (icon) {
      return (
        <div className={`${logoContainerClass} flex items-center justify-center ${isSmall ? "p-[12px]" : isExtraSmall ? "p-[16px]" : ""}`}>
          {icon}
        </div>
      );
    }
    
    if (communityInitials) {
      const initialsSize = isLarge
        ? "text-[36px]"
        : isMedium
        ? "text-[24px]"
        : isSmall
        ? "text-[20px]"
        : "text-[16px]";
      return (
        <div className={`${logoContainerClass} rounded-full bg-[var(--color-surface-default-primary)] flex items-center justify-center`}>
          <span className={`${initialsSize} font-bricolage-grotesque font-bold text-[var(--color-content-default-primary,white)]`}>
            {communityInitials}
          </span>
        </div>
      );
    }
    
    return null;
  };


  return (
    <div
      className={`${backgroundColor} ${cardPadding} ${cardGap} ${isExtraSmall ? "rounded-[var(--measures-radius-200,8px)]" : isSmall ? "rounded-[var(--measures-radius-300,12px)]" : "rounded-[var(--radius-measures-radius-small)]"} shadow-[0px_0px_48px_0px_rgba(0,0,0,0.1)] hover:shadow-[0px_0px_64px_0px_rgba(0,0,0,0.15)] transition-shadow duration-200 flex flex-col items-start justify-center relative ${cardWidth || "w-full"} ${className}`}
      tabIndex={0}
      role="button"
      aria-label={ariaLabel}
      aria-expanded={expanded}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {/* Outermost container with bottom border - taller to match Figma */}
      <div className={`border-b border-black border-solid flex items-center relative shrink-0 w-full ${isLarge ? "h-[136px]" : isMedium ? "h-[88px]" : isSmall ? "h-[80px]" : "h-[40px]"}`}>
        {/* Logo/Icon - fixed width/height, vertically centered, does not touch bottom */}
        {renderLogo() && (
          <div className={`flex items-center justify-center shrink-0 ${isLarge ? "w-[103px] h-[103px]" : isMedium ? "w-[56px] h-[56px]" : isSmall ? "w-[80px] h-[80px]" : "w-[40px] h-[40px]"} ${isSmall || isExtraSmall ? "border-r border-black border-solid" : ""}`}>
            {renderLogo()}
          </div>
        )}
        {/* Spacing between icon and title */}
        {!isSmall && !isExtraSmall && <div className="w-[16px] shrink-0" />}
        {/* Container with no padding and left border - extends full height to touch bottom */}
        {title && (
          <div className={`${!isSmall && !isExtraSmall ? "border-l border-black border-solid" : ""} flex-1 min-w-0 h-full flex`}>
            {/* Inner container for header text with padding */}
            <div className={`flex ${isLarge ? "px-[16px] py-[24px]" : isMedium ? "px-[16px] py-[12px]" : isSmall ? "pl-[12px] py-[12px]" : "pl-[8px] py-[8px]"} items-center justify-center w-full`}>
              <h3 className={`${titleClass} text-black overflow-hidden text-ellipsis w-full`}>
              {title}
            </h3>
            </div>
          </div>
        )}
      </div>

      {expanded ? (
        <>
          {/* Categories Section - Using MultiSelect */}
          {categories && categories.length > 0 && (
            <div className="flex flex-col gap-[16px] items-start px-[12px] relative shrink-0 w-full">
              {categories.map((category, categoryIndex) => (
                <MultiSelect
                  key={categoryIndex}
                  label={category.name}
                  showHelpIcon={false}
                  size="S"
                  palette="Inverse"
                  options={category.chipOptions}
                  onChipClick={(chipId) => {
                    category.onChipClick?.(category.name, chipId);
                  }}
                  onAddClick={() => {
                    category.onAddClick?.(category.name);
                  }}
                  onCustomChipConfirm={(chipId, value) => {
                    category.onCustomChipConfirm?.(category.name, chipId, value);
                  }}
                  onCustomChipClose={(chipId) => {
                    category.onCustomChipClose?.(category.name, chipId);
                  }}
                  showAddButton={true}
                  addButtonText="" // Empty text for icon-only circular button
                  className="w-full"
                />
              ))}
            </div>
          )}
          {/* Footer: Description */}
      {description && (
            <div className="border-t border-black border-solid pt-[16px] relative shrink-0 w-full">
              <p className={`${descriptionClass} text-black`}>
                {description}
              </p>
            </div>
          )}
        </>
      ) : (
        /* Collapsed State: Description */
        description && (
          <div className="flex items-center justify-center relative shrink-0 w-full">
            <p className={`${descriptionClass} text-black flex-1`}>
          {description}
        </p>
          </div>
        )
      )}
    </div>
  );
}
