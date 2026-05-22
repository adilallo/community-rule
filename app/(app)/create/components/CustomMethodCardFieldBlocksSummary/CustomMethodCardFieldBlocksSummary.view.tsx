"use client";

import { memo } from "react";
import Chip from "../../../../components/controls/Chip";
import IncrementerBlock from "../../../../components/controls/IncrementerBlock";
import InputLabel from "../../../../components/type/InputLabel";
import type { CustomMethodCardFieldBlock } from "../../../../../lib/create/customMethodCardFieldBlocks";
import ApplicableScopeField from "../ApplicableScopeField";
import ModalTextAreaField from "../ModalTextAreaField";
import { CustomMethodCardUploadBlockRow } from "./CustomMethodCardUploadBlockRow.container";
import type { CustomMethodCardFieldBlocksSummaryViewProps } from "./CustomMethodCardFieldBlocksSummary.types";

const TEXT_VALUE_MAX = 8000;

function mapBlockById(
  blocks: CustomMethodCardFieldBlock[],
  blockId: string,
  mapFn: (_b: CustomMethodCardFieldBlock) => CustomMethodCardFieldBlock,
): CustomMethodCardFieldBlock[] {
  return blocks.map((b) => (b.id === blockId ? mapFn(b) : b));
}

function CustomMethodCardFieldBlocksSummaryViewComponent({
  blocks,
  readOnly,
  emptyValue,
  noFileChosen,
  fieldModalsCopy,
  onPatch,
}: CustomMethodCardFieldBlocksSummaryViewProps) {
  const fm = fieldModalsCopy;

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
                onPatch(
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
                onPatch(
                  mapBlockById(blocks, block.id, (b) =>
                    b.kind === "badges"
                      ? { ...b, options: b.options.filter((o) => o !== scope) }
                      : b,
                  ),
                )
              }
              onAddScope={(scope) =>
                onPatch(
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
                  onPatch={onPatch}
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
              onPatch(
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

export const CustomMethodCardFieldBlocksSummaryView = memo(
  CustomMethodCardFieldBlocksSummaryViewComponent,
);
CustomMethodCardFieldBlocksSummaryView.displayName =
  "CustomMethodCardFieldBlocksSummaryView";
