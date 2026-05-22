"use client";

import { memo } from "react";
import { useTranslation } from "../../../contexts/MessagesContext";
import MultiSelectView from "./MultiSelect.view";
import type { MultiSelectProps } from "./MultiSelect.types";

/**
 * Figma: "Control / MultiSelect". Labelled set of chips for
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
    addButtonText,
    formHeader = true,
    onCustomChipConfirm,
    onCustomChipClose,
    className = "",
  }) => {
    const t = useTranslation("controlsChrome");
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
        addButtonAriaLabel={
          addButtonText || t("multiSelectAddFallback")
        }
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
