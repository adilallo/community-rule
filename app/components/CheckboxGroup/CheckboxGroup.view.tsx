import Checkbox from "../Checkbox";
import type { CheckboxGroupViewProps } from "./CheckboxGroup.types";

export function CheckboxGroupView({
  groupId,
  value,
  mode,
  disabled,
  options,
  className,
  ariaLabel,
  onOptionChange,
}: CheckboxGroupViewProps) {
  return (
    <div
      className={`space-y-[8px] ${className}`}
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const isChecked = value.includes(option.value);

        // If there's subtext, render checkbox without label and handle layout separately
        if (option.subtext) {
          return (
            <div
              key={option.value}
              className="flex gap-[8px] items-start"
            >
              <Checkbox
                checked={isChecked}
                mode={mode}
                disabled={disabled}
                name={groupId}
                value={option.value}
                ariaLabel={option.ariaLabel || option.label}
                onChange={({ checked }) => {
                  onOptionChange(option.value, checked);
                }}
              />
              <div className="flex flex-col gap-[4px] flex-1">
                <span
                  className={`font-inter text-[14px] leading-[20px] ${
                    mode === "inverse"
                      ? "text-[var(--color-content-inverse-primary)]"
                      : "text-[var(--color-content-default-primary)]"
                  }`}
                >
                  {option.label}
                </span>
                <span
                  className={`font-inter text-[14px] leading-[20px] ${
                    mode === "inverse"
                      ? "text-[var(--color-content-inverse-secondary,#1f1f1f)]"
                      : "text-[var(--color-content-default-tertiary,#b4b4b4)]"
                  }`}
                >
                  {option.subtext}
                </span>
              </div>
            </div>
          );
        }

        // If no subtext, use Checkbox's built-in label
        return (
          <Checkbox
            key={option.value}
            checked={isChecked}
            mode={mode}
            disabled={disabled}
            label={option.label}
            name={groupId}
            value={option.value}
            ariaLabel={option.ariaLabel}
            onChange={({ checked }) => {
              onOptionChange(option.value, checked);
            }}
          />
        );
      })}
    </div>
  );
}
