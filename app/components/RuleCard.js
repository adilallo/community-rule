"use client";

const RuleCard = ({
  title,
  description,
  icon,
  backgroundColor = "bg-[var(--color-community-teal-100)]",
  className = "",
  onClick,
}) => {
  const handleClick = () => {
    // Basic analytics event tracking
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "template_selected", {
        template_name: title,
        template_type: "governance_pattern",
      });
    }

    // Custom analytics event for other tracking systems
    if (typeof window !== "undefined" && window.analytics) {
      window.analytics.track("Template Selected", {
        templateName: title,
        templateType: "governance_pattern",
      });
    }

    if (onClick) onClick();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`${backgroundColor} rounded-[var(--radius-measures-radius-small)] pt-[var(--spacing-scale-012)] pr-[var(--spacing-scale-012)] pl-[var(--spacing-scale-012)] pb-[var(--spacing-scale-024)] md:p-[var(--spacing-scale-024)] md:h-[210px] lg:h-[277px] flex flex-col gap-[18px] shadow-lg backdrop-blur-sm transition-all duration-500 ease-in-out hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--color-community-teal-500)] focus:ring-offset-2 cursor-pointer min-h-[44px] min-w-[44px] ${className}`}
      tabIndex={0}
      role="button"
      aria-label={`Learn more about ${title} governance pattern`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Header Container */}
      <div className="grid grid-cols-[auto_1fr] h-[72px] md:h-[80px] lg:h-[138px] border-b border-[var(--color-surface-default-primary)]">
        {/* Icon Container */}
        {icon && (
          <div className="p-[var(--spacing-scale-016)] md:p-[var(--spacing-scale-012)] lg:p-[var(--spacing-scale-024)] border-r border-[var(--color-surface-default-primary)] w-fit flex items-center justify-center">
            {icon}
          </div>
        )}
        {/* Title Container */}
        {title && (
          <div className="pl-[var(--spacing-scale-008)] md:pl-[var(--spacing-scale-012)] lg:pl-[var(--spacing-scale-024)] flex items-center gap-[var(--spacing-scale-004)]">
            <h3 className="font-space-grotesk font-bold text-[20px] md:text-[28px] lg:text-[36px] leading-[28px] md:leading-[36px] lg:leading-[44px] text-[--color-content-inverse-primary]">
              {title}
            </h3>
          </div>
        )}
      </div>
      {description && (
        <p className="font-inter font-medium text-[12px] md:text-[14px] lg:text-[18px] leading-[14px] md:leading-[16px] lg:leading-[24px] text-[var(--color-content-inverse-primary)]">
          {description}
        </p>
      )}
    </div>
  );
};

export default RuleCard;
