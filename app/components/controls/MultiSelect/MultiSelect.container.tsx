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
    addButton: addButtonProp = true,
    addButtonText = "Add organization type",
    formHeader = true,
    onCustomChipConfirm,
    onCustomChipClose,
    className = "",
  }) => {
    const size = normalizeMultiSelectSize(sizeProp);
    const palette = normalizeChipPalette(paletteProp);

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
