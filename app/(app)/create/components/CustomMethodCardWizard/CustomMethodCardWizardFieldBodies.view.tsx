"use client";

import { memo } from "react";
import InputWithCounter from "../../../../components/controls/InputWithCounter";
import TextArea from "../../../../components/controls/TextArea";
import TextInput from "../../../../components/controls/TextInput";
import Upload from "../../../../components/controls/Upload";
import IncrementerBlock from "../../../../components/controls/IncrementerBlock";
import InputLabel from "../../../../components/type/InputLabel";
import ApplicableScopeField from "../ApplicableScopeField";
import { CUSTOM_METHOD_CARD_WIZARD_MAX_FIELD_CHARS } from "../../../../../lib/create/customMethodCardWizardConstants";
import type { CustomMethodCardWizardFieldBodiesViewProps } from "./CustomMethodCardWizard.types";

const TEXT_PLACEHOLDER_MAX = 8000;

function CustomMethodCardWizardFieldBodiesViewComponent({
  fieldType,
  copy,
  textBlockTitle,
  textPlaceholderBody,
  onTextBlockTitleChange,
  onTextPlaceholderBodyChange,
  badgeBlockTitle,
  badgeOptions,
  onBadgeBlockTitleChange,
  onBadgeAddOption,
  uploadBlockTitle,
  onUploadBlockTitleChange,
  fileInputRef,
  onFileChosen,
  proportionBlockTitle,
  proportionDefault,
  onProportionBlockTitleChange,
  onProportionDefaultChange,
}: CustomMethodCardWizardFieldBodiesViewProps) {
  if (fieldType === "text") {
    return (
      <div className="flex flex-col gap-[var(--spacing-scale-024)]">
        <InputWithCounter
          label={copy.text.blockTitleLabel}
          placeholder={copy.text.blockTitlePlaceholder}
          value={textBlockTitle}
          onChange={onTextBlockTitleChange}
          maxLength={CUSTOM_METHOD_CARD_WIZARD_MAX_FIELD_CHARS}
          showHelpIcon
        />
        <div className="flex flex-col gap-2">
          <InputLabel
            label={copy.text.placeholderLabel}
            helpIcon
            size="s"
            palette="default"
          />
          <TextArea
            formHeader={false}
            appearance="embedded"
            value={textPlaceholderBody}
            onChange={(e) => onTextPlaceholderBodyChange(e.target.value)}
            maxLength={TEXT_PLACEHOLDER_MAX}
            placeholder={copy.text.placeholderFieldPlaceholder}
            textHint={`${textPlaceholderBody.length}/${TEXT_PLACEHOLDER_MAX}`}
            className="w-full"
            rows={3}
          />
        </div>
      </div>
    );
  }

  if (fieldType === "badges") {
    return (
      <div className="flex flex-col gap-[var(--spacing-scale-024)]">
        <div className="flex flex-col gap-2">
          <InputLabel
            label={copy.badges.blockTitleLabel}
            helpIcon
            helperText={copy.requiredHint}
            size="s"
            palette="default"
          />
          <TextInput
            formHeader={false}
            placeholder={copy.badges.blockTitlePlaceholder}
            value={badgeBlockTitle}
            onChange={(e) => onBadgeBlockTitleChange(e.target.value)}
            maxLength={CUSTOM_METHOD_CARD_WIZARD_MAX_FIELD_CHARS}
            showHelpIcon={false}
          />
        </div>
        <ApplicableScopeField
          label={copy.badges.optionsLabel}
          addLabel={copy.badges.addOptionLabel}
          scopes={badgeOptions}
          selectedScopes={badgeOptions}
          onToggleScope={() => {
            /* product: all badge options stay selected */
          }}
          onAddScope={onBadgeAddOption}
        />
      </div>
    );
  }

  if (fieldType === "upload") {
    return (
      <div className="flex flex-col gap-[var(--spacing-scale-024)]">
        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          tabIndex={-1}
          aria-label={copy.upload.uploadFileInputAriaLabel}
          onChange={onFileChosen}
        />
        <InputWithCounter
          label={copy.upload.blockTitleLabel}
          placeholder={copy.upload.blockTitlePlaceholder}
          value={uploadBlockTitle}
          onChange={onUploadBlockTitleChange}
          maxLength={CUSTOM_METHOD_CARD_WIZARD_MAX_FIELD_CHARS}
          showHelpIcon
        />
        <Upload
          hintText={copy.upload.uploadHint}
          onClick={() => fileInputRef.current?.click()}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-scale-024)]">
      <InputWithCounter
        label={copy.proportion.blockTitleLabel}
        placeholder={copy.proportion.blockTitlePlaceholder}
        value={proportionBlockTitle}
        onChange={onProportionBlockTitleChange}
        maxLength={CUSTOM_METHOD_CARD_WIZARD_MAX_FIELD_CHARS}
        showHelpIcon
      />
      <IncrementerBlock
        label={copy.proportion.defaultLabel}
        value={proportionDefault}
        min={1}
        max={100}
        step={1}
        onChange={onProportionDefaultChange}
        formatValue={(v) => `${v}%`}
        decrementAriaLabel={copy.proportion.decrementAriaLabel}
        incrementAriaLabel={copy.proportion.incrementAriaLabel}
        blockClassName="w-full"
      />
    </div>
  );
}

export const CustomMethodCardWizardFieldBodiesView = memo(
  CustomMethodCardWizardFieldBodiesViewComponent,
);
CustomMethodCardWizardFieldBodiesView.displayName =
  "CustomMethodCardWizardFieldBodiesView";
