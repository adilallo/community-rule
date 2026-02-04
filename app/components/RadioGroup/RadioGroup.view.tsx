import RadioButton from "../RadioButton";
import type { RadioGroupViewProps } from "./RadioGroup.types";

export function RadioGroupView({
  groupId,
  value,
  mode,
  state,
  disabled,
  options,
  className,
  ariaLabel,
  onOptionChange,
}: RadioGroupViewProps) {
  return (
    <div
      className={`space-y-[8px] ${className}`}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const isSelected = value === option.value;

        // If there's subtext, render radio button without label and handle layout separately
        if (option.subtext) {
          return (
            <div
              key={option.value}
              className="flex gap-[8px] items-start"
            >
              <RadioButton
                checked={isSelected}
                mode={mode}
                state={state}
                disabled={disabled}
                name={groupId}
                value={option.value}
                ariaLabel={option.ariaLabel || option.label}
                onChange={({ checked }) => {
                  if (checked) {
                    onOptionChange(option.value);
                  }
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
                      : "text-[var(--color-content-default-secondary,#b4b4b4)]"
                  }`}
                >
                  {option.subtext}
                </span>
              </div>
            </div>
          );
        }

        // If no subtext, use RadioButton's built-in label
        return (
          <RadioButton
            key={option.value}
            checked={isSelected}
            mode={mode}
            state={state}
            disabled={disabled}
            label={option.label}
            name={groupId}
            value={option.value}
            ariaLabel={option.ariaLabel}
            onChange={({ checked }) => {
              if (checked) {
                onOptionChange(option.value);
              }
            }}
          />
        );
      })}
    </div>
  );
}
