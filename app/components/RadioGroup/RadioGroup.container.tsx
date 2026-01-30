"use client";

import { memo, useCallback, useId } from "react";
import { RadioGroupView } from "./RadioGroup.view";
import type { RadioGroupProps } from "./RadioGroup.types";

const RadioGroupContainer = ({
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
    <RadioGroupView
      groupId={groupId}
      value={value}
      mode={mode}
      state={state}
      disabled={disabled}
      options={options}
      className={className}
      ariaLabel={props["aria-label"]}
      onOptionChange={handleChange}
    />
  );
};

RadioGroupContainer.displayName = "RadioGroup";

export default memo(RadioGroupContainer);
