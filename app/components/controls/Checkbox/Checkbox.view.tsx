import type { CheckboxViewProps } from "./Checkbox.types";

export function CheckboxView({
  labelId,
  checked,
  disabled,
  label,
  name,
  value,
  className,
  combinedBoxStyles,
  checkGlyphColor,
  labelColor,
  accessibilityProps,
  onToggle,
  onKeyDown,
}: CheckboxViewProps) {
  return (
    <label
      className={`inline-flex items-center gap-[8px] cursor-pointer select-none ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      } ${className}`}
      onMouseDown={(e) => e.preventDefault()}
    >
      <span
        {...accessibilityProps}
        onClick={onToggle}
        onKeyDown={onKeyDown}
        className={`${combinedBoxStyles} p-[4px] ${disabled ? "" : "cursor-pointer"}`}
      >
        {/* Checkmark SVG per Figma - 16px size */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 12 12"
          aria-hidden="true"
          focusable="false"
          className="block"
        >
          <polyline
            points="2.5 6 5 8.5 10 3.5"
            stroke={checkGlyphColor}
            strokeWidth="1.25"
            fill="none"
            strokeLinecap="square"
            strokeLinejoin="miter"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </span>
      {label && (
        <span
          id={labelId}
          className="font-inter text-[14px] leading-[18px]"
          style={{ color: labelColor }}
        >
          {label}
        </span>
      )}
      {/* Hidden native input for form compatibility */}
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={() => {}}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
        readOnly
      />
    </label>
  );
}
