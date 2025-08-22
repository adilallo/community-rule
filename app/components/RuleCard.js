"use client";

const RuleCard = ({
  title,
  description,
  icon,
  backgroundColor = "bg-[var(--color-community-teal-100)]",
  className = "",
}) => {
  return (
    <div
      className={`${backgroundColor} rounded-[var(--spacing-scale-012)] pt-[var(--spacing-scale-012)] pr-[var(--spacing-scale-012)] pl-[var(--spacing-scale-012)] pb-[var(--spacing-scale-024)] flex flex-col gap-[18px] shadow-lg backdrop-blur-sm ${className}`}
    >
      {/* Header Container */}
      <div className="grid grid-cols-[auto_1fr] h-[72px] border-b border-[var(--color-surface-default-primary)]">
        {/* Icon Container */}
        {icon && (
          <div className="p-[var(--spacing-scale-016)] border-r border-[var(--color-surface-default-primary)] w-fit flex items-center justify-center">
            {icon}
          </div>
        )}
        {/* Title Container */}
        {title && (
          <div className="pl-[var(--spacing-scale-008)] flex items-center gap-[var(--spacing-scale-004)]">
            <h3 className="font-space-grotesk font-bold text-[20px] leading-[28px] text-[--color-content-inverse-primary]">
              {title}
            </h3>
          </div>
        )}
      </div>
      {description && (
        <p className="font-inter font-medium text-[12px] leading-[14px] text-[var(--color-content-inverse-primary)]">
          {description}
        </p>
      )}
    </div>
  );
};

export default RuleCard;
