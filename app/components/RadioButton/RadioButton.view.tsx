import type { RadioButtonViewProps } from "./RadioButton.types";

export function RadioButtonView({
  radioId,
  checked,
  mode,
  disabled,
  label,
  name,
  value,
  ariaLabel,
  className,
  combinedBoxStyles,
  labelColor,
  onToggle,
  onKeyDown,
}: RadioButtonViewProps) {
  return (
    <label
      className={`inline-flex items-center gap-[8px] cursor-pointer select-none ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      } ${className}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onToggle}
    >
      <span
        onKeyDown={onKeyDown}
        className={`group ${combinedBoxStyles} ${disabled ? "" : "cursor-pointer"}`}
        tabIndex={disabled ? -1 : 0}
        role="radio"
        aria-checked={checked}
        {...(disabled && { "aria-disabled": true })}
        {...(ariaLabel && { "aria-label": ariaLabel })}
        {...(label && !ariaLabel && { "aria-labelledby": `${radioId}-label` })}
        id={radioId}
      >
        {/* Radio dot - 16px size per Figma */}
        {/* Selected hover state: darker dot color (#333000) per Figma */}
        <div
          className={`w-[16px] h-[16px] rounded-full transition-all duration-200 ${
            checked && mode === "standard"
              ? "bg-[var(--color-content-default-brand-primary,#fefcc9)] group-hover:!bg-[#333000]"
              : checked && mode === "inverse"
              ? "bg-[var(--color-content-default-primary,#000000)]"
              : "bg-transparent"
          }`}
        />
      </span>
      {label && (
        <span
          id={`${radioId}-label`}
          className="font-inter text-[14px] leading-[18px]"
          style={{ color: labelColor }}
        >
          {label}
        </span>
      )}
      {/* Hidden input for form submission */}
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => {}}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
    </label>
  );
}
