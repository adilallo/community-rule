import type { TooltipViewProps } from "./Tooltip.types";

export function TooltipView({
  text,
  position,
  className: _className,
  tooltipClasses,
  pointerClasses,
}: TooltipViewProps) {
  // Pointer is 10px tall with 7px sticking out
  // Icon_Pointer.svg is 14x8, scale to 10px height = 17.5px width
  const pointerWidth = 17.5;
  const pointerHeight = 10;
  const pointerRotation = position === "top" ? "rotate-180" : "rotate-0";

  return (
    <div
      className={tooltipClasses}
      role="tooltip"
      aria-live="polite"
      id={`tooltip-${text.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <p className="font-inter text-[var(--sizing-350,14px)] leading-[16px] font-medium tracking-[0%] text-[var(--color-content-inverse-primary)] relative shrink-0">
        {text}
      </p>
      <div
        className={pointerClasses}
        style={{ width: `${pointerWidth}px`, height: `${pointerHeight}px` }}
      >
        <svg
          className={`${pointerRotation} w-full h-full`}
          viewBox="0 0 14 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M6.92822 0L13.8564 7.5H1.95503e-05L6.92822 0Z"
            fill="var(--color-surface-default-primary)"
          />
        </svg>
      </div>
    </div>
  );
}
