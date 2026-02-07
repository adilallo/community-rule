import { getAssetPath } from "../../../../lib/assetUtils";
import type { ModalHeaderProps } from "./ModalHeader.types";

export function ModalHeaderView({
  onClose,
  onMoreOptions,
  showCloseButton = true,
  showMoreOptionsButton = true,
  className = "",
}: ModalHeaderProps) {
  return (
    <div
      className={`border-b border-[var(--color-border-default-secondary)] h-[48px] shrink-0 sticky top-0 bg-[var(--color-surface-default-primary)] z-[2] ${className}`}
    >
      {/* Close Button - Left */}
      {showCloseButton && (
        <button
          onClick={onClose}
          className="absolute bg-[var(--color-surface-default-secondary)] h-[24px] w-[24px] rounded-full left-[24px] top-[12px] flex items-center justify-center cursor-pointer"
          aria-label="Close dialog"
        >
          <img
            src={getAssetPath("assets/Icon_Close.svg")}
            alt=""
            className="w-[16px] h-[16px]"
            style={{
              filter: "brightness(0) invert(1)",
            }}
          />
        </button>
      )}

      {/* More Options Button - Right */}
      {showMoreOptionsButton && (
        <button
          onClick={onMoreOptions}
          className="absolute bg-[var(--color-surface-default-secondary)] h-[24px] w-[24px] rounded-full right-[24px] top-[12px] flex items-center justify-center cursor-pointer"
          aria-label="More options"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="4" cy="8" r="1.5" fill="white" />
            <circle cx="8" cy="8" r="1.5" fill="white" />
            <circle cx="12" cy="8" r="1.5" fill="white" />
          </svg>
        </button>
      )}
    </div>
  );
}
