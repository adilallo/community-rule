"use client";

import { memo, useCallback, useId } from "react";
import RadioButton from "./RadioButton";

interface RadioOption {
  value: string;
  label: string;
  ariaLabel?: string;
}

interface RadioGroupProps {
  name?: string;
  value?: string;
  onChange?: (_data: { value: string }) => void;
  mode?: "standard" | "inverse";
  state?: "default" | "hover" | "focus";
  disabled?: boolean;
  options?: RadioOption[];
  className?: string;
  "aria-label"?: string;
}

const RadioGroup = ({
  name,
  value,
  onChange,
  mode = "standard",
  state = "default",
  disabled = false,
  options = [],
  className = "",
  ...props
}: RadioGroupProps) => {
  // Generate unique ID for accessibility if not provided
  const generatedId = useId();
  const groupId = name || `radio-group-${generatedId}`;

  const handleChange = useCallback(
    (optionValue: string) => {
      if (!disabled && onChange) {
        onChange({ value: optionValue });
      }
    },
    [disabled, onChange],
  );

  return (
    <div
      className={`space-y-[8px] ${className}`}
      role="radiogroup"
      aria-label={props["aria-label"]}
      {...props}
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
                handleChange(option.value);
              }
            }}
          />
        );
      })}
    </div>
  );
};

RadioGroup.displayName = "RadioGroup";

export default memo(RadioGroup);
