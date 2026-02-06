import { memo } from "react";
import { getAssetPath } from "../../../lib/assetUtils";

interface HeaderTabProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  stretch?: boolean;
}

const HeaderTab = memo<HeaderTabProps>(
  ({ children, className = "", stretch = false, ...props }) => {
    const stretchClasses = stretch
      ? "flex-1 sm:mr-[var(--spacing-scale-008)] md:mr-[185px] lg:mr-[var(--spacing-scale-024)] xl:mr-[var(--spacing-scale-032)]"
      : "";

    return (
      <div
        className={`HeaderTab header-breakpoint-transition relative bg-[var(--color-surface-inverse-brand-primary)] rounded-t-[32px] sm:rounded-t-[32px] md:rounded-t-[32px] lg:rounded-t-[32px] xl:rounded-t-[32px] pl-[var(--spacing-scale-012)] h-[40px] sm:h-[52px] md:h-[52px] lg:h-[52px] xl:h-[64px] sm:pr-[var(--spacing-scale-006)] md:pl-[var(--spacing-scale-024)] lg:pl-[var(--spacing-scale-024)] xl:pl-[var(--spacing-scale-032)] md:pr-[var(--spacing-scale-012)] lg:pr-[var(--spacing-scale-048)] xl:pr-[var(--spacing-scale-120)] md:gap-[var(--spacing-scale-032)] ${stretchClasses} ${className}`}
        {...props}
      >
        {children}
        <img
          src={getAssetPath("assets/Union_xsm.svg")}
          alt=""
          role="presentation"
          className="absolute -bottom-[3px] -right-[52px] w-[61px] h-[24px] sm:w-[61px] sm:h-[31.5px] sm:hidden -z-10"
        />
        <img
          src={getAssetPath("assets/Union_sm_md_lg.svg")}
          alt=""
          role="presentation"
          className="absolute -bottom-[3.7px] -right-[53px] w-[61px] h-[24px] sm:w-[61px] sm:h-[31.5px] hidden sm:block xl:hidden -z-10"
        />
        <img
          src={getAssetPath("assets/Union_xlg.svg")}
          alt=""
          role="presentation"
          className="absolute -bottom-[6px] -right-[94px] w-[105px] h-[53px] hidden xl:block -z-10"
        />
      </div>
    );
  },
);

HeaderTab.displayName = "HeaderTab";

export default HeaderTab;
