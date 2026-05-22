"use client";

/**
 * Controlled field blocks for wizard-authored method cards in Create modals
 * (facet screens + final-review chip edit). When `onBlocksChange` is omitted,
 * blocks render read-only (disabled controls).
 *
 * Layout matches preset method editors ({@link CommunicationMethodEditFields},
 * {@link DecisionApproachEditFields}): {@link ModalTextAreaField},
 * {@link ApplicableScopeField} chip rows, {@link IncrementerBlock}.
 */

import { memo, useCallback, useRef, useState } from "react";
import { useMessages, useTranslation } from "../../../contexts/MessagesContext";
import Chip from "../../../components/controls/Chip";
import IncrementerBlock from "../../../components/controls/IncrementerBlock";
import Upload from "../../../components/controls/Upload";
import { ASSETS, getAssetPath } from "../../../../lib/assetUtils";
import ApplicableScopeField from "./ApplicableScopeField";
import InputLabel from "../../../components/type/InputLabel";
import type { CustomMethodCardFieldBlock } from "../../../../lib/create/customMethodCardFieldBlocks";
import ModalTextAreaField from "./ModalTextAreaField";
import { uploadCreateFlowFile } from "../../../../lib/create/uploadToServer";

const TEXT_VALUE_MAX = 8000;

export interface CustomMethodCardFieldBlocksSummaryProps {
  blocks: CustomMethodCardFieldBlock[];
  /** When set, fields update the draft via immutable block-array replacements. */
  onBlocksChange?: (_next: CustomMethodCardFieldBlock[]) => void;
}

function mapBlockById(
  blocks: CustomMethodCardFieldBlock[],
  blockId: string,
  mapFn: (_b: CustomMethodCardFieldBlock) => CustomMethodCardFieldBlock,
): CustomMethodCardFieldBlock[] {
  return blocks.map((b) => (b.id === blockId ? mapFn(b) : b));
}

function CustomMethodCardUploadBlockRow({
  block,
  blocks,
  patch,
  uploadFileInputAriaLabel,
  uploadHint,
  clearPendingUploadAriaLabel,
  clearPendingUploadTooltip,
  uploadPreviewImageAlt,
  noFileChosen,
}: {
  block: Extract<CustomMethodCardFieldBlock, { kind: "upload" }>;
  blocks: CustomMethodCardFieldBlock[];
  patch: (_next: CustomMethodCardFieldBlock[]) => void;
  uploadFileInputAriaLabel: string;
  uploadHint: string;
  clearPendingUploadAriaLabel: string;
  clearPendingUploadTooltip: string;
  uploadPreviewImageAlt: string;
  noFileChosen: string;
}) {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const tUpload = useTranslation("create.upload");
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const displayName = block.fileName?.trim() ? block.fileName : noFileChosen;
  const assetUrlTrimmed = block.assetUrl?.trim() ?? "";
  const hasAsset = assetUrlTrimmed.length > 0;

  const clearUpload = () =>
    patch(
      mapBlockById(blocks, block.id, (b) =>
        b.kind === "upload"
          ? { ...b, fileName: undefined, assetUrl: undefined }
          : b,
      ),
    );

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
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setErrorMessage(null);
          setBusy(true);
          void (async () => {
            try {
              const { url } = await uploadCreateFlowFile(
                file,
                "customMethodAttachment",
              );
              const name = file.name?.trim();
              patch(
                mapBlockById(blocks, block.id, (b) =>
                  b.kind === "upload"
                    ? {
                        ...b,
                        ...(name ? { fileName: name } : {}),
                        assetUrl: url,
                      }
                    : b,
                ),
              );
            } catch {
              setErrorMessage(tUpload("errors.generic"));
            } finally {
              setBusy(false);
            }
          })();
        }}
      />
      {hasAsset ? (
        <div className="relative inline-block max-w-full">
          <button
            type="button"
            onClick={clearUpload}
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
          hintText={busy ? tUpload("uploading") : uploadHint}
          onClick={() => {
            if (!busy) uploadInputRef.current?.click();
          }}
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

function CustomMethodCardFieldBlocksSummaryComponent({
  blocks,
  onBlocksChange,
}: CustomMethodCardFieldBlocksSummaryProps) {
  const m = useMessages();
  const wiz = m.create.customRule.customMethodCardWizard;
  const fm = wiz.fieldModals;
  const em = wiz.editModal;
  const emptyValue = em.readout.emptyValue;
  const noFileChosen = em.readout.noFileChosen;
  const readOnly = !onBlocksChange;

  const patch = useCallback(
    (next: CustomMethodCardFieldBlock[]) => {
      onBlocksChange?.(next);
    },
    [onBlocksChange],
  );

  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block) => {
        if (block.kind === "text") {
          return (
            <ModalTextAreaField
              key={block.id}
              label={block.blockTitle}
              rows={6}
              value={block.placeholderText}
              onChange={(v) =>
                patch(
                  mapBlockById(blocks, block.id, (b) =>
                    b.kind === "text"
                      ? { ...b, placeholderText: v.slice(0, TEXT_VALUE_MAX) }
                      : b,
                  ),
                )
              }
              disabled={readOnly}
            />
          );
        }

        if (block.kind === "badges") {
          if (readOnly) {
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <InputLabel
                  label={block.blockTitle}
                  helpIcon
                  size="s"
                  palette="default"
                />
                {block.options.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {block.options.map((opt, idx) => (
                      <Chip
                        key={`${block.id}-${idx}`}
                        label={opt}
                        state="selected"
                        palette="default"
                        size="s"
                        disabled
                        ariaLabel={opt}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="font-[family-name:var(--font-body)] text-[length:var(--font-size-body-m)] text-[var(--color-content-default-secondary)]">
                    {emptyValue}
                  </p>
                )}
              </div>
            );
          }
          return (
            <ApplicableScopeField
              key={block.id}
              label={block.blockTitle}
              addLabel={fm.badges.addOptionLabel}
              scopes={block.options}
              selectedScopes={block.options}
              onToggleScope={(scope) =>
                patch(
                  mapBlockById(blocks, block.id, (b) =>
                    b.kind === "badges"
                      ? { ...b, options: b.options.filter((o) => o !== scope) }
                      : b,
                  ),
                )
              }
              onAddScope={(scope) =>
                patch(
                  mapBlockById(blocks, block.id, (b) => {
                    if (b.kind !== "badges") return b;
                    if (b.options.includes(scope) || b.options.length >= 50)
                      return b;
                    return { ...b, options: [...b.options, scope] };
                  }),
                )
              }
            />
          );
        }

        if (block.kind === "upload") {
          return (
            <div key={block.id}>
              {readOnly ? (
                <div className="flex flex-col gap-2">
                  <InputLabel
                    label={block.blockTitle}
                    helpIcon
                    size="s"
                    palette="default"
                  />
                  {block.assetUrl?.trim() ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={block.assetUrl.trim()}
                      alt={
                        block.fileName?.trim() ||
                        block.blockTitle ||
                        noFileChosen
                      }
                      className="max-h-[160px] max-w-full rounded-[var(--measures-radius-200,8px)] object-contain"
                    />
                  ) : (
                    <p className="font-[family-name:var(--font-body)] text-[length:var(--font-size-body-m)] text-[var(--color-content-default-secondary)]">
                      {noFileChosen}
                    </p>
                  )}
                </div>
              ) : (
                <CustomMethodCardUploadBlockRow
                  block={block}
                  blocks={blocks}
                  patch={patch}
                  uploadFileInputAriaLabel={fm.upload.uploadFileInputAriaLabel}
                  uploadHint={fm.upload.uploadHint}
                  clearPendingUploadAriaLabel={
                    fm.upload.clearPendingUploadAriaLabel
                  }
                  clearPendingUploadTooltip={
                    fm.upload.clearPendingUploadTooltip
                  }
                  uploadPreviewImageAlt={fm.upload.uploadPreviewImageAlt}
                  noFileChosen={noFileChosen}
                />
              )}
            </div>
          );
        }

        return (
          <IncrementerBlock
            key={block.id}
            label={block.blockTitle}
            value={block.defaultPercent}
            min={1}
            max={100}
            step={1}
            disabled={readOnly}
            onChange={(v) =>
              patch(
                mapBlockById(blocks, block.id, (b) =>
                  b.kind === "proportion" ? { ...b, defaultPercent: v } : b,
                ),
              )
            }
            formatValue={(v) => `${v}%`}
            decrementAriaLabel={fm.proportion.decrementAriaLabel}
            incrementAriaLabel={fm.proportion.incrementAriaLabel}
          />
        );
      })}
    </div>
  );
}

const CustomMethodCardFieldBlocksSummary = memo(
  CustomMethodCardFieldBlocksSummaryComponent,
);
CustomMethodCardFieldBlocksSummary.displayName =
  "CustomMethodCardFieldBlocksSummary";

export default CustomMethodCardFieldBlocksSummary;
