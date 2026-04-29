"use client";

import { memo } from "react";
import { SelectionView } from "./Selection.view";
import type { SelectionProps } from "./Selection.types";

/**
 * Figma: "Card / CardSelection" — stacked tile e.g. `16775:28762` (recommended + label + supportText).
 * `orientation="horizontal"` selects that vertical stack; `"vertical"` is label + optional info icon with tag on the right (CardStack expanded / single-column).
 */
const SelectionContainer = memo<SelectionProps>(
  ({
    label,
    supportText = "",
    recommended = false,
    selected = false,
    orientation = "horizontal",
    showInfoIcon = false,
    id,
    className = "",
    onClick,
  }) => {
    const handleClick = () => {
      if (onClick) onClick();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClick();
      }
    };

    return (
      <SelectionView
        label={label}
        supportText={supportText}
        recommended={recommended}
        selected={selected}
        orientation={orientation}
        showInfoIcon={showInfoIcon}
        id={id}
        className={className}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      />
    );
  },
);

SelectionContainer.displayName = "Selection";

export default SelectionContainer;
