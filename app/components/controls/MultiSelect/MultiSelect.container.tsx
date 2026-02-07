"use client";

import { memo } from "react";
import MultiSelectView from "./MultiSelect.view";
import type { MultiSelectProps } from "./MultiSelect.types";
import { normalizeMultiSelectSize, normalizeChipPalette } from "../../../../lib/propNormalization";

const MultiSelectContainer = memo<MultiSelectProps>(
  ({
    label,
    showHelpIcon = true,
    size: sizeProp = "M",
    palette: paletteProp = "Default",
    options,
    onChipClick,
    onAddClick,
    showAddButton: showAddButtonProp,
    addButton: addButtonProp,
    addButtonText = "Add organization type",
    formHeader = true,
    onCustomChipConfirm,
    onCustomChipClose,
    className = "",
  }) => {
    const size = normalizeMultiSelectSize(sizeProp);
    const palette = normalizeChipPalette(paletteProp);
    // Backward compatibility: if addButton is provided, use it; otherwise use showAddButton
    const showAddButton = addButtonProp !== undefined ? addButtonProp : (showAddButtonProp !== undefined ? showAddButtonProp : true);

    return (
      <MultiSelectView
        label={label}
        showHelpIcon={showHelpIcon}
        size={size}
        palette={palette}
        options={options}
        onChipClick={onChipClick}
        onAddClick={onAddClick}
        showAddButton={showAddButton}
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
