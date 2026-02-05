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
  const ariaLabel = t("ariaLabel").replace("{title}", title);

  // Size-based styling
  const isLarge = size === "L";
  
  // Card dimensions - make width flexible for grid layouts, but can be overridden via className
  // For standalone/preview use, add fixed width via className
  const cardPadding = isLarge ? "p-[24px]" : "p-[16px]";
  const cardGap = expanded
    ? "gap-[16px]"
    : isLarge ? "gap-[10px]" : "gap-[12px]";

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

  // Category label typography
  const categoryLabelClass = "font-inter font-normal text-[14px] leading-[20px]";

  // Pill typography
  const pillTextClass = "font-inter font-medium text-[12px] leading-[14px]";

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
          <span className={`${isLarge ? "text-[36px]" : "text-[24px]"} font-bricolage-grotesque font-bold text-[var(--color-content-inverse-primary)]`}>
            {communityInitials}
          </span>
        </div>
      );
    }
    
    return null;
  };


  return (
    <div
      className={`${backgroundColor} ${cardPadding} ${cardGap} rounded-[var(--radius-measures-radius-small)] shadow-[0px_0px_48px_0px_rgba(0,0,0,0.1)] flex flex-col items-start justify-center relative w-full ${className}`}
      tabIndex={0}
      role="button"
      aria-label={ariaLabel}
      aria-expanded={expanded}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {/* Header Container */}
      <div className={`border-b border-[var(--color-content-inverse-primary)] flex gap-[16px] items-center relative shrink-0 w-full ${isLarge ? "min-h-[103px]" : "min-h-[56px]"}`}>
        {/* Logo/Icon Container */}
        {renderLogo() && (
          <div className="flex items-center justify-center shrink-0">
            {renderLogo()}
          </div>
        )}
        {/* Title Container */}
        {title && (
          <div className={`border-l border-[var(--color-content-inverse-primary)] flex ${isLarge ? "px-[16px] py-[24px]" : "px-[16px] py-[12px]"} items-center justify-center flex-1 min-w-0`}>
            <h3 className={`${titleClass} text-[var(--color-content-inverse-primary)] overflow-hidden text-ellipsis w-full`}>
              {title}
            </h3>
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
            <div className="border-t border-[var(--color-content-inverse-primary)] pt-[16px] relative shrink-0 w-full">
              <p className={`${descriptionClass} text-[var(--color-content-inverse-primary)]`}>
                {description}
              </p>
            </div>
          )}
        </>
      ) : (
        /* Collapsed State: Description */
        description && (
          <div className="flex items-center justify-center relative shrink-0 w-full">
            <p className={`${descriptionClass} text-[var(--color-content-inverse-primary)] flex-1`}>
              {description}
            </p>
          </div>
        )
      )}
    </div>
  );
}
