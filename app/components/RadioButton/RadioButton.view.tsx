import type { RadioButtonViewProps } from "./RadioButton.types";

export function RadioButtonView({
  radioId,
  checked,
  disabled,
  label,
  name,
  value,
  ariaLabel,
  className,
  combinedBoxStyles,
  defaultOutlineClass,
  conditionalHoverOutlineClass,
  conditionalFocusClass,
  backgroundWhenChecked,
  dotColor,
  labelColor,
  onToggle,
  onKeyDown,
  ...props
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
        className={`${combinedBoxStyles} ${defaultOutlineClass} ${conditionalHoverOutlineClass} ${conditionalFocusClass} p-[var(--measures-spacing-004)]`}
        style={{
          backgroundColor: backgroundWhenChecked,
        }}
        tabIndex={0}
        role="radio"
        aria-checked={checked}
        {...(disabled && { "aria-disabled": true })}
        {...(ariaLabel && { "aria-label": ariaLabel })}
        {...(label && !ariaLabel && { "aria-labelledby": `${radioId}-label` })}
        id={radioId}
        {...props}
      >
        {/* Radio dot */}
        <div
          className="w-[16px] h-[16px] rounded-full transition-all duration-200"
          style={{
            backgroundColor: dotColor,
          }}
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
