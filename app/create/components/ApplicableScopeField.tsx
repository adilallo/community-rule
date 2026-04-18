"use client";

/**
 * Shared "Applicable Scope" field used by the `decision-approaches` and
 * `conflict-management` create flow modals. Pairs an `InputLabel` with a
 * horizontally-wrapping list of toggle-chips plus an inline "+ Add" affordance
 * that reveals a pill text input for creating new scope values.
 */

import { memo, useState } from "react";
import Chip from "../../components/controls/Chip";
import InputLabel from "../../components/utility/InputLabel";

export interface ApplicableScopeFieldProps {
  /** Label rendered above the capsule row. */
  label: string;
  /** Text for the "+ Add …" affordance (e.g. "Add Applicable Scope"). */
  addLabel: string;
  /**
   * The full list of chip values shown to the user. Each value is a unique
   * string (chip label).
   */
  scopes: string[];
  /** Values currently toggled on (rendered in the Chip "Selected" state). */
  selectedScopes: string[];
  /** Fired when a chip is clicked; caller toggles inclusion in `selectedScopes`. */
  onToggleScope: (_scope: string) => void;
  /**
   * Fired when the user submits a new scope via the inline input. Duplicate
   * values (already in `scopes`) are filtered out before the callback fires.
   */
  onAddScope: (_scope: string) => void;
  /**
   * Optional placeholder for the inline input. Defaults to `addLabel`.
   */
  inputPlaceholder?: string;
  className?: string;
}

function ApplicableScopeFieldComponent({
  label,
  addLabel,
  scopes,
  selectedScopes,
  onToggleScope,
  onAddScope,
  inputPlaceholder,
  className = "",
}: ApplicableScopeFieldProps) {
  const [draft, setDraft] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const submitDraft = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setIsAdding(false);
      setDraft("");
      return;
    }
    if (!scopes.includes(trimmed)) {
      onAddScope(trimmed);
    }
    setDraft("");
    setIsAdding(false);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      <InputLabel label={label} helpIcon size="s" palette="default" />
      <div className="flex flex-wrap items-center gap-2">
        {scopes.map((scope) => {
          const isSelected = selectedScopes.includes(scope);
          return (
            <Chip
              key={scope}
              label={scope}
              state={isSelected ? "Selected" : "Disabled"}
              palette="Default"
              size="S"
              disabled={false}
              onClick={() => onToggleScope(scope)}
              ariaLabel={`${isSelected ? "Deselect" : "Select"} ${scope}`}
            />
          );
        })}
        {isAdding ? (
          <input
            type="text"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={submitDraft}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitDraft();
              } else if (e.key === "Escape") {
                setDraft("");
                setIsAdding(false);
              }
            }}
            placeholder={inputPlaceholder ?? addLabel}
            aria-label={inputPlaceholder ?? addLabel}
            className="h-[30px] rounded-[9999px] border border-[var(--color-border-default-tertiary)] bg-transparent px-3 font-inter text-[length:var(--sizing-300,12px)] font-medium leading-[14px] text-[color:var(--color-content-default-primary)] outline-none placeholder:text-[color:var(--color-content-default-tertiary)] focus-visible:border-[var(--color-border-default-brand-primary)]"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-[var(--measures-spacing-050,2px)] rounded-[var(--measures-radius-full,9999px)] px-[var(--space-250,10px)] py-[var(--measures-spacing-200,8px)] font-inter text-[length:var(--sizing-300,12px)] font-medium leading-[14px] text-[color:var(--color-content-default-primary)] hover:bg-[var(--color-surface-default-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-invert-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <AddGlyph />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function AddGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="block size-[14px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

ApplicableScopeFieldComponent.displayName = "ApplicableScopeField";

export default memo(ApplicableScopeFieldComponent);
