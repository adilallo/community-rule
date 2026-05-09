"use client";

/**
 * Editable policy title + description for method-card Create modals in Customize mode.
 * View mode continues to use {@link ContentLockup} via the `Create` modal defaults.
 */

import TextInput from "../../../components/controls/TextInput";
import ModalTextAreaField from "./ModalTextAreaField";

export interface MethodCardCustomizeModalHeaderProps {
  titleLabel: string;
  descriptionLabel: string;
  titleValue: string;
  descriptionValue: string;
  onTitleChange: (_value: string) => void;
  onDescriptionChange: (_value: string) => void;
  /** @default 3 */
  descriptionRows?: number;
  /** When false, only the policy title row is rendered (core values rename). */
  showDescription?: boolean;
}

export default function MethodCardCustomizeModalHeader({
  titleLabel,
  descriptionLabel,
  titleValue,
  descriptionValue,
  onTitleChange,
  onDescriptionChange,
  descriptionRows = 3,
  showDescription = true,
}: MethodCardCustomizeModalHeaderProps) {
  return (
    <div className="bg-[var(--color-surface-default-primary)] flex shrink-0 flex-col gap-4 px-[24px] py-[12px]">
      <TextInput
        label={titleLabel}
        value={titleValue}
        onChange={(e) => onTitleChange(e.target.value)}
        inputSize="medium"
      />
      {showDescription ? (
        <ModalTextAreaField
          label={descriptionLabel}
          value={descriptionValue}
          onChange={onDescriptionChange}
          rows={descriptionRows}
        />
      ) : null}
    </div>
  );
}
