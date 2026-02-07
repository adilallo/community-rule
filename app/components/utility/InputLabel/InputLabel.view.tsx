"use client";

import { memo } from "react";
import { getAssetPath, ASSETS } from "../../../../lib/assetUtils";
import type { InputLabelViewProps } from "./InputLabel.types";

function InputLabelView({
  label,
  helpIcon,
  asterisk,
  helperText,
  size,
  palette,
  className = "",
}: InputLabelViewProps) {
  const isSmall = size === "s";
  const isInverse = palette === "inverse";

  // Size-based typography
  const labelTextSize = isSmall
    ? "text-[length:var(--sizing-350,14px)] leading-[20px]"
    : "text-[length:var(--sizing-400,16px)] leading-[24px]";

  const helperTextSize = isSmall
    ? "text-[length:var(--measures-sizing-250,10px)] leading-[var(--measures-spacing-350,14px)]"
    : "text-[length:var(--sizing-300,12px)] leading-[16px]";

  const asteriskSize = isSmall
    ? "text-[length:var(--measures-sizing-250,10px)] leading-[var(--measures-spacing-300,12px)]"
    : "text-[length:var(--measures-spacing-300,12px)] leading-[var(--measures-spacing-300,12px)]";

  // Palette-based colors
  const labelColor = isInverse
    ? "text-[color:var(--color-content-inverse-secondary,#1f1f1f)]"
    : "text-[color:var(--color-content-default-secondary,#d2d2d2)]";

  const helperTextColor = "text-[color:var(--color-content-default-tertiary,#b4b4b4)]";

  // Layout: S uses flex-wrap with baseline, M uses flex with center
  const containerClass = isSmall
    ? "flex flex-wrap gap-[var(--measures-spacing-200,4px_8px)] items-baseline pr-[var(--measures-spacing-100,4px)] relative w-full"
    : "flex gap-[4px] items-center relative w-full";

  const labelContainerClass = isSmall
    ? "flex gap-[var(--measures-spacing-050,2px)] items-center relative shrink-0"
    : "flex gap-[var(--measures-spacing-100,4px)] items-center relative shrink-0";

  const helpIconSize = isSmall ? "size-[12px]" : "size-[16px]";

  // Help icon color filter based on palette
  // Default: Light yellow (#f6f06f / rgba(246, 240, 111, 1)) - SVG already has this color
  // Inverse: Dark yellow (#8c8505 / rgba(140, 133, 5, 1))
  // For default, no filter needed as SVG already has the correct yellow
  // For inverse, darken the yellow
  const helpIconFilter = isInverse
    ? "brightness(0.57) saturate(100%)" // Dark yellow (#8c8505) - darken the existing yellow
    : undefined; // No filter for default - use SVG's native yellow color

  return (
    <div className={`${containerClass} ${className}`}>
      <div className={labelContainerClass}>
        <div className="flex gap-px items-start relative shrink-0">
          <p
            className={`font-inter font-normal ${labelTextSize} ${labelColor} relative shrink-0`}
          >
            {label}
          </p>
          {asterisk && (
            <p
              className={`font-inter font-medium ${asteriskSize} relative shrink-0 text-[color:var(--color-content-default-negative-primary,#ea4845)]`}
            >
              *
            </p>
          )}
        </div>
        {helpIcon && (
          <div className={`relative shrink-0 ${helpIconSize}`}>
            <img
              src={getAssetPath(ASSETS.ICON_HELP)}
              alt="Help"
              className="block max-w-none size-full"
              style={
                helpIconFilter
                  ? {
                      filter: helpIconFilter,
                    }
                  : undefined
              }
            />
          </div>
        )}
      </div>
      {helperText && (
        <p
          className={`flex-[1_0_0] font-inter font-normal ${helperTextSize} min-h-px min-w-px relative ${helperTextColor} text-right`}
        >
          {typeof helperText === "string" ? helperText : "Optional text"}
        </p>
      )}
    </div>
  );
}

InputLabelView.displayName = "InputLabelView";

export default memo(InputLabelView);
