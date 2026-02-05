"use client";

import { memo } from "react";
import MultiSelectView from "./MultiSelect.view";
import type { MultiSelectProps } from "./MultiSelect.types";
import { normalizeMultiSelectSize } from "../../../lib/propNormalization";

const MultiSelectContainer = memo<MultiSelectProps>(
  ({
    label,
    showHelpIcon = true,
    size: sizeProp = "M",
    options,
    onChipClick,
    onAddClick,
    showAddButton = true,
    addButtonText = "Add organization type",
    onCustomChipConfirm,
    onCustomChipClose,
    className = "",
  }) => {
    const size = normalizeMultiSelectSize(sizeProp);

    return (
      <MultiSelectView
        label={label}
        showHelpIcon={showHelpIcon}
        size={size}
        options={options}
        onChipClick={onChipClick}
        onAddClick={onAddClick}
        showAddButton={showAddButton}
        addButtonText={addButtonText}
        onCustomChipConfirm={onCustomChipConfirm}
        onCustomChipClose={onCustomChipClose}
        className={className}
      />
    );
  },
);

MultiSelectContainer.displayName = "MultiSelect";

export default MultiSelectContainer;
