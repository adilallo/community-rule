"use client";

import { memo, useCallback, useId } from "react";
import { RadioGroupView } from "./RadioGroup.view";
import type { RadioGroupProps } from "./RadioGroup.types";
import { normalizeMode, normalizeState } from "../../../../lib/propNormalization";

const RadioGroupContainer = ({
  name,
  value,
  onChange,
  mode: modeProp = "standard",
  state: stateProp = "default",
  disabled = false,
  options = [],
  className = "",
  ...props
}: RadioGroupProps) => {
  // Normalize props to handle both PascalCase (Figma) and lowercase (codebase)
  const mode = normalizeMode(modeProp);
  // Normalize state, but handle "With Subtext" separately (it's represented by options with subtext)
  const state = typeof stateProp === "string" && 
    (stateProp.toLowerCase() === "with subtext" || stateProp === "With Subtext")
    ? "default" // "With Subtext" is handled via RadioOption.subtext, use default state
    : normalizeState(stateProp);
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
