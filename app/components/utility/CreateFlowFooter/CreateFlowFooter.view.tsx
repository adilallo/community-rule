import ProportionBar from "../../progress/ProportionBar";
import Button from "../../buttons/Button";
import type { CreateFlowFooterProps } from "./CreateFlowFooter.types";

export function CreateFlowFooterView({
  secondButton,
  progressBar = true,
  className = "",
}: CreateFlowFooterProps) {
  return (
    <footer
      className={`sticky bottom-0 z-50 bg-black w-full ${className}`}
      role="contentinfo"
      aria-label="Create Flow Footer"
    >
      {/* Progress Bar - Top */}
      {progressBar && (
        <div className="px-[var(--spacing-measures-spacing-500,20px)] md:px-[var(--spacing-measures-spacing-1200,48px)] pt-[var(--spacing-measures-spacing-300,12px)]">
          <ProportionBar progress="1-0" />
        </div>
      )}

      {/* Buttons Container */}
      <div className="flex items-center justify-between mx-auto max-w-[639px] md:max-w-[1920px] px-[var(--spacing-measures-spacing-500,20px)] md:px-[var(--spacing-measures-spacing-1200,48px)] py-[var(--spacing-measures-spacing-300,12px)] gap-[var(--spacing-measures-spacing-300,12px)]">
        {/* Back Button - Left */}
        <Button
          buttonType="ghost"
          palette="default"
          size="xsmall"
          className="md:!text-[14px] md:!leading-[16px] !text-[12px] !leading-[14px] !px-[var(--spacing-measures-spacing-200,8px)] md:!px-[var(--spacing-measures-spacing-250,10px)] !py-[var(--spacing-measures-spacing-200,8px)] md:!py-[var(--spacing-measures-spacing-250,10px)]"
        >
          Back
        </Button>

        {/* Second Button - Right */}
        {secondButton && (
          <div className="flex-shrink-0">{secondButton}</div>
        )}
      </div>
    </footer>
  );
}
