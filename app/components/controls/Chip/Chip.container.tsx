"use client";

import { memo, useState, useEffect, useRef } from "react";
import ChipView from "./Chip.view";
import type { ChipProps } from "./Chip.types";
import {
  normalizeChipPalette,
  normalizeChipSize,
  normalizeChipState,
} from "../../../../lib/propNormalization";

const ChipContainer = memo<ChipProps>(
  ({
    label,
    state: stateProp = "Unselected",
    palette: paletteProp = "Default",
    size: sizeProp = "S",
    className = "",
    disabled,
    onClick,
    onRemove,
    onCheck,
    onClose,
    ariaLabel,
  }) => {
    const state = normalizeChipState(stateProp);
    const palette = normalizeChipPalette(paletteProp);
    const size = normalizeChipSize(sizeProp);

    const isDisabled = disabled ?? state === "disabled";
    const isCustom = state === "custom";

    // Manage input value for custom state
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when custom state is active
    useEffect(() => {
      if (isCustom && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isCustom]);

    const handleCheck = (value: string, event: React.MouseEvent<HTMLButtonElement>) => {
      if (onCheck && value.trim()) {
        onCheck(value.trim(), event);
        // Reset input after successful check
        setInputValue("");
      }
    };

    const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (onClose) {
        onClose(event);
      } else if (onRemove) {
        // Fallback to onRemove if onClose not provided
        onRemove(event);
      }
      // Reset input value when closing
      setInputValue("");
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && inputValue.trim() && onCheck) {
        event.preventDefault();
        handleCheck(inputValue.trim(), event as unknown as React.MouseEvent<HTMLButtonElement>);
      } else if (event.key === "Escape" && onClose) {
        event.preventDefault();
        handleClose(event as unknown as React.MouseEvent<HTMLButtonElement>);
      }
    };

    return (
      <ChipView
        label={label}
        state={state}
        palette={palette}
        size={size}
        className={className}
        disabled={isDisabled}
        onClick={onClick}
        onRemove={onRemove}
        onCheck={handleCheck}
        onClose={handleClose}
        inputValue={isCustom ? inputValue : undefined}
        onInputChange={isCustom ? setInputValue : undefined}
        onInputKeyDown={isCustom ? handleKeyDown : undefined}
        inputRef={isCustom ? inputRef : undefined}
        ariaLabel={ariaLabel}
      />
    );
  },
);

ChipContainer.displayName = "Chip";

export default ChipContainer;

