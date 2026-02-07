"use client";

import Image from "next/image";
import { useTranslation } from "../../../contexts/MessagesContext";
import MultiSelect from "../../controls/MultiSelect";
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
  
  // Card dimensions - use CSS classes from className if provided, otherwise use size-based logic
  // Check if className already has padding/gap classes
  const hasResponsivePadding = className?.includes("p-[") || className?.includes("px-[") || className?.includes("py-[") || className?.includes("pt-[") || className?.includes("pb-[");
  const hasResponsiveGap = className?.includes("gap-[");
  
  const cardPadding = hasResponsivePadding
    ? "" // If className has responsive padding, don't add size-based padding
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

  // Logo/Icon dimensions - use CSS responsive classes
  // For S: 80px container with 12px padding = 56px icon area
  // For XS: 72px container with 16px padding = 40px icon (72 - 16*2 = 40px)
  const logoSize = 103; // Use max size, CSS will resize
  const logoContainerClass = `
    max-[639px]:size-[72px]
    min-[640px]:max-[1023px]:size-[80px]
    min-[1024px]:max-[1439px]:size-[56px]
    min-[1440px]:size-[103px]
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
      const isLocalhost = logoUrl.startsWith("http://localhost") || logoUrl.startsWith("https://localhost");
      
      const containerClass = `${logoContainerClass} relative rounded-full overflow-hidden mix-blend-luminosity max-[639px]:p-[16px] min-[640px]:max-[1023px]:p-[12px]`;
      
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
        <div className={`${logoContainerClass} flex items-center justify-center max-[639px]:p-[16px] min-[640px]:max-[1023px]:p-[12px]`}>
          {icon}
        </div>
      );
    }
    
    if (communityInitials) {
      const initialsSize = `
        max-[639px]:text-[16px]
        min-[640px]:max-[1023px]:text-[20px]
        min-[1024px]:max-[1439px]:text-[24px]
        min-[1440px]:text-[36px]
      `;
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


  // Border radius - use CSS classes if provided via className, otherwise use size-based logic
  const borderRadiusClass = className?.includes("rounded-") 
    ? "" // If className already has border radius, don't add size-based one
    : isExtraSmall 
    ? "rounded-[var(--measures-radius-200,8px)]" 
    : isSmall 
    ? "rounded-[var(--measures-radius-300,12px)]" 
    : "rounded-[var(--radius-measures-radius-small)]";

  return (
    <div
      className={`${backgroundColor} ${cardPadding} ${cardGap} ${borderRadiusClass} shadow-[0px_0px_48px_0px_rgba(0,0,0,0.1)] hover:shadow-[0px_0px_64px_0px_rgba(0,0,0,0.15)] transition-shadow duration-200 flex flex-col items-start justify-center relative ${cardWidth || "w-full"} ${className || ""}`}
      tabIndex={0}
      role="button"
      aria-label={ariaLabel}
      aria-expanded={expanded}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {/* Outermost container with bottom border - taller to match Figma */}
      <div className={`
        border-b border-black border-solid flex items-center relative shrink-0 w-full
        max-[639px]:h-[72px]
        min-[640px]:max-[1023px]:h-[80px]
        min-[1024px]:max-[1439px]:h-[88px]
        min-[1440px]:h-[136px]
      `}>
        {/* Logo/Icon - fixed width/height, vertically centered, does not touch bottom */}
        {renderLogo() && (
          <div className={`
            flex items-center justify-center shrink-0
            max-[639px]:w-[72px] max-[639px]:h-[72px] max-[639px]:border-r max-[639px]:border-black max-[639px]:border-solid
            min-[640px]:max-[1023px]:w-[80px] min-[640px]:max-[1023px]:h-[80px] min-[640px]:max-[1023px]:border-r min-[640px]:max-[1023px]:border-black min-[640px]:max-[1023px]:border-solid
            min-[1024px]:max-[1439px]:w-[56px] min-[1024px]:max-[1439px]:h-[56px]
            min-[1440px]:w-[103px] min-[1440px]:h-[103px]
          `}>
            {renderLogo()}
          </div>
        )}
        {/* Spacing between icon and title */}
        <div className="
          max-[1023px]:hidden
          min-[1024px]:w-[16px] min-[1024px]:shrink-0
        " />
        {/* Container with no padding and left border - extends full height to touch bottom */}
        {title && (
          <div className={`
            flex-1 min-w-0 h-full flex
            max-[1023px]:border-0
            min-[1024px]:border-l min-[1024px]:border-black min-[1024px]:border-solid
          `}>
            {/* Inner container for header text with padding */}
            <div className={`
              flex items-center justify-center w-full
              max-[639px]:pl-[8px] max-[639px]:py-[8px]
              min-[640px]:max-[1023px]:pl-[12px] min-[640px]:max-[1023px]:py-[12px]
              min-[1024px]:max-[1439px]:px-[16px] min-[1024px]:max-[1439px]:py-[12px]
              min-[1440px]:px-[16px] min-[1440px]:py-[24px]
            `}>
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
                  addButton={true}
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
