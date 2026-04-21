"use client";

import { memo } from "react";
import MultiSelectView from "./MultiSelect.view";
import type { MultiSelectProps } from "./MultiSelect.types";

/**
 * Figma: "Control / MultiSelect" (TODO(figma)). Labelled set of chips for
 * picking multiple values, with an optional add button for custom entries.
 */
const MultiSelectContainer = memo<MultiSelectProps>(
  ({
    label,
    showHelpIcon = true,
    size: sizeProp = "m",
    palette: paletteProp = "default",
    options,
    onChipClick,
    onAddClick,
    addButton: addButtonProp = true,
    addButtonText = "Add organization type",
    formHeader = true,
    onCustomChipConfirm,
    onCustomChipClose,
    className = "",
  }) => {
    const size = sizeProp;
    const palette = paletteProp;

    return (
      <MultiSelectView
        label={label}
        showHelpIcon={showHelpIcon}
        size={size}
        palette={palette}
        options={options}
        onChipClick={onChipClick}
        onAddClick={onAddClick}
        addButton={addButtonProp}
        addButtonText={addButtonText}
        formHeader={formHeader}
        onCustomChipConfirm={onCustomChipConfirm}
        onCustomChipClose={onCustomChipClose}
        className={className}
      />
    );
  },
);

MultiSelectContainer.displayName = "MultiSelect";

export default MultiSelectContainer;
