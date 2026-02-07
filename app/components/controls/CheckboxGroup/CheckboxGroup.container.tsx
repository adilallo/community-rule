"use client";

import { memo, useCallback, useId, useState } from "react";
import { CheckboxGroupView } from "./CheckboxGroup.view";
import type { CheckboxGroupProps } from "./CheckboxGroup.types";
import { normalizeMode } from "../../../../lib/propNormalization";

const CheckboxGroupContainer = ({
  name,
  value,
  onChange,
  mode: modeProp = "standard",
  disabled = false,
  options = [],
  className = "",
  ...props
}: CheckboxGroupProps) => {
  // Normalize props to handle both PascalCase (Figma) and lowercase (codebase)
  const mode = normalizeMode(modeProp);
  // Generate unique ID for accessibility if not provided
  const generatedId = useId();
  const groupId = name || `checkbox-group-${generatedId}`;

  // Internal state to track checked values (only used if value prop is not provided)
  const [internalCheckedValues, setInternalCheckedValues] = useState<string[]>([]);
  
  // Use controlled value if provided, otherwise use internal state
  const checkedValues = value !== undefined ? value : internalCheckedValues;

  const handleOptionChange = useCallback(
    (optionValue: string, checked: boolean) => {
      if (disabled) return;

      const newCheckedValues = checked
        ? [...checkedValues, optionValue]
        : checkedValues.filter((v) => v !== optionValue);

      // Only update internal state if uncontrolled
      if (value === undefined) {
        setInternalCheckedValues(newCheckedValues);
      }

      if (onChange) {
        onChange({ value: newCheckedValues });
      }
    },
    [disabled, checkedValues, onChange, value],
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
