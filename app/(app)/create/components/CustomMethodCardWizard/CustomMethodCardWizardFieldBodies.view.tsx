"use client";

import { memo } from "react";
import { getAssetPath } from "../../../../../lib/assetUtils";
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
  onClearPendingUpload,
  uploadAssetPreviewUrl = null,
  uploadPersisting = false,
  uploadBusyHint,
  uploadErrorMessage = null,
  proportionBlockTitle,
  proportionDefault,
  onProportionBlockTitleChange,
  onProportionDefaultChange,
}: CustomMethodCardWizardFieldBodiesViewProps) {
  const uploadPreviewTrimmed = uploadAssetPreviewUrl?.trim() ?? "";
  const hasUploadPreview = uploadPreviewTrimmed.length > 0;

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
        {hasUploadPreview ? (
          <div className="relative inline-block max-w-full">
            <button
              type="button"
              onClick={onClearPendingUpload}
              className="absolute right-[8px] top-[8px] z-[1] flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full bg-[var(--color-surface-default-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-invert-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-default-primary)]"
              aria-label={copy.upload.clearPendingUploadAriaLabel}
              title={copy.upload.clearPendingUploadTooltip}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- matches ModalHeader close control */}
              <img
                src={getAssetPath("assets/Icon_Close.svg")}
                alt=""
                className="h-[16px] w-[16px]"
                style={{
                  filter: "brightness(0) invert(1)",
                }}
              />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element -- blob or same-origin upload URL */}
            <img
              src={uploadPreviewTrimmed}
              alt={copy.upload.uploadPreviewImageAlt}
              className="max-h-[160px] max-w-full rounded-[var(--measures-radius-200,8px)] object-contain"
            />
          </div>
        ) : (
          <Upload
            active={!uploadPersisting}
            hintText={
              uploadPersisting && uploadBusyHint
                ? uploadBusyHint
                : copy.upload.uploadHint
            }
            onClick={() => {
              if (!uploadPersisting) fileInputRef.current?.click();
            }}
          />
        )}
        {uploadErrorMessage ? (
          <p
            className="font-[family-name:var(--font-body)] text-[length:var(--font-size-body-s)] text-[var(--color-content-default-secondary)]"
            role="alert"
          >
            {uploadErrorMessage}
          </p>
        ) : null}
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
