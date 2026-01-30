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
