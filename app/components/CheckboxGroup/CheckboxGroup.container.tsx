"use client";

import { memo, useCallback, useId, useState, useEffect } from "react";
import { CheckboxGroupView } from "./CheckboxGroup.view";
import type { CheckboxGroupProps } from "./CheckboxGroup.types";

const CheckboxGroupContainer = ({
  name,
  value,
  onChange,
  mode = "standard",
  disabled = false,
  options = [],
  className = "",
  ...props
}: CheckboxGroupProps) => {
  // Generate unique ID for accessibility if not provided
  const generatedId = useId();
  const groupId = name || `checkbox-group-${generatedId}`;

  // Internal state to track checked values
  const [checkedValues, setCheckedValues] = useState<string[]>(value || []);

  // Sync internal state with external value prop
  useEffect(() => {
    if (value !== undefined) {
      setCheckedValues(value);
    }
  }, [value]);

  const handleOptionChange = useCallback(
    (optionValue: string, checked: boolean) => {
      if (disabled) return;

      const newCheckedValues = checked
        ? [...checkedValues, optionValue]
        : checkedValues.filter((v) => v !== optionValue);

      setCheckedValues(newCheckedValues);

      if (onChange) {
        onChange({ value: newCheckedValues });
      }
    },
    [disabled, checkedValues, onChange],
  );

  return (
    <CheckboxGroupView
      groupId={groupId}
      value={checkedValues}
      mode={mode}
      disabled={disabled}
      options={options}
      className={className}
      ariaLabel={props["aria-label"]}
      onOptionChange={handleOptionChange}
    />
  );
};

CheckboxGroupContainer.displayName = "CheckboxGroup";

export default memo(CheckboxGroupContainer);
