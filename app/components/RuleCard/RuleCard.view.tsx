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
  
  // Card dimensions - fixed width for expanded states (568px for L, 398px for M per Figma)
  const cardPadding = isLarge ? "p-[24px]" : "p-[16px]";
  const cardGap = expanded
    ? "gap-[16px]"
    : isLarge ? "gap-[10px]" : "gap-[12px]";
  const cardWidth = expanded
    ? isLarge
      ? "w-[568px]"
      : "w-[398px]"
    : "";

  // Logo/Icon dimensions
  const logoSize = isLarge ? 103 : 56;
  const logoContainerClass = isLarge
    ? "size-[103px]"
    : "size-[56px]";

  // Title typography
  const titleClass = isLarge
    ? "font-bricolage-grotesque font-extrabold text-[36px] leading-[44px]"
    : "font-bricolage-grotesque font-bold text-[24px] leading-[32px]";

  // Description typography
  const descriptionClass = isLarge
    ? "font-inter font-medium text-[18px] leading-[24px]"
    : "font-inter font-medium text-[14px] leading-[16px]";

  // Render logo/icon
  const renderLogo = () => {
    if (logoUrl) {
      // Check if it's a localhost URL or external URL that needs regular img tag
      const isLocalhost = logoUrl.startsWith("http://localhost") || logoUrl.startsWith("https://localhost");
      
      if (isLocalhost) {
        return (
          <div className={`${logoContainerClass} relative rounded-full overflow-hidden mix-blend-luminosity`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={logoAlt || title}
              width={logoSize}
              height={logoSize}
              className="absolute inset-0 w-full h-full object-cover rounded-full"
            />
          </div>
        );
      }
      
      return (
        <div className={`${logoContainerClass} relative rounded-full overflow-hidden mix-blend-luminosity`}>
          <Image
            src={logoUrl}
            alt={logoAlt || title}
            width={logoSize}
            height={logoSize}
            className="absolute inset-0 w-full h-full object-cover rounded-full"
          />
        </div>
      );
    }
    
    if (icon) {
      return (
        <div className={`${logoContainerClass} flex items-center justify-center`}>
          {icon}
        </div>
      );
    }
    
    if (communityInitials) {
      return (
        <div className={`${logoContainerClass} rounded-full bg-[var(--color-surface-default-primary)] flex items-center justify-center`}>
          <span className={`${isLarge ? "text-[36px]" : "text-[24px]"} font-bricolage-grotesque font-bold text-[var(--color-content-default-primary,white)]`}>
            {communityInitials}
          </span>
        </div>
      );
    }
    
    return null;
  };


  return (
    <div
      className={`${backgroundColor} ${cardPadding} ${cardGap} rounded-[var(--radius-measures-radius-small)] shadow-[0px_0px_48px_0px_rgba(0,0,0,0.1)] hover:shadow-[0px_0px_64px_0px_rgba(0,0,0,0.15)] transition-shadow duration-200 flex flex-col items-start justify-center relative ${cardWidth || "w-full"} ${className}`}
      tabIndex={0}
      role="button"
      aria-label={ariaLabel}
      aria-expanded={expanded}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {/* Outermost container with bottom border - taller to match Figma */}
      <div className={`border-b border-black border-solid flex items-center relative shrink-0 w-full ${isLarge ? "h-[136px]" : "h-[88px]"}`}>
        {/* Logo/Icon - fixed width/height, vertically centered, does not touch bottom */}
        {renderLogo() && (
          <div className={`flex items-center justify-center shrink-0 ${isLarge ? "w-[103px] h-[103px]" : "w-[56px] h-[56px]"}`}>
            {renderLogo()}
          </div>
        )}
        {/* 16px spacing */}
        <div className="w-[16px] shrink-0" />
        {/* Container with no padding and left border - extends full height to touch bottom */}
        {title && (
          <div className="border-l border-black border-solid flex-1 min-w-0 h-full flex">
            {/* Inner container for header text with padding */}
            <div className={`flex ${isLarge ? "px-[16px] py-[24px]" : "px-[16px] py-[12px]"} items-center justify-center w-full`}>
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
