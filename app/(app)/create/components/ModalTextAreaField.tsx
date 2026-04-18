"use client";

/**
 * Shared "labelled text area" field used by every create flow modal section.
 * Pairs an `InputLabel` (with help icon) with a `TextArea` set to the embedded
 * appearance — matching the Figma "Control / Text Area" pattern.
 */

import { memo, useId } from "react";
import TextArea from "../../../components/controls/TextArea";
import InputLabel from "../../../components/utility/InputLabel";

export interface ModalTextAreaFieldProps {
  /** Label rendered above the text area. */
  label: string;
  /** Show the help "?" icon next to the label (default `true`). */
  helpIcon?: boolean;
  /** Current text value. */
  value: string;
  /** Fired on every change with the new value (no event). */
  onChange: (_value: string) => void;
  /** Optional rows for the underlying `<textarea>` (default 4). */
  rows?: number;
  /** Optional placeholder. */
  placeholder?: string;
  /** Disable the field. */
  disabled?: boolean;
  className?: string;
}

function ModalTextAreaFieldComponent({
  label,
  helpIcon = true,
  value,
  onChange,
  rows = 4,
  placeholder,
  disabled = false,
  className = "",
}: ModalTextAreaFieldProps) {
  const labelId = useId();

  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      <div id={labelId}>
        <InputLabel
          label={label}
          helpIcon={helpIcon}
          size="s"
          palette="default"
        />
      </div>
      <TextArea
        formHeader={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        size="large"
        rows={rows}
        appearance="embedded"
        placeholder={placeholder}
        disabled={disabled}
        aria-labelledby={labelId}
      />
    </div>
  );
}

ModalTextAreaFieldComponent.displayName = "ModalTextAreaField";

export default memo(ModalTextAreaFieldComponent);
