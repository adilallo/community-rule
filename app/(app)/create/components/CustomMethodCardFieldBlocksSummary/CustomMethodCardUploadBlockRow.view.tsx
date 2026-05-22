"use client";

import { memo } from "react";
import Upload from "../../../../components/controls/Upload";
import InputLabel from "../../../../components/type/InputLabel";
import { ASSETS, getAssetPath } from "../../../../../lib/assetUtils";
import type { CustomMethodCardUploadBlockRowViewProps } from "./CustomMethodCardFieldBlocksSummary.types";

function CustomMethodCardUploadBlockRowViewComponent({
  block,
  uploadFileInputAriaLabel,
  uploadHint,
  clearPendingUploadAriaLabel,
  clearPendingUploadTooltip,
  uploadPreviewImageAlt,
  noFileChosen,
  uploadInputRef,
  busy,
  uploadingHint,
  errorMessage,
  onClearUpload,
  onFileInputChange,
  onUploadClick,
}: CustomMethodCardUploadBlockRowViewProps) {
  const displayName = block.fileName?.trim() ? block.fileName : noFileChosen;
  const assetUrlTrimmed = block.assetUrl?.trim() ?? "";
  const hasAsset = assetUrlTrimmed.length > 0;

  return (
    <div className="flex flex-col gap-2">
      <InputLabel
        label={block.blockTitle}
        helpIcon
        size="s"
        palette="default"
      />
      {!hasAsset ? (
        <p className="font-[family-name:var(--font-body)] text-[length:var(--font-size-body-m)] text-[var(--color-content-default-secondary)]">
          {displayName}
        </p>
      ) : null}
      <input
        ref={uploadInputRef}
        type="file"
        className="sr-only"
        tabIndex={-1}
        accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
        aria-label={uploadFileInputAriaLabel}
        onChange={onFileInputChange}
      />
      {hasAsset ? (
        <div className="relative inline-block max-w-full">
          <button
            type="button"
            onClick={onClearUpload}
            className="absolute right-[8px] top-[8px] z-[1] flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full bg-[var(--color-surface-default-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-invert-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-default-primary)]"
            aria-label={clearPendingUploadAriaLabel}
            title={clearPendingUploadTooltip}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- matches ModalHeader close control */}
            <img
              src={getAssetPath(ASSETS.ICON_CLOSE)}
              alt=""
              className="h-[16px] w-[16px]"
              style={{
                filter: "brightness(0) invert(1)",
              }}
            />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element -- same-origin upload URL */}
          <img
            src={assetUrlTrimmed}
            alt={uploadPreviewImageAlt}
            className="max-h-[160px] max-w-full rounded-[var(--measures-radius-200,8px)] object-contain"
          />
        </div>
      ) : (
        <Upload
          active={!busy}
          hintText={busy ? uploadingHint : uploadHint}
          onClick={onUploadClick}
        />
      )}
      {errorMessage ? (
        <p
          className="font-[family-name:var(--font-body)] text-[length:var(--font-size-body-s)] text-[var(--color-content-default-secondary)]"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

export const CustomMethodCardUploadBlockRowView = memo(
  CustomMethodCardUploadBlockRowViewComponent,
);
CustomMethodCardUploadBlockRowView.displayName =
  "CustomMethodCardUploadBlockRowView";
